"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { TicketService } from "@/services/ticketService";

const formSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type"),
});

type FormValues = z.infer<typeof formSchema>;

const serviceTypes = [
  { id: "WITHDRAWAL", label: "Withdrawal" },
  { id: "DEPOSIT", label: "Deposit" },
  { id: "TRANSFER", label: "Transfer" },
  { id: "BILL_PAYMENT", label: "Bill Payment" },
  { id: "ACCOUNT_QUERY", label: "Account Query" },
  { id: "LOAN_APPLICATION", label: "Loan Application" },
];

export default function QueuePage() {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [checking, setChecking] = useState(true);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { serviceType: "" },
  });

  // ✅ Check if user already has an active ticket on mount
  useEffect(() => {
    const checkExistingTicket = async () => {
      try {
        const ticket = await TicketService.getTicket();
        setHasTicket(true);
      } catch (error: any) {
        // ✅ 400 = no active ticket = show form
        setHasTicket(false);
      } finally {
        setChecking(false);
      }
    };

    checkExistingTicket();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token - please login");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8084/api/queue/tickets",
        { serviceType: values.serviceType },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // mark that user now has a ticket
      toast.success("Ticket created successfully!");
      router.push("/customer/my-ticket");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  if (checking)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );

 

  // ✅ No ticket - show button + dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={hasTicket}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Ticket className="w-4 h-4 mr-2" />
          Get Ticket
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Ticket</DialogTitle>
          <DialogDescription>Select a service type</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
