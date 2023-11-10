
import { AnswerAdditionalQuestion } from './answer-additional-question';

export type EvaluatedAnswers = {
  segmentation: Array<{ segmentationId: Number, detailId: Number }>;
  evaluations: Array<{ attribute: Array<{ key: String, qType: String, score: Array<Number> }> }>;
  additional: Array<AnswerAdditionalQuestion>;
};
