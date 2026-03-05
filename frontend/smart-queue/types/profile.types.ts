export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ChangePasswordResponse {
  message: string;
}


export interface TicketInfo {
    id : number;
    ticketNumber: number;

}

export interface TicketInfo {
  id: number;                // ticket ID
  ticketNumber: number;      // ticket number
  status: string;      // ticket status, e.g., "WAITING", "DONE"
  serviceType: string;  // service type, e.g., "WITHDRAWAL"
  customerName: string;      // customer's name
  customerEmail: string;     // customer's email
  createdAt: string;         // timestamp as string
  position: number;          // position in queue
  estimatedWaitTime?: number; // optional estimated wait time in minutes
}