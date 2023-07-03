import prisma from "@/lib/prisma";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ActionButton";
import { deleteInvoice, markInvoiceAsPaid } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import InvoiceForm from "@/components/InvoiceForm";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { ChevronLeft } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default async function InvoicePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: id,
    },
    include: {
      User: true,
    },
  });

  return (
    <div className="w-3/4 mx-auto">
      <Link href={"/"}>
        <Button variant="ghost" type="button">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <Card className="mt-2">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <span className="">Status</span>
              <span>
                {invoice?.status === "paid" && (
                  <Badge variant="paid">Paid</Badge>
                )}
                {invoice?.status === "pending" && (
                  <Badge variant="pending">Pending</Badge>
                )}
                {invoice?.status === "draft" && (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" type="button">
                    Edit
                  </Button>
                </SheetTrigger>
                <SheetContent side={"left"} className=" overflow-scroll">
                  <SheetHeader>
                    <SheetTitle>Edit # {id}</SheetTitle>
                    <Separator className="my-4" />
                  </SheetHeader>
                  <InvoiceForm initialValues={invoice} />
                </SheetContent>
              </Sheet>

              <form
                action={markInvoiceAsPaid}
                className="flex flex-row items-center space-x-2"
              >
                <input type="hidden" name="id" value={id} />
                <Link href={"/"}>
                  <ActionButton
                    variant="destructive"
                    type="button"
                    formAction={deleteInvoice}
                    data={id}
                  >
                    Delete
                  </ActionButton>
                </Link>
                <SubmitButton variant="secondary" type="submit">
                  Mark as Paid
                </SubmitButton>
              </form>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="mt-5 space-y-5">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-2 ">
                <span>#{id}</span>
                <span className=" text-muted-foreground text-sm font-medium leading-none ">
                  {invoice?.description}
                </span>
              </div>
              <div className="flex flex-col items-end space-y-1 ">
                <p className="text-left text-muted-foreground text-sm font-medium leading-none">
                  {invoice?.senderAddress?.street}
                </p>
                <p className="text-left text-muted-foreground text-sm font-medium leading-none">
                  {invoice?.senderAddress?.city}
                </p>
                <p className="text-left text-muted-foreground text-sm font-medium leading-none">
                  {invoice?.senderAddress?.postCode}
                </p>
                <p className="text-left text-muted-foreground text-sm font-medium leading-none">
                  {invoice?.senderAddress?.country}
                </p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between items-start">
            <div className=" flex flex-col space-y-5">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium leading-none">
                  Invoice Date
                </p>
                <p>
                  {invoice?.createdAt.toLocaleDateString("en-UK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium leading-none">
                  Payment Due
                </p>
                <p>
                  {invoice?.paymentDue.toLocaleDateString("en-UK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div>
              <div className=" flex flex-col space-y-5">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium leading-none">
                    Bill To
                  </p>
                  <p className="text-md font-medium leading-none">
                    {invoice?.clientName}
                  </p>

                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    {invoice?.clientAddress?.street}
                  </p>
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    {invoice?.clientAddress?.city}
                  </p>
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    {invoice?.clientAddress?.postCode}
                  </p>
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    {invoice?.clientAddress?.country}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className=" flex flex-col space-y-5">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium leading-none">
                    Sent To
                  </p>
                  <p className="text-md font-medium leading-none">
                    {invoice?.clientEmail}
                  </p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <Separator className="my-5" />
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Item Name</TableHead>
                <TableHead className="w-1/6">QTY.</TableHead>
                <TableHead className="w-1/6">Price</TableHead>
                <TableHead className="text-right w-1/6">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice?.items.map((item) => (
                <TableRow key={item?.name}>
                  <TableCell className="font-medium">{item?.name}</TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell>{item?.price}</TableCell>
                  <TableCell className="text-right">{item?.total}</TableCell>
                </TableRow>
              ))}
              <TableRow className="">
                <TableCell colSpan={3} className="text-right">
                  <span className="text-muted-foreground text-sm font-medium leading-none">
                    Amount Due
                  </span>
                </TableCell>
                <TableCell className="text-right">{invoice?.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
