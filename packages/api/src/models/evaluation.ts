
import { CustomEmail } from './custom-email';
import { Questionnaire } from './questionnaire';
import { Reminder } from './reminder';


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
  deliveredAt: Date;
  validUntil: Date;
  timeZone: string;
  reminders: Array<Reminder>;
  customEmailRelease: CustomEmail;
  customEmailReminder: CustomEmail;
  populationSelectionType: string,
  populationSelectionDetails: any,
  populationLeaders: Array<number>;
  populationCount: number,
  populationCompletedCount: number,
  additionalSegmentation: any,
  createdAt?: Date;
  updatedAt?: Date;
}
