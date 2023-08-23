
export interface IScore {
  score: number;
  previous: number;
}

interface IQuestion {
  name: string;
  general: IScore;
}

interface IVariable {
  name: string;
  general: IScore;
  questions: {
    question_1: IQuestion;
    question_2: IQuestion;
    question_3: IQuestion;
    question_4: IQuestion;
  }
}

interface IDimension {
  general: IScore;
  variables: {
    var_1: IVariable;
    var_2: IVariable;
    var_3: IVariable;
  }
}

export interface IAnswersDimension {
  physical: IDimension;
  mental: IDimension;
  emotional: IDimension;
  professional: IDimension;
}
