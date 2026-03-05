import React from "react";
import { LoginForm } from "./@LoginComponents/LoginForm";
import { ListStart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* Header */}
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
           <ListStart className="h-7 w-7 text-blue-400" />
            <span className="text-xl font-bold">Qly</span>
          </div>
          <CardTitle className="text-2xl">
            Welcome Back to Qly
          </CardTitle>

          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <LoginForm/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
