import {
  LayoutDashboard,
  Ticket,
  Users,
  Clock,
  Activity,
  BarChart,
  User,
  LogOut,
  Home,
} from "lucide-react";
import { logout } from "./auth";
export default function Menu(role: string) {
  
  /* =======================
   ADMIN MENU - OPTIMIZED
   ======================= */
const adminMenu = [
  {
    title: "Overview",
    options: [
      { 
        name: "Dashboard", 
        path: "/admin/dashboard", 
        icon: LayoutDashboard,
        description: "System overview & statistics"
      },
    ],
  },
  {
    title: "Queue Management",
    options: [
      { 
        name: "Queue", 
        path: "/admin/queue", 
        icon: Users,
        description: "Manage customer queue & call next ticket"
      },
    ],
  },
  {
    title: "Reports",
    options: [
      { 
        name: "Analytics", 
        path: "/admin/analytics", 
        icon: BarChart,
        description: "Performance reports & insights"
      },
    ],
  },
  {
    title: "Users",
    options: [
      { 
        name: "Users", 
        path: "/admin/users", 
        icon: Users,
        description: "Manage customer accounts"
      },
    ],
  },
  {
    title: "Account",
    options: [
      { 
        name: "Profile", 
        path: "/profile", 
        icon: User,
        description: "View & edit your profile"
      },
      { 
        name: "Logout", 
        action: logout, 
        icon: LogOut,
        description: "Sign out of your account"
      },
    ],
  },
];



  /* =======================
     CUSTOMER MENU
     ======================= */
  const customerMenu = [
  {
    title: "Home",
    options: [{ name: "Welcome", path: "/customer/home", icon: Home }],
  },
  {
    title: "My Queue",
    options: [
      { name: "Join Queue", path: "/customer/join", icon: Ticket },
      { name: "My Ticket", path: "/customer/my-ticket", icon: Users },
    ],
  },
  {
    title: "Account",
    options: [
      { name: "Profile", path: "/profile", icon: User },
      { name: "Logout", action: logout, icon: LogOut },
    ],
  },
];

  /* =======================
     ROLE CHECK
     ======================= */
  if (role === "ADMIN") return adminMenu;
  if (role === "CUSTOMER") return customerMenu;

  return [];
}
