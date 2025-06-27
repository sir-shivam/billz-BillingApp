import mongoose from "mongoose";

const processedMessageSchema = new mongoose.Schema({
  messageId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 864000 }, // Auto-delete after 24*10 hrs
});

const ProcessedMessage = mongoose.models.ProcessedMessage || mongoose.model("ProcessedMessage", processedMessageSchema);

export default ProcessedMessage;
