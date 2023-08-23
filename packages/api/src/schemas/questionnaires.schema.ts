
import * as mongoose from 'mongoose';

import { Questionnaire } from '../models/questionnaire';

export type QuestionnairesType = Questionnaire & mongoose.Document;

const QuestionnairesSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: { index: true, type: String, unique: true },
  baseQuestionnaire: String,
  active: { index: true, type: Boolean },
  isBase: Boolean,
  deletedAt: Date,
  assignationType: { index: true, type: String },
  assignationFor: { index: true, type: Number },
  evaluations: Object
}, { timestamps: true });

const QuestionnaireRepository = mongoose.model<QuestionnairesType>('Questionnaire', QuestionnairesSchema);
export default QuestionnaireRepository;
