
export interface IScore {
  score: number;
}

interface IScores {
  score: number;
  scores: Array<number>;
}

interface IQuestion {
  qType: string;
  general: IScores;
  filtered: IScores;
}

interface ILeaderDimension {
    general: IScore;
    filtered: IScore;
    leader_q1: IQuestion;
    leader_q2: IQuestion;
    leader_q3: IQuestion;
    leader_q4: IQuestion;
    leader_q5: IQuestion;
    leader_q6: IQuestion;
    leader_q7: IQuestion;
    leader_q8: IQuestion;
    leader_q9: IQuestion;
    leader_q10: IQuestion;
    leader_q11: IQuestion;
    leader_q12: IQuestion;
}

export interface IAnswersDimension {
  d1: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d1_attr_1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_1_q1: IQuestion;
          d1_attr_1_q2: IQuestion;
          d1_attr_1_q3: IQuestion;
        }
      },
      d1_attr_2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_2_q1: IQuestion;
          d1_attr_2_q2: IQuestion;
        }
      },
      d1_attr_3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_3_q1: IQuestion;
        }
      },
      d1_attr_4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_4_q1: IQuestion;
        }
      },
      d1_attr_5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_5_q1: IQuestion;
          d1_attr_5_q2: IQuestion;
          d1_attr_5_q3: IQuestion;
        }
      },
      d1_attr_6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr_6_q1: IQuestion;
          d1_attr_6_q2: IQuestion;
        }
      }
    }
  };
  d2: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d2_attr_1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_1_q1: IQuestion;
        }
      },
      d2_attr_2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_2_q1: IQuestion;
        }
      },
      d2_attr_3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_3_q1: IQuestion;
          d2_attr_3_q2: IQuestion;
          d2_attr_3_q3: IQuestion;
        }
      },
      d2_attr_4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_4_q1: IQuestion;
          d2_attr_4_q2: IQuestion;
        }
      },
      d2_attr_5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_5_q1: IQuestion;
        }
      },
      d2_attr_6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_6_q1: IQuestion;
          d2_attr_6_q2: IQuestion;
          d2_attr_6_q3: IQuestion;
        }
      },
      d2_attr_7: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr_7_q1: IQuestion;
        }
      }
    }
  }
  d3: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d3_attr_1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_1_q1: IQuestion;
        }
      },
      d3_attr_2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_2_q1: IQuestion;
          d3_attr_2_q2: IQuestion;
          d3_attr_2_q3: IQuestion;
        }
      },
      d3_attr_3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_3_q1: IQuestion;
          d3_attr_3_q2: IQuestion;
          d3_attr_3_q3: IQuestion;
        }
      },
      d3_attr_4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_4_q1: IQuestion;
          d3_attr_4_q2: IQuestion;
          d3_attr_4_q3: IQuestion;
        }
      },
      d3_attr_5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_5_q1: IQuestion;
        }
      },
      d3_attr_6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr_6_q1: IQuestion;
        }
      }
    }
  }
  d4: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d4_attr_1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_1_q1: IQuestion;
          d4_attr_1_q2: IQuestion;
        }
      },
      d4_attr_2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_2_q1: IQuestion;
        }
      },
      d4_attr_3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_3_q1: IQuestion;
        }
      },
      d4_attr_4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_4_q1: IQuestion;
          d4_attr_4_q2: IQuestion;
        }
      },
      d4_attr_5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_5_q1: IQuestion;
        }
      },
      d4_attr_6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_6_q1: IQuestion;
        }
      },
      d4_attr_7: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr_7_q1: IQuestion;
          d4_attr_7_q2: IQuestion;
        }
      }
    }
  }
  d5: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d5_attr_1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr_1_q1: IQuestion;
        }
      },
      d5_attr_2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr_2_q1: IQuestion;
          d5_attr_2_q2: IQuestion;
        }
      },
      d5_attr_3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr_3_q1: IQuestion;
          d5_attr_3_q2: IQuestion;
          d5_attr_3_q3: IQuestion;
        }
      },
      d5_attr_4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr_4_q1: IQuestion;
          d5_attr_4_q2: IQuestion;
        }
      },
      d5_attr_5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr_5_q1: IQuestion;
          d5_attr_5_q2: IQuestion;
        }
      }
    }
  }
  leader: ILeaderDimension;
}
