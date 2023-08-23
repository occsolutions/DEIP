import { Host } from '../models/host';
import HostRepository from '../schemas/host.schema';

/**
 * @class HostService
 */
class HostService {

  /**
   * @description Fetches single host from the storage by product name
   * @returns {Promise<Host>}
   * @param productName
   */
  async findByProductName(productName: string): Promise<Host> {
    return HostRepository.findOne({productName: new RegExp('^' + productName + '$', 'i')});
  }

  /**
   * @description Saves the host in the storage
   * @param {Host} host
   * @returns {Promise<Host>}
   */
  async save(host: Host): Promise<Host> {
    return (await new HostRepository(host).save());
  }

  /**
   * @description Fetches single host by id and sets active flag
   * @param id
   * @returns {Promise<Host>}
   */
  async findOneAndUpdate(id: number): Promise<Host> {
    const host = HostRepository.findOneAndUpdate({_id: id}, {active: true}, {new: true});
    return host;
  }

  /**
   * @description Fetches all hosts from the storage
   * @returns {Promise<Host[]>}
   */
  async findAll(): Promise<Host[]> {
    return HostRepository.find();
  }

  /**
   * @description Deletes a single host from storage
   * @returns {Promise<void>}
   */
  async deleteOne(productName: string): Promise<void> {
    return HostRepository.deleteOne({productName: productName});
  }
}

export default new HostService();