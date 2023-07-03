"use client";
import React from "react";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ActionButton({
  children,
  formAction,
  className,
  variant,
  data,
  type,
  ...props
}: {
  data?: any;
  children: React.ReactNode;
  formAction?: any;
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
  let [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => startTransition(() => formAction(data))}
      type={type}
      variant={variant}
      className={className}
      {...props}
      disabled={isPending}
    >
      {isPending ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}

      {children}
    </Button>
  );
}
