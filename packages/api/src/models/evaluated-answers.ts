
import { Dimention } from './dimention';
import { AnswerAdditionalQuestion } from './answer-additional-question';

export type EvaluatedAnswers = {
  segmentation: Array<{ segmentationId: Number, detailId: Number }>;
  evaluations: Dimention<Number>;
  additional: Array<AnswerAdditionalQuestion>;
};
