
import * as mongoose from 'mongoose';

import { ProductService } from '../models/product-service';

export type ProductServiceType = ProductService & mongoose.Document;

const ProductServiceSchema = new mongoose.Schema({
  name: { type: String },
  productId: { type: Number },
  productServiceId: { type: Number, unique: true },
  code: { type: String, unique: true }
});

const ProductServiceRepository = mongoose.model<ProductServiceType>('ProductService', ProductServiceSchema);
export default ProductServiceRepository;
