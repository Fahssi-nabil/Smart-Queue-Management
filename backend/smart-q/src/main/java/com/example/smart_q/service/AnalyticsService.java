package com.example.smart_q.service;


import com.example.smart_q.dto.KpiResponse;
import com.example.smart_q.dto.RecentActivityResponse;
import com.example.smart_q.dto.ServiceTypeBreakdownResponse;
import com.example.smart_q.dto.StatusDistributionResponse;
import com.example.smart_q.enums.ServiceType;
import com.example.smart_q.enums.TicketStatus;
import com.example.smart_q.model.QueueTicket;
import com.example.smart_q.repository.QueueTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final QueueTicketRepository queueTicketRepository;

    /**
     * Get KPI stats
     */
    public KpiResponse getKpiStats() {
        // Get all tickets
        List<QueueTicket> allTickets = queueTicketRepository.findAll();

        // Get today's tickets
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        List<QueueTicket> todayTickets = allTickets.stream()
                .filter(t -> t.getCreatedAt().isAfter(startOfDay) &&
                        t.getCreatedAt().isBefore(endOfDay))
                .collect(Collectors.toList());

        // 1. Total Served (DONE tickets)
        Integer totalServed = (int) allTickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.DONE)
                .count();

        // 2. Average Wait Time (in minutes)
        Double averageWaitTime = calculateAverageWaitTime(allTickets);

        // 3. Total Today
        Integer totalToday = todayTickets.size();

        // 4. Skip Rate (percentage)
        Double skipRate = calculateSkipRate(allTickets);

        log.info("KPI Stats - Served: {}, Avg Wait: {}, Today: {}, Skip Rate: {}%",
                totalServed, averageWaitTime, totalToday, skipRate);

        return new KpiResponse(totalServed, averageWaitTime, totalToday, skipRate);
    }


    /**
     * ✅ NEW: Get service type breakdown
     */
    public ServiceTypeBreakdownResponse getServiceTypeBreakdown() {
        List<QueueTicket> allTickets = queueTicketRepository.findAll();

        if (allTickets.isEmpty()) {
            return new ServiceTypeBreakdownResponse(new ArrayList<>());
        }

        // Group tickets by service type and count
        Map<ServiceType, Long> serviceTypeCounts = allTickets.stream()
                .collect(Collectors.groupingBy(
                        QueueTicket::getServiceType,
                        Collectors.counting()
                ));

        // Convert to response format with percentages
        List<ServiceTypeBreakdownResponse.ServiceTypeData> data = serviceTypeCounts.entrySet().stream()
                .map(entry -> {
                    String serviceType = entry.getKey().name();
                    Integer count = entry.getValue().intValue();
                    Double percentage = Math.round((count * 100.0 / allTickets.size()) * 10.0) / 10.0;

                    return new ServiceTypeBreakdownResponse.ServiceTypeData(
                            serviceType,
                            count,
                            percentage
                    );
                })
                .sorted(Comparator.comparingInt(ServiceTypeBreakdownResponse.ServiceTypeData::getCount).reversed())
                .collect(Collectors.toList());

        log.info("Service type breakdown calculated: {} types", data.size());

        return new ServiceTypeBreakdownResponse(data);
    }


    /**
     * ✅ NEW: Get status distribution
     */
    public StatusDistributionResponse getStatusDistribution() {
        List<QueueTicket> allTickets = queueTicketRepository.findAll();

        if (allTickets.isEmpty()) {
            return new StatusDistributionResponse(new ArrayList<>());
        }

        // Group tickets by status and count
        Map<TicketStatus, Long> statusCounts = allTickets.stream()
                .collect(Collectors.groupingBy(
                        QueueTicket::getStatus,
                        Collectors.counting()
                ));

        // Convert to response format with percentages
        List<StatusDistributionResponse.StatusData> data = statusCounts.entrySet().stream()
                .map(entry -> {
                    String status = entry.getKey().name();
                    Integer count = entry.getValue().intValue();
                    Double percentage = Math.round((count * 100.0 / allTickets.size()) * 10.0) / 10.0;

                    return new StatusDistributionResponse.StatusData(
                            status,
                            count,
                            percentage
                    );
                })
                .sorted(Comparator.comparingInt(StatusDistributionResponse.StatusData::getCount).reversed())
                .collect(Collectors.toList());

        log.info("Status distribution calculated: {} statuses", data.size());

        return new StatusDistributionResponse(data);
    }

    /**
     * ✅ NEW: Get recent activity (last 10 tickets)
     */
    public RecentActivityResponse getRecentActivity() {
        List<QueueTicket> allTickets = queueTicketRepository.findAll();

        if (allTickets.isEmpty()) {
            return new RecentActivityResponse(new ArrayList<>());
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        List<RecentActivityResponse.ActivityData> data = allTickets.stream()
                .sorted(Comparator.comparing(QueueTicket::getCreatedAt).reversed())
                .limit(10)
                .map(ticket -> {
                    Integer waitTime = 0;

                    // Calculate wait time only for DONE tickets
                    if (ticket.getStatus() == TicketStatus.DONE && ticket.getServedAt() != null) {
                        waitTime = (int) Duration.between(
                                ticket.getCreatedAt(),
                                ticket.getServedAt()
                        ).toMinutes();
                    }

                    String customerName = ticket.getUser().getAnonymized() != null && ticket.getUser().getAnonymized()
                            ? "Deleted User"
                            : ticket.getUser().getName();

                    return new RecentActivityResponse.ActivityData(
                            ticket.getId(),
                            ticket.getTicketNumber(),
                            customerName,
                            ticket.getServiceType().name(),
                            ticket.getStatus().name(),
                            waitTime,
                            ticket.getCreatedAt().format(formatter)
                    );
                })
                .collect(Collectors.toList());

        log.info("Recent activity fetched: {} tickets", data.size());

        return new RecentActivityResponse(data);
    }



    /**
     * Calculate average wait time from created to served
     */
    private Double calculateAverageWaitTime(List<QueueTicket> tickets) {
        List<QueueTicket> doneTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.DONE &&
                        t.getServedAt() != null)
                .collect(Collectors.toList());

        if (doneTickets.isEmpty()) {
            return 0.0;
        }

        double totalWaitMinutes = doneTickets.stream()
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getServedAt()).toMinutes())
                .average()
                .orElse(0.0);

        return Math.round(totalWaitMinutes * 10.0) / 10.0; // Round to 1 decimal
    }

    /**
     * Calculate skip rate (percentage of skipped tickets)
     */
    private Double calculateSkipRate(List<QueueTicket> tickets) {
        if (tickets.isEmpty()) {
            return 0.0;
        }

        long skipped = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.SKIPPED)
                .count();

        double rate = (skipped * 100.0) / tickets.size();
        return Math.round(rate * 10.0) / 10.0; // Round to 1 decimal
    }
}
