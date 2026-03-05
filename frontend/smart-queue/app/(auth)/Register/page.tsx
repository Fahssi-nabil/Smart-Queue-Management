import React from "react";
import { RegisterForm } from "./@RegisterComponents/RegisterForm";
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
            Welcome to Qly
          </CardTitle>

          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
