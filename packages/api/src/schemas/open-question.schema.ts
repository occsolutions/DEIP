
import * as mongoose from 'mongoose';
import { OpenQuestion } from '../models/open-question';

export type OpenQuestionType = OpenQuestion & mongoose.Document;

const OpenQuestionSchema = new mongoose.Schema({
  name: { index: true, type: String, unique: true },
  question: Object
});

const OpenQuestionRepository = mongoose.model<OpenQuestionType>('OpenQuestion', OpenQuestionSchema);
export default OpenQuestionRepository;
