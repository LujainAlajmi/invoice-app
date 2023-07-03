"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { createInvoice, updateInvoice } from "@/lib/actions";

import { Label } from "./ui/label";
import { SheetClose } from "./ui/sheet";
import SubmitButton from "./SubmitButton";
import { useToast } from "@/components/ui/use-toast";
import ActionButton from "./ActionButton";

const formSchema = z.object({
  senderAddress: z.object({
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    postCode: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
  }),
  status: z.enum(["draft", "pending", "paid"]).default("pending"),
  clientName: z.string().min(1).max(255),
  clientEmail: z.string().email().min(1).max(255),
  clientAddress: z.object({
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    postCode: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
  }),
  createdAt: z.date(),

  paymentTerms: z.enum([
    "Net 1 Day",
    "Net 7 Days",
    "Net 14 Days",
    "Net 30 Days",
  ]),
  description: z.string().min(1).max(255),
  items: z.array(
    z.object({
      name: z.string().min(1).max(255),
      quantity: z.number().min(1),
      price: z.number().min(1),
      total: z.number().min(1),
    })
  ),
  total: z.number().min(1),
});
type Item = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export default function InvoiceForm({
  initialValues,
}: {
  initialValues?: any;
}) {
  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: 0, price: 0, total: 0 },
  ]);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      items: initialValues?.items || [],
      paymentTerms:
        initialValues?.paymentTerms === 1
          ? "Net 1 Day"
          : initialValues?.paymentTerms === 7
          ? "Net 7 Days"
          : initialValues?.paymentTerms === 14
          ? "Net 14 Days"
          : initialValues?.paymentTerms === 30
          ? "Net 30 Days"
          : "Net 1 Day",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const paymentTerms: number = Number(values.paymentTerms.split(" ")[1]);

    const createdAt: Date = new Date(values.createdAt);
    const paymentDue: Date = new Date(
      createdAt.getTime() + paymentTerms * 24 * 60 * 60 * 1000
    );

    const newValues = {
      ...values,
      paymentTerms: paymentTerms,
      createdAt: createdAt.toISOString().split("T")[0],
      paymentDue: paymentDue.toISOString().split("T")[0],
      status: "pending",
    };

    createInvoice(newValues as any);
    setIsSubmitting(false);
    toast({
      title: "Invoice Created",
      description: "Invoice has been created successfully",
    });
  }

  function saveAsDraft(values: z.infer<typeof formSchema>) {
    const paymentTerms: number = Number(values.paymentTerms.split(" ")[1]);

    const createdAt: Date = new Date(values.createdAt);
    const paymentDue: Date = new Date(
      createdAt.getTime() + paymentTerms * 24 * 60 * 60 * 1000
    );

    const newValues = {
      ...values,
      paymentTerms: paymentTerms,
      createdAt: createdAt.toISOString().split("T")[0],
      paymentDue: paymentDue.toISOString().split("T")[0],
      status: "draft",
    };

    createInvoice(newValues as any);
    toast({
      title: "Invoice Saved",
      description: "Invoice has been saved successfully",
    });
  }

  function updateAsDraft(values: z.infer<typeof formSchema>) {
    const paymentTerms: number = Number(values.paymentTerms.split(" ")[1]);

    const createdAt: Date = new Date(values.createdAt);
    const paymentDue: Date = new Date(
      createdAt.getTime() + paymentTerms * 24 * 60 * 60 * 1000
    );

    const newValues = {
      ...values,
      paymentTerms: paymentTerms,
      createdAt: createdAt.toISOString().split("T")[0],
      paymentDue: paymentDue.toISOString().split("T")[0],
      status: "pending",
    };

    updateInvoice(newValues as any);
    toast({
      title: "Invoice Updated",
      description: "Invoice has been updated successfully",
    });
  }
  const [total, setTotal] = useState(0);

  React.useEffect(() => {
    const newItems = form.watch("items");

    const newTotal = newItems.reduce((acc, item) => acc + item.total, 0);

    form.setValue("total", newTotal);

    setTotal(newTotal);
  }, [items, form.watch("items")]);

  let [isDraftPending, startDraftTransition] = useTransition();
  let [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <div>
      <Form {...form}>
        <form
          // action={() => form.handleSubmit(onSubmit)}
          onSubmit={form.handleSubmit(() =>
            startTransition(() => onSubmit(form.getValues()))
          )}
        >
          <div className="">
            <h1 className=" text-muted-foreground py-5">Bill From</h1>
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="senderAddress.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-4">
                <FormField
                  control={form.control}
                  name="senderAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderAddress.postCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Code</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <h1 className=" text-muted-foreground py-5">Bill To</h1>
            <div className="flex flex-col space-y-5">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client’s Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client’s Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientAddress.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-4">
                <FormField
                  control={form.control}
                  name="clientAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientAddress.postCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Code</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-4   pt-5">
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Issue Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        //   onSelect={field.onChange}
                        onSelect={(date) => {
                          const selectedDate = date as Date;
                          field.onChange(selectedDate);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Payment Terms</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value as any);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Net 1 Day">Net 1 Day</SelectItem>
                      <SelectItem value="Net 7 Days">Net 7 Days</SelectItem>
                      <SelectItem value="Net 14 Days">Net 14 Days</SelectItem>
                      <SelectItem value="Net 30 Days">Net 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="pt-5">
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="py-5">
            <h1 className=" text-muted-foreground py-5">Item List</h1>
            <div className="flex flex-row">
              <Label className="w-1/4">Item Name</Label>
              <Label className="w-1/4">Qty.</Label>
              <Label className="w-1/4">Price</Label>
              <Label className="w-1/4">Total</Label>
              <Label className="w-1/6"></Label>
            </div>

            {items.map((item, index) => (
              <div key={index} className=" flex flex-row space-x-3 pt-2 ">
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormControl>
                        <Input
                          placeholder=""
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            form.setValue(
                              `items.${index}.total`,
                              form.watch(`items.${index}.price`) *
                                Number(e.target.value)
                            );
                            form.setValue("items", [...form.watch("items")]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormControl>
                        <Input
                          placeholder=""
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            form.setValue(
                              `items.${index}.total`,
                              form.watch(`items.${index}.quantity`) *
                                Number(e.target.value)
                            );
                            form.setValue("items", [...form.watch("items")]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.total`}
                  render={({ field }) => (
                    <FormItem className="w-1/4">
                      <FormControl>
                        <Input
                          disabled
                          placeholder=""
                          type="number"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-1/6"
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const newItems = form.watch("items");
                    newItems.splice(index, 1);
                    setItems(newItems);
                    form.setValue("items", newItems);
                  }}
                >
                  <TrashIcon className="h-5 w-5 " />
                </Button>
              </div>
            ))}
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem hidden>
                  <FormLabel>total</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="total"
                      type="number"
                      value={Number(total)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-5"
              variant={"secondary"}
              type="button"
              onClick={() => {
                setItems([
                  ...items,
                  {
                    name: "",
                    quantity: 0,
                    price: 0,
                    total: 0,
                  },
                ]);
                form.setValue("items", [
                  ...form.watch("items"),
                  {
                    name: "",
                    quantity: 0,
                    price: 0,
                    total: 0,
                  },
                ]);
              }}
            >
              Add item
            </Button>
          </div>
          {initialValues !== undefined ? (
            <div className="flex justify-end space-x-2 py-5">
              <SheetClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                disabled={isUpdatePending}
                type="button"
                onClick={() =>
                  startUpdateTransition(() => updateAsDraft(form.getValues()))
                }
              >
                {isUpdatePending ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex justify-between py-5">
              <SheetClose asChild>
                <Button type="button" variant="destructive">
                  Discard
                </Button>
              </SheetClose>

              <div className=" space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDraftPending}
                  onClick={() =>
                    startDraftTransition(() => saveAsDraft(form.getValues()))
                  }
                >
                  {isDraftPending ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save as Draft
                </Button>

                <Button type="submit">
                  {isPending ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save & Send
                </Button>
                {/* <SubmitButton type="submit">Save & Send</SubmitButton> */}
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
