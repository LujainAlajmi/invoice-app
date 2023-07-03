"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronFirst,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { Invoice } from "@prisma/client";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "",
  },

  {
    accessorKey: "clientName",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue("clientName")}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentDue",
    header: "",
    cell: ({ row }) => {
      const date = new Date(row.getValue("paymentDue"));
      const formatted = new Intl.DateTimeFormat("en-UK", {
        dateStyle: "medium",
      }).format(date);

      return <div className="text-muted-foreground"> Due {formatted}</div>;
    },
  },
  {
    accessorKey: "total",
    header: "",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GBP",
      }).format(amount);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("status");

      if (status === "paid") {
        return <Badge variant="paid">Paid</Badge>;
      }
      if (status === "pending") {
        return <Badge variant="pending">Pending</Badge>;
      }
      if (status === "draft") {
        return <Badge variant="secondary">Draft</Badge>;
      }
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link href={`/invoice/${row.getValue("id")}`}>
          <Button variant="ghost">
            <ChevronRight />
          </Button>
        </Link>
      );
    },
  },
];
