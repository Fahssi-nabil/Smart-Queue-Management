"use client";

import React from "react";
import InfoTicket from "./@TicketComponents/InfoTicket";
import { ArrowLeft, Clock, Ticket } from "lucide-react";
import Link from "next/link";

const TicketPage = () => {
  return (
    <main className="py-12 px-6">
      
      {/* Top Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/customer/home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          
        </Link>
      </div>

      {/* Page Header */}
      <header className="max-w-4xl mx-auto text-center mb-10">
        <Ticket className="w-10 h-10 mx-auto text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">
          Your Ticket Information
        </h1>
        <p className="text-gray-600 mt-2">
          Keep this ticket safe and check your position in the queue.
        </p>
      </header>

      {/* Ticket Card */}
      <section className="max-w-4xl mx-auto">
        <InfoTicket />
      </section>

    </main>
  );
};

export default TicketPage;
