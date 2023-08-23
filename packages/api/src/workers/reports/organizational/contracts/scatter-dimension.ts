
interface IScatter {
  average: number;
  scores: Array<number>;
}

interface IVariable {
  questions: {
    question_1: {
      scatter: IScatter;
    };
    question_2: {
      scatter: IScatter;
    };
    question_3: {
      scatter: IScatter;
    };
    question_4: {
      scatter: IScatter;
    };
  }
}

interface IDimension {
  variables: {
    var_1: IVariable;
    var_2: IVariable;
    var_3: IVariable;
  }
}

export interface IDimensionScatter {
  physical: IDimension;
  mental: IDimension;
  emotional: IDimension;
  professional: IDimension;
}
