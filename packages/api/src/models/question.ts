
import { Translations } from './translations';

export interface Question {
  label: Translations,
  type: 'options' | 'closed' | 'likert', 'open',
  limit?: null | number,
  min?: number,
  options?: Array<{
    label: Translations,
    value: string
  }>
}