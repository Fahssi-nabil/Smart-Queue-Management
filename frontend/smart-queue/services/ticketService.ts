import { api } from "@/lib/api";
import { TicketInfo } from "@/types/profile.types";

export const TicketService = {
  /**
   * Get current user ticket
   */
  getTicket: async (): Promise<TicketInfo> => {
    const response = await api.get<TicketInfo>("/queue/tickets/my-ticket");
    return response.data;
  },

  getAllTickets: async (): Promise<TicketInfo[]> => {
    const { data } = await api.get<TicketInfo[]>("/queue/all-tickets");
    return data;
  },

  /**
   * ✅ Call next ticket (Admin)
   */
  callNextTicket: async (): Promise<TicketInfo> => {
    const response = await api.post<TicketInfo>("/queue/call-next");
    return response.data;
  },

  /**
   * ✅ Get currently serving ticket (Admin)
   */
  getCurrentlyServing: async (): Promise<TicketInfo> => {
    const response = await api.get<TicketInfo>("/queue/currently-serving");
    return response.data;
  },
};
