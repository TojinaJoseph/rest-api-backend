import mongoose from "mongoose";
// import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";
import { v4 as uuidv4 } from "uuid";

// const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890");
export interface ProductInput {
  user: UserDocument["_id"];
  productId: string;
  title: string;
  description: string;
  price: number;
  image: string;
}
export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
      // default: () => `product_${nanoid}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, requird: true },
    price: { type: Number, requird: true },
    image: { type: String, requird: true },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>("product", productSchema);
export default ProductModel;
