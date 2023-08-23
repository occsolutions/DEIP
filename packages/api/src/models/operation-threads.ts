
export interface OperationThreads {
  _id?: string,
  operation: string;
  status: string;
  data: {[key: string]: any};
  dataFail?: {[key: string]: any};
  createdAt: Date;
}
