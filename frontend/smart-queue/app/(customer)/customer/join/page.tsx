"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import GetTicket from "./@JoinComponents/GetTicket";

import { ArrowLeft, CheckCircle, Clock, Shield } from "lucide-react";
import Link from "next/link";

const page = () => {
  const serviceTypes = [
    { id: "WITHDRAWAL", label: "Withdrawal" },
    { id: "DEPOSIT", label: "Deposit" },
    { id: "TRANSFER", label: "Transfer" },
    { id: "BILL_PAYMENT", label: "Bill Payment" },
    { id: "ACCOUNT_QUERY", label: "Account Query" },
    { id: "LOAN_APPLICATION", label: "Loan Application" },
  ];
  return (
    <main className="py-3 px-6">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto py-8 px-6 flex items-center justify-between">
          {/* Left Side: Back + Title */}
          <div className="flex items-start gap-4">
            <Link
              href="/customer/home"
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Queue Management
              </h1>
              <p className="text-gray-600 mt-1">
                Get your ticket and join the queue
              </p>
            </div>
          </div>
          <GetTicket />
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Save Time
          </h3>
          <p className="text-gray-600 text-sm">
            No more waiting in physical queues. Get a ticket and wait
            comfortably.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Instant Service
          </h3>
          <p className="text-gray-600 text-sm">
            Quick ticket generation. Know your queue position immediately.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure & Simple
          </h3>
          <p className="text-gray-600 text-sm">
            Safe and straightforward process. Your data is protected.
          </p>
        </div>
      </section>

      {/* How It Works + Services */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <ol className="space-y-4">
            {["Click Get Ticket", "Select Service", "Get Your Number"].map(
              (step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{step}</p>
                    <p className="text-gray-600 text-sm">
                      {i === 0 && "Click the button to start the process"}
                      {i === 1 && "Choose the service you need"}
                      {i === 2 && "Receive your ticket number immediately"}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Services
          </h2>
          <ul className="space-y-3">
            {serviceTypes.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-gray-700">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default page;
