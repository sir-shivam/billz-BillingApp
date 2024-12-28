import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  quantity: { type: Number },
  price: { type: Number, required: true },
  byBusiness: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },

});

const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);;
export default Stock;
