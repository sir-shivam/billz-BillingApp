import { Document, model, models, Schema } from "mongoose";

export interface IBusiness extends Document {
    name: string;
    address: string;
    ownerId: Schema.Types.ObjectId;
    accountantIds: Schema.Types.ObjectId[];
    stocks: Schema.Types.ObjectId[];
    clients:  Schema.Types.ObjectId[];
    invoices: Schema.Types.ObjectId[];
  }
  
  const businessSchema = new Schema<IBusiness>(
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      accountantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      stocks:[{ type: Schema.Types.ObjectId, ref: 'Stock' }],
      clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
      invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
    },
    { timestamps: true }
  );
  
  const Business = models.Business || model<IBusiness>('Business', businessSchema);
  export default Business;
  