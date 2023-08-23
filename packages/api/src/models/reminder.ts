
import { CustomEmail } from './custom-email';

export interface Reminder {
  dateTime: Date,
  status: string,
  customEmail: CustomEmail
}
