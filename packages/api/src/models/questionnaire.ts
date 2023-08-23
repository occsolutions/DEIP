
import { Dimention } from './dimention';
import { Question } from './question';

export interface Questionnaire {
  name: string;
  slug: string;
  active: boolean;
  isBase: boolean;
  baseQuestionnaire?: string;
  evaluations: Dimention<Question>;
  assignationType?: string;
  assignationFor?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
