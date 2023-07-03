import { User, Invoice } from "@prisma/client";

export type invoices = invoice[];

export interface ExtendedInvoice extends Invoice {
  User: User;
  senderAddress: Address;
  clientAddress: Address;
  items: Item[];
}

export interface invoice {
  id: string;
  createdAt: Date;
  paymentDue: string;
  description: string;
  paymentTerms: paymentTerms;
  clientName: string;
  clientEmail: string;
  status: Status;
  senderAddress: Address;
  clientAddress: Address;
  items: Item[];
  total: number;
  User: User;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export enum Status {
  PAID = "paid",
  PENDING = "pending",
  DRAFT = "draft",
}

export enum paymentTerms {
  NET_1_DAY = "Net 1 Day",
  NET_7_DAYS = "Net 7 Days",
  NET_14_DAYS = "Net 14 Days",
  NET_30_DAYS = "Net 30 Days",
}
