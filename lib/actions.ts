"use server";

import { Invoice, Prisma, User } from "@prisma/client";
import prisma from "./prisma";
import { getCurrentUser } from "./session";
import { revalidatePath } from "next/cache";

export async function markInvoiceAsPaid(values: FormData) {
  const newId = values.get("id");

  const data = await prisma.invoice.update({
    where: {
      id: String(newId),
    },
    data: { status: "paid" },
  });

  revalidatePath(`/invoice/${data.id}`);

  //revalidatePath("/");
}

export async function createInvoice(invoice: Invoice) {
  const user = await getCurrentUser();

  const data = await prisma.invoice.create({
    data: {
      clientAddress: invoice.clientAddress as Prisma.JsonObject,
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      senderAddress: invoice.senderAddress as Prisma.JsonObject,
      status: invoice.status,
      createdAt: new Date(invoice.createdAt),
      paymentTerms: invoice.paymentTerms,
      description: invoice.description,
      paymentDue: new Date(invoice.paymentDue),
      items: invoice.items as Prisma.JsonArray,
      total: invoice.total,
      userId: user.id,
    },
  });

  revalidatePath("/");
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({
    where: {
      id: String(id),
    },
  });

  revalidatePath(`/`);
}

export async function updateInvoice(invoice: Invoice) {
  const user = await getCurrentUser();

  const data = await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      clientAddress: invoice.clientAddress as Prisma.JsonObject,
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      senderAddress: invoice.senderAddress as Prisma.JsonObject,
      status: invoice.status,
      createdAt: new Date(invoice.createdAt),
      paymentTerms: invoice.paymentTerms,
      description: invoice.description,
      paymentDue: new Date(invoice.paymentDue),
      items: invoice.items as Prisma.JsonArray,
      total: invoice.total,
      userId: user.id,
    },
  });

  revalidatePath(`/invoice/${data.id}`);
}
