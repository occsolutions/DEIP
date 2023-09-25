
import { Question } from './question';
import { Translations } from './translations';

export interface QuestionsType extends Question {
  title: Translations,
  description: Translations,
  editable: Array<String>,
}