
import * as mongoose from 'mongoose';

import { Evaluation } from '../models/evaluation';

export type EvaluationsType = Evaluation & mongoose.Document;

const EvaluationsSchema = new mongoose.Schema({
  name: String,
  displayName: String,
  slug: { index: true, type: String, unique: true },
  status: { index: true, type: String },
  enterpriseId: { index: true, type: Number },
  enterprise: Object,
  operations: Array,
  questionnaire: Object,
  additionalQuestions: [],
  openQuestions: [{
    name: String,
    question: Object
  }],
  answersReference: Object,
  questionsIndex: Object,
  deliveredAt: { index: true, type: Date },
  validUntil: { index: true, type: Date },
  timeZone: String,
  reminders: [{
    dateTime: Date,
    status: String,
    customEmail: {
      subject: String,
      body: String,
      attachment: String
    }
  }],
  customEmailRelease: {
    subject: String,
    body: String,
    attachment: String
  },
  customEmailReminder: {
    subject: String,
    body: String,
    attachment: String
  },
  populationSelectionType: String,
  populationSelectionDetails: Object,
  populationCount: Number,
  populationCompletedCount: Number,
  additionalSegmentation: Object,
  createdAt: { index: true, type: Date }
}, { timestamps: true });

const EvaluationRepository = mongoose.model<EvaluationsType>('Evaluation', EvaluationsSchema);
export default EvaluationRepository;
