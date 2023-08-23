
import { CustomEmail } from './custom-email';
import { Questionnaire } from './questionnaire';
import { Reminder } from './reminder';
import { OpenQuestion } from './open-question';

import { AnswersReference } from './answers-reference';
import { QuestionsIndex } from './question-index';

export interface Evaluation {
  _id?: string;
  name: string;
  displayName?: string;
  slug: string;
  status: string;
  enterpriseId: number;
  enterprise: any;
  operations: Array<number>;
  questionnaire: Questionnaire;
  additionalQuestions: any,
  openQuestions: Array<OpenQuestion>,
  answersReference: AnswersReference;
  questionsIndex: QuestionsIndex;
  deliveredAt: Date;
  validUntil: Date;
  timeZone: string;
  reminders: Array<Reminder>;
  customEmailRelease: CustomEmail;
  customEmailReminder: CustomEmail;
  populationSelectionType: string,
  populationSelectionDetails: any,
  populationCount: number,
  populationCompletedCount: number,
  additionalSegmentation: any,
  createdAt?: Date;
  updatedAt?: Date;
}
