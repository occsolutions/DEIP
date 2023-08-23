
import * as mongoose from 'mongoose';

import { AnswersReference } from '../models/answers-reference';

export type AnswersReferenceType = AnswersReference & mongoose.Document;

const AnswersReferenceSchema = new mongoose.Schema({
  idx: { index: true, type: Number, unique: true },
  5: { es: String, en: String },
  4: { es: String, en: String },
  3: { es: String, en: String },
  2: { es: String, en: String },
  1: { es: String, en: String }
}, { timestamps: true });


const AnswersReferenceRepository = mongoose.model<AnswersReferenceType>('AnswersReference', AnswersReferenceSchema);
export default AnswersReferenceRepository;
