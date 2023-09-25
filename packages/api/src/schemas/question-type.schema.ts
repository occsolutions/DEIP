
import * as mongoose from 'mongoose';

import { QuestionsType } from '../models/question-type';

export type QuestionsTypeType = QuestionsType & mongoose.Document;

const QuestionsTypeSchema = new mongoose.Schema({
  title: Object,
  description: Object,
  editable: Array<String>,
  label: Object,
  type: { index: true, type: String, unique: true },
  limit: Number,
  min: Number,
  options: Array<{
    label: Object,
    value: string
  }>
});

const QuestionsTypeRepository = mongoose.model<QuestionsTypeType>('QuestionsType', QuestionsTypeSchema);
export default QuestionsTypeRepository;
