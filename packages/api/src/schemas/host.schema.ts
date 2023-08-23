
import * as mongoose from 'mongoose';

import { Host } from '../models/host';

export type HostType = Host & mongoose.Document;

const HostSchema = new mongoose.Schema({
  productName: {type: String, unique: true},
  clientUrl: {type: String},
  clientPort: {type: Number},
  serverUrl: {type: String},
  serverPort: {type: Number},
  token: {type: String}
});

const HostRepository = mongoose.model<HostType>('Host', HostSchema);
export default HostRepository;
