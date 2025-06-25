import mongoose, { Document, Schema } from "mongoose";
import InvoiceHistory from "./invoiceHistory";

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
  clientId: mongoose.Schema.Types.ObjectId;
  businessId:mongoose.Schema.Types.ObjectId;
  invoiceDate: Date;
  balance: number;
  paid: number;
  items: Item[];
  extra: Extra[];
  notes: string;
  CommFare: number;
  total: number;
  cloudinaryUrl: string,


}
interface Extra {
  description: string;
  amount: number;
}

// Create a Mongoose Document type that extends the Invoice interface
export interface InvoiceDocument extends Document, Invoice {}

// Define the Mongoose schema for the Invoice model
const InvoiceSchema = new Schema<InvoiceDocument>(
  {
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
    extra: [{
      description: {type: String},
      amount: {type: Number}
    }],
    notes: { type: String, default: "" },
    CommFare: { type: Number, default: 0 },
    total: { type: Number, required: true },
    cloudinaryUrl: { type: String, default: "" },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to save invoice history before updating the invoice
InvoiceSchema.pre("save", async function (next) {
  // Check if the document is being updated
  if (!this.isNew && this.isModified()) {
    try {
      // Save the current state of the invoice to the history collection
      const history = new InvoiceHistory({
        originalInvoiceId: this._id,
        billNo: this.billNo,
        clientName: this.clientName,
        clientId: this.clientId,
        businessId: this.businessId,
        invoiceDate: this.invoiceDate,
        balance: this.balance,
        paid: this.paid,
        items: this.items,
        extra : this.extra,
        notes: this.notes,
        CommFare: this.CommFare,
        total: this.total,
        cloudinaryUrl: this.cloudinaryUrl,
        updatedAt: new Date(),
      });

      await history.save();
    } catch (error) {
      console.error("Error saving invoice history:", error);
    }
  }

  next();
});

// Create the Mongoose model based on the schema
const Invoice = mongoose.models.Invoice || mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);

export default Invoice;
