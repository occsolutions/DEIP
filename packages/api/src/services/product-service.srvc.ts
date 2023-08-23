
import { ProductService } from '../models/product-service';
import ProductServiceRepository, { ProductServiceType } from '../schemas/product-service.schema';

/**
 * @class ProductServiceService
 */
class ProductServiceService {

  /**
   * @description Fetches single product service from the storage by name
   * @param name
   * @returns {Promise<ProductService>}
   */
  async findByName(name): Promise<ProductService | ProductServiceType> {
    return ProductServiceRepository.findOne({ 'name': { $regex: '.*' + name + '.*' } });
  }

  /**
   * @description Saves the product service in the storage
   * @param {ProductService} productService
   * @returns {Promise<ProductService>}
   */
  async save(productService: ProductService): Promise<ProductService | ProductServiceType> {
    return (await new ProductServiceRepository(productService).save());
  }

  /**
   * @description Fetches single product service by id and sets active flag
   * @returns {Promise<ProductService>}
   * @param id
   */
  async findOneAndUpdate(id: string): Promise<ProductService | ProductServiceType> {
    const productService = ProductServiceRepository.findOneAndUpdate({ _id: id }, { active: true }, { new: true });
    return productService;
  }

  /**
   * @description Fetches all product services from the storage
   * @returns {Promise<ProductService[]>}
   */
  async findAll(): Promise<ProductService[] | ProductServiceType[]> {
    return ProductServiceRepository.find();
  }

  /**
   * @description Deletes a single product service from storage
   * @returns {Promise<void>}
   */
  async deleteOne(id: string): Promise<void> {
    return ProductServiceRepository.deleteOne({ _id: id });
  }
}

export default new ProductServiceService();