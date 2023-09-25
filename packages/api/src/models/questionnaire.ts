
import { Evaluations } from './evaluations';

export interface Questionnaire {
  name: string;
  slug: string;
  active: boolean;
  isBase: boolean;
  baseQuestionnaire?: string;
  evaluations: Evaluations;
  assignationType?: string;
  assignationFor?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
