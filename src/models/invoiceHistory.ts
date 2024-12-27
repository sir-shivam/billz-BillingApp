import mongoose, { Schema, Document } from "mongoose";
import { Invoice } from "./invoices";

// Define the InvoiceHistory interface
export interface InvoiceHistory extends Omit<Invoice, "_id"> {
  originalInvoiceId: mongoose.Types.ObjectId; // Reference to the original invoice
  updatedAt: Date; // Timestamp for when this history record was created
}

// Create a Mongoose Document type that extends InvoiceHistory
export interface InvoiceHistoryDocument extends Document, InvoiceHistory {}

// Define the Mongoose schema for Invoice History
const InvoiceHistorySchema = new Schema<InvoiceHistoryDocument>(
  {
    originalInvoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    billNo: { type: Number, required: true },
    clientName: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
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
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Create the Mongoose model for Invoice History
const InvoiceHistory = mongoose.models.InvoiceHistory || mongoose.model<InvoiceHistoryDocument>("InvoiceHistory", InvoiceHistorySchema);

export default InvoiceHistory;
