import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, {
  ProductDocument,
  ProductInput,
} from "../models/product.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createProduct(input: Omit<ProductInput, "productId">) {
  const metricsLabels = {
    openation: "createProduct",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const product = await ProductModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return product;
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });

    throw new Error(error);
  }
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    openation: "findProduct",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = ProductModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });

    throw new Error(error);
  }
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
