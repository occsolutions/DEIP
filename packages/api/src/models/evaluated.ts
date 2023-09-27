
import { EvaluatedAnswers } from './evaluated-answers';

export interface Evaluated {
  evaluationRef?: string;
  baseToken?: string;
  token?: string;
  status?: string;
  sensitiveDataTreatmentPolicyAccepted: any;
  indEmpEntId?: number;
  employee?: any;
  temp: EvaluatedAnswers;
  alreadySentEmail?: string;
}
