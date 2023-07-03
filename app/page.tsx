import { ModeToggle } from "@/components/ModeToggle";
import InvoiceForm from "@/components/InvoiceForm";
import prisma from "@/lib/prisma";

import { getCurrentUser } from "@/lib/session";

import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { Invoice } from "@prisma/client";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        <ModeToggle />
        <Link href={"/api/auth/signin"}>sign in</Link>
      </div>
    );
  }

  const invoices: Invoice[] = await prisma.invoice.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="w-3/4 mx-auto">
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}
