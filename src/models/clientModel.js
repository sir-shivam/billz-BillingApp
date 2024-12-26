import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: {type:Number },
  balance: { type: Number, default: 0 },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
});


const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export default Client;
