
interface IScore {
  score: number;
}

interface IIndexAnswer {
  idx: number;
  general: IScore;
  filtered: IScore;
}

interface IIndex {
  general: IScore;
  filtered: IScore;
  answers: {
    answer_1: IIndexAnswer;
    answer_2: IIndexAnswer;
    answer_3: IIndexAnswer;
    answer_4: IIndexAnswer;
    answer_5: IIndexAnswer;
    answer_6: IIndexAnswer;
  }
}

export interface IIndicesAnswers {
  generalHealth: IIndex;
  burnoutIndividual: IIndex;
  burnoutOrganizational: IIndex;
}
