"use client";
import React from "react";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function SubmitButton({
  children,

  className,
  variant,
  data,
  type,
  ...props
}: {
  data?: any;
  children: React.ReactNode;

  className?: string;
  type?: "submit" | "reset" | "button";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type={type}
      variant={variant}
      className={className}
      {...props}
      disabled={pending}
    >
      {pending ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}

      {children}
    </Button>
  );
}
