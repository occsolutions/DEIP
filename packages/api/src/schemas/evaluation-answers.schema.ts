
import * as mongoose from 'mongoose';
import { EvaluationAnswers } from '../models/evaluation-answers';

export type EvaluationAnswersType = EvaluationAnswers & mongoose.Document;

const EvaluationAnswersSchema = new mongoose.Schema({
  evaluationRef: { type: Object, index: true },
  _populationId: { type: Object, index: true },
  demographicItems: {
    countryId: Number,
    headquarterId: Number,
    departmentId: Number,
    enterpriseId: Number,
    genderId: Number,
    jobTypeId: Number,
    academicDegreeId: Number,
    chargeId: Number,
    identifyTypeId: Number,
    additionalDemographic1Id: Number,
    additionalDemographic2Id: Number,
    birthdate: Date,
    admission: Date
  },
  segmentation: [{
    segmentationId: Number,
    detailId: Number
  }],
  evaluations: [{
    name: String,
    score: Number,
    variables: [{
      name: String,
      score: Number,
      questions: [{
        name: String,
        score: Number
      }]
    }]
  }],
  indices: [{
    name: String,
    score: Number,
    answers: [{
      idx: Number,
      score: Number
    }]
  }],
  additionalQuestions: [{
    question: { type: String, index: true },
    answer: []
  }],
  openQuestions: [{
    question: {
      name: String,
      translation: {}
    },
    answer: []
  }]
}, {timestamps: true});

const EvaluationAnswersRepository = mongoose.model<EvaluationAnswersType>('EvaluationAnswers', EvaluationAnswersSchema);
export default EvaluationAnswersRepository;
