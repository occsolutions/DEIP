
import { Dimention } from './dimention';
import { AnswerOpenQuestion } from './answer-open-question';

export type EvaluatedAnswers = {
  segmentation: Array<{ segmentationId: Number, detailId: Number }>;
  evaluations: Dimention<Number>;
  indices: Array<{ idx: Number, answer: Number }>;
  additional: Array<AnswerOpenQuestion>;
  open: Array<AnswerOpenQuestion>;
};
