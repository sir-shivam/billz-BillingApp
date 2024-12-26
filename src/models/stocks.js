import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number },
  price: { type: Number, required: true },
});

const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);;
export default Stock;
