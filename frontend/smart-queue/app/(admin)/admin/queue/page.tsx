"use client";

import React, { useState, useEffect } from "react";
import { TicketService } from "@/services/ticketService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RefreshCw, ArrowLeft, PhoneCall } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { is } from "zod/locales";

interface Ticket {
  id: number;
  ticketNumber: number;
  status: string;
  serviceType: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  position: number;
  estimatedWaitTime?: number;
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [callLoading, setCallLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // ✅ WebSocket Connection
  const { isConnected } = useWebSocket((message) => {
    console.log("📩 WebSocket:", message.type);
    
    // ✅ Auto-refresh on any queue update
    if (
      message.type === "TICKET_CREATED" ||
      message.type === "TICKET_CALLED" ||
      message.type === "QUEUE_UPDATE"
    ) {
      fetchAllTickets();
    }
  });

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const data = await TicketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  // ✅ Call Next Ticket Handler
  const handleCallNext = async () => {
    setCallLoading(true);
    try {
      await TicketService.callNextTicket();
      toast.success("Next ticket called successfully!");
      // No need to manually refresh - WebSocket will trigger it
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Failed to call next ticket.";

      if (message === "No tickets in waiting queue") {
        toast.info("Queue is empty - no customers waiting");
      } else {
        toast.error(message);
      }
    } finally {
      setCallLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "waiting":
        return "text-yellow-700 bg-yellow-100";
      case "serving":
        return "text-green-700 bg-green-100";
      case "done":
        return "text-blue-700 bg-blue-100";
      case "skipped":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const waitingTickets = tickets.filter(
    (t) => t.status?.toLowerCase() === "waiting"
  );
  const isQueueEmpty = waitingTickets.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    Queue Management
                  </h1>
                  {/* ✅ WebSocket Status Indicator */}
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      isConnected
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                    {isConnected ? "Live" : "Offline"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time ticket management and status tracking
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchAllTickets}
                variant="outline"
                size="default"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              {/* Call Next Ticket Button */}
              <Button
                onClick={handleCallNext}
                disabled={callLoading || isQueueEmpty}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {callLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    Calling...
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Call Next Ticket
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Empty Queue Warning */}
          {isQueueEmpty && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ Queue is empty - no customers waiting. "Call Next Ticket"
                button is disabled.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="px-6 py-6">
          {loading && tickets.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
              <div className="text-center">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  Loading tickets...
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden border border-border bg-card rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Ticket #</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Service</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-center font-semibold">
                      Position
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Est. Wait (min)
                    </TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No tickets found.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-semibold text-foreground">
                          #{ticket.ticketNumber}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {ticket.customerName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {ticket.customerEmail}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {ticket.serviceType}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-foreground">
                          {ticket.position || "-"}
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          {ticket.estimatedWaitTime ?? 0}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;