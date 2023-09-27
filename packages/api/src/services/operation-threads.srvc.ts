
import { ObjectID } from 'mongodb';
import { OperationThreads } from '../models/operation-threads';
import OperationThreadsRepository, { OperationThreadsType } from '../schemas/operation-threads.schema';

/**
 * @class OperationThreadsService
 */
class OperationThreadsService {

  /**
   * @description Fetches single operations thread by operation Id
   * @param id
   * @returns {Promise<OperationThreads>}
   */
  async findOneById(id: string, select?: undefined|any): Promise<OperationThreads|null> {
    return OperationThreadsRepository.findOne({
      '_id': new ObjectID(id)
    }, select || undefined);
  }

  /**
   * @description Fetches operations thread by operation type DownloadReportsCurrentCulture And Current Id
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findDownloadReportsByPollId(id: string, select?: undefined|any): Promise<OperationThreads[]> {
    return OperationThreadsRepository.find({
      operation: 'DownloadReport',
      'data._evaluation': new ObjectID(id)
    }, select || undefined).sort({'createdAt': -1});
  }

  /**
   * @description Fetches single operations thread by operation type DownloadReportsCurrentCulture And Id
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findOneDownloadReportById(id: string, select?: undefined|any): Promise<OperationThreads|null> {
    return OperationThreadsRepository.findOne({
      operation: 'DownloadReport',
      '_id': new ObjectID(id)
    }, select || undefined);
  }

  /**
   * @description Fetches single operation thread by operation type and status
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findByOperationAndStatus(operation: string, status: string): Promise<OperationThreads|OperationThreadsType|null> {
    return OperationThreadsRepository.findOne({ operation, status });
  }

  /**
   * @description Fetches single operation thread by operation type, status & data type
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findByOperationStatusAndDataType(operation: string, status: string, type: string): Promise<OperationThreads|OperationThreadsType|null> {
    return OperationThreadsRepository.findOne({ operation, status, 'data.type': type });
  }

  /**
   * @description Fetches multiple operation threads by operation type and status
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findBatchByOperationAndStatus(operation: string, status: string, limit?: number): Promise<OperationThreads[]|OperationThreadsType[]> {
    return OperationThreadsRepository.find({ operation, status }).limit(limit || 20);
  }

  /**
   * @description Saves the question service in the storage
   * @param {OperationThreads} OperationThreads
   * @returns {Promise<OperationThreads>}
   */
  async save(OperationThreads: OperationThreads): Promise<OperationThreads|OperationThreadsType|null> {
    return (await new OperationThreadsRepository(OperationThreads).save());
  }

  /**
   * @description Fetches single question service by name and sets active flag
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findOneAndUpdateStatus(id: string, status: string): Promise<any> {
    return await OperationThreadsRepository.updateOne(
      {_id: new ObjectID(id)},
      { status }
      // { new: true}
    );
  }

  /**
   * @description Fetches single question service by name and sets active flag
   * @param name
   * @returns {Promise<OperationThreads>}
   */
  async findOneAndUpdateData(id: string, data: {[key: string]: any}): Promise<any> {
    return await OperationThreadsRepository.updateOne(
      {_id: new ObjectID(id)},
      { data }
      // { new: true}
    );
  }

  /**
   * @description Fetches single thread & updates status + data
   * @param id
   * @param data
   * @returns {Promise<OperationThreads>}
   */
  async findOneAndUpdateStatusData(id: string, status: string, data: {[key: string]: any}): Promise<any> {
    return await OperationThreadsRepository.updateOne(
      {_id: new ObjectID(id)},
      { status, data }
    );
  }

  /**
   * @description Fetches single thread by ID & updates status to failed with error data
   * @param id
   * @param data
   * @returns {Promise<OperationThreads>}
   */
  async findOneAndSaveFail(id: string, data: {[key: string]: any}): Promise<any> {
    return await OperationThreadsRepository.updateOne(
      {_id: new ObjectID(id)},
      { status: 'failed', dataFail: data }
    );
  }
}

export default new OperationThreadsService();
