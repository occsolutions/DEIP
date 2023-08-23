
import { Translations } from './translations';

export interface Question {
  index: String[];
  answers: Number;
  reference: Translations;
  question: Translations;
}
