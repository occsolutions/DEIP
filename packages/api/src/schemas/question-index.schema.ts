
import * as mongoose from 'mongoose';

import { QuestionsIndex } from '../models/question-index';

export type QuestionsIndexType = QuestionsIndex & mongoose.Document;

const QuestionsIndexSchema = new mongoose.Schema({
  idx: { index: true, type: Number, unique: true },
  index: [String],
  answers: Number,
  reference: Object,
  question: Object
});

const QuestionsIndexRepository = mongoose.model<QuestionsIndexType>('QuestionsIndex', QuestionsIndexSchema);
export default QuestionsIndexRepository;
