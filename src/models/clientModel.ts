import mongoose, { Document, Schema } from "mongoose";

// Define the structure of a payment history entry
interface PaymentHistory {
  amount: number;
  date: Date;
}

// Define the structure of the Client model
export interface Client {
  clientName: string;
  contact: string; // WhatsApp number or any other contact informatio
  prevBalance: number; // Previous balance before any new transactions
  lastPaidAmount: number; // Last paid amount
  amountPaidHistory: PaymentHistory[]; // Array to store history of payments with dates
  invoices: mongoose.Schema.Types.ObjectId[]; // Array of references to Invoice IDs
  byBusiness: mongoose.Schema.Types.ObjectId; // Array of references to Invoice IDs
}

// Create the Mongoose Document type that extends the Client interface
export interface ClientDocument extends Document, Client {}

// Define the Mongoose schema for the Client model
const ClientSchema = new Schema<ClientDocument>({
  clientName: { type: String, required: true },
  contact: { type: String, required: true }, // WhatsApp contact number or other
  prevBalance: { type: Number, default: 0 },
  lastPaidAmount: { type: Number, default: 0 },
  amountPaidHistory: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }], // References to invoices
  byBusiness: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
}, { timestamps: true });

// Create the Mongoose model for the Client
const Client = mongoose.models.Client || mongoose.model<ClientDocument>("Client", ClientSchema);

export default Client;
