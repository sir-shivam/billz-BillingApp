import mongoose, { Document, Schema } from "mongoose";

// Define the Item interface for each item in the invoice
interface Item {
  description: string;
  comm: number;
  fare: number;
  quantity: number;
  price: number;
  carat: number;
  perCarat: number;
  eachItemTotal: number;
}

// Define the Invoice interface, which includes all fields in the invoice schema
export interface Invoice {
  billNo: number;
  clientName: string;
  invoiceDate: Date;
  balance: number;
  paid: number;
  items: Item[];
  notes: string;
  CommFare: number;
  total: number;
}

// Create a Mongoose Document type that extends the Invoice interface
export interface InvoiceDocument extends Document, Invoice {}

// Define the Mongoose schema for the Invoice model
const InvoiceSchema = new Schema<InvoiceDocument>({
  billNo: { type: Number, required: true,},
  clientName: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  balance: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  items: [
    {
      description: { type: String, required: true },
      comm: { type: Number, default: 0 },
      fare: { type: Number, default: 0 },
      quantity: { type: Number, default: 1, required: true },
      price: { type: Number, required: true },
      carat: { type: Number, default: 0 },
      perCarat: { type: Number, default: 0 },
      eachItemTotal: { type: Number, required: true },
    },
  ],
  notes: { type: String, default: "" },
  CommFare: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

// Create the Mongoose model based on the schema
const Invoice = mongoose.models.Invoice || mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);

export default Invoice;
