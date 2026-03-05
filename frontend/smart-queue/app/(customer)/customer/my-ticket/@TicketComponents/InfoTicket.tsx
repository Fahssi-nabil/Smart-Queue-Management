"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Mail, CheckCircle2, Ticket } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useWebSocket } from "@/hooks/useWebSocket";

interface InfoTicketProps {
  ticketNumber: string;
  fullName: string;
  email: string;
  queuePosition: number;
  estimatedWaitTime: number;
  createdAt: string;
  status?: string;
  serviceType?: string;
}

const InfoTicket = () => {
  const [ticketInfo, setTicketInfo] = useState<InfoTicketProps | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ WebSocket Connection
  const { isConnected } = useWebSocket((message) => {
    console.log("📩 Customer received:", message.type);

    // ✅ Refresh ticket on queue updates
    if (
      message.type === "TICKET_CALLED" ||
      message.type === "QUEUE_UPDATE"
    ) {
      fetchTicketInfo();
    }
  });

  const fetchTicketInfo = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to view your ticket information.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8084/api/queue/tickets/my-ticket",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log(data);
      
      setTicketInfo({
        ticketNumber: `TKF-${data.ticketNumber}`,
        fullName: data.customerName,
        email: data.customerEmail,
        queuePosition: data.position,
        estimatedWaitTime: data.estimatedWaitTime,
        createdAt: new Date(data.createdAt).toLocaleString(),
        status: data.status?.toLowerCase(),
        serviceType: data.serviceType,
      });
    } catch (error) {
      console.error(error);
      setTicketInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketInfo();
  }, []);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="w-14 h-14" />
      </div>
    );
  }

  // ❌ No Ticket
  if (!ticketInfo) {
    return (
      <div className="text-center py-20 text-gray-500">
        No active ticket found.
      </div>
    );
  }

  // ✅ Ticket Done
  if (ticketInfo.status === "done") {
    return (
      <div className="text-center py-20">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Service Completed!
        </h2>
        <p className="text-gray-600">
          Your service has been completed. Thank you!
        </p>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-400 text-yellow-900";
      case "serving":
        return "bg-green-400 text-green-900";
      case "done":
        return "bg-blue-400 text-blue-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* ✅ WebSocket Status Indicator */}
      <div className="flex justify-end">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          {isConnected ? "Live Updates" : "Offline"}
        </span>
      </div>

      <Card className="border-0 shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h2 className="text-sm font-semibold opacity-90">
                  Ticket Information
                </h2>
                <p className="text-2xl font-bold">{ticketInfo.ticketNumber}</p>
              </div>
            </div>

            <Badge
              className={`${getStatusColor(
                ticketInfo.status
              )} font-semibold text-sm px-4 py-2`}
            >
              {ticketInfo.status?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-slate-600">
                    Customer Name
                  </label>
                </div>
                <p className="text-lg font-semibold text-slate-900 ml-8">
                  {ticketInfo.fullName}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-slate-600">
                    Email Address
                  </label>
                </div>
                <p className="text-lg font-semibold text-blue-600 ml-8 break-all">
                  {ticketInfo.email}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-slate-600">
                    Queue Position
                  </label>
                </div>
                <p className="text-3xl font-bold text-blue-600 ml-8">
                  {ticketInfo.queuePosition === 0
                    ? "Being Served Now!"
                    : `#${ticketInfo.queuePosition}`}
                </p>
              </div>

              {ticketInfo.serviceType && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-semibold text-slate-600">
                      Service Type
                    </label>
                  </div>
                  <p className="text-lg font-semibold text-slate-900 ml-8">
                    {ticketInfo.serviceType}
                  </p>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <label className="text-sm font-semibold text-slate-600">
                    Created At
                  </label>
                </div>
                <p className="text-lg font-semibold text-slate-900 ml-8">
                  {ticketInfo.createdAt}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  Est. Wait Time
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {ticketInfo.estimatedWaitTime} min
                </p>
              </div>

              {/* ✅ Position Status */}
              {ticketInfo.queuePosition === 0 && (
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 animate-pulse">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    🎉 You're Being Served!
                  </p>
                  <p className="text-xs text-green-700">
                    Please proceed to the service counter
                  </p>
                </div>
              )}

              {ticketInfo.queuePosition === 1 && (
                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    ⚠️ You're Next!
                  </p>
                  <p className="text-xs text-yellow-700">
                    Please be ready, you'll be called soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Please keep your ticket ID for reference. You will be called when
            it's your turn. Updates are automatic.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InfoTicket;