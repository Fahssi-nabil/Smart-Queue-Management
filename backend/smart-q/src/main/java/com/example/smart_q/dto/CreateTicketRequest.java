package com.example.smart_q.dto;

import com.example.smart_q.enums.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotNull(message = "Service type is required")
    private ServiceType serviceType;
}
