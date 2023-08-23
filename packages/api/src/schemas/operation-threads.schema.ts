
import * as mongoose from 'mongoose';
import { OperationThreads } from '../models/operation-threads';

export type OperationThreadsType = OperationThreads & mongoose.Document;

const OperationThreadsSchema = new mongoose.Schema({
  operation: {index: true, type: String},
  status: {index: true, type: String},
  data: {},
  dataFail: {},
  createdAt: { index: true, type: Date }
});

const OperationThreadsRepository = mongoose.model<OperationThreadsType>('OperationThreads', OperationThreadsSchema);
export default OperationThreadsRepository;
