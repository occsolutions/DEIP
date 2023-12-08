
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
      d1_attr1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr1_q1: IQuestion;
          d1_attr1_q2: IQuestion;
          d1_attr1_q3: IQuestion;
        }
      },
      d1_attr2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr2_q1: IQuestion;
          d1_attr2_q2: IQuestion;
        }
      },
      d1_attr3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr3_q1: IQuestion;
        }
      },
      d1_attr4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr4_q1: IQuestion;
        }
      },
      d1_attr5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr5_q1: IQuestion;
          d1_attr5_q2: IQuestion;
          d1_attr5_q3: IQuestion;
        }
      },
      d1_attr6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d1_attr6_q1: IQuestion;
          d1_attr6_q2: IQuestion;
        }
      }
    }
  };
  d2: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d2_attr1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr1_q1: IQuestion;
        }
      },
      d2_attr2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr2_q1: IQuestion;
        }
      },
      d2_attr3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr3_q1: IQuestion;
          d2_attr3_q2: IQuestion;
          d2_attr3_q3: IQuestion;
        }
      },
      d2_attr4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr4_q1: IQuestion;
          d2_attr4_q2: IQuestion;
        }
      },
      d2_attr5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr5_q1: IQuestion;
        }
      },
      d2_attr6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr6_q1: IQuestion;
          d2_attr6_q2: IQuestion;
          d2_attr6_q3: IQuestion;
        }
      },
      d2_attr7: {
        general: IScore;
        filtered: IScore;
        questions: {
          d2_attr7_q1: IQuestion;
        }
      }
    }
  }
  d3: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d3_attr1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr1_q1: IQuestion;
        }
      },
      d3_attr2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr2_q1: IQuestion;
          d3_attr2_q2: IQuestion;
          d3_attr2_q3: IQuestion;
        }
      },
      d3_attr3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr3_q1: IQuestion;
          d3_attr3_q2: IQuestion;
          d3_attr3_q3: IQuestion;
        }
      },
      d3_attr4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr4_q1: IQuestion;
          d3_attr4_q2: IQuestion;
          d3_attr4_q3: IQuestion;
        }
      },
      d3_attr5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr5_q1: IQuestion;
        }
      },
      d3_attr6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d3_attr6_q1: IQuestion;
        }
      }
    }
  }
  d4: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d4_attr1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr1_q1: IQuestion;
          d4_attr1_q2: IQuestion;
        }
      },
      d4_attr2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr2_q1: IQuestion;
        }
      },
      d4_attr3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr3_q1: IQuestion;
        }
      },
      d4_attr4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr4_q1: IQuestion;
          d4_attr4_q2: IQuestion;
        }
      },
      d4_attr5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr5_q1: IQuestion;
        }
      },
      d4_attr6: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr6_q1: IQuestion;
        }
      },
      d4_attr7: {
        general: IScore;
        filtered: IScore;
        questions: {
          d4_attr7_q1: IQuestion;
          d4_attr7_q2: IQuestion;
        }
      }
    }
  }
  d5: {
    general: IScore;
    filtered: IScore;
    attrs: {
      d5_attr1: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr1_q1: IQuestion;
        }
      },
      d5_attr2: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr2_q1: IQuestion;
          d5_attr2_q2: IQuestion;
        }
      },
      d5_attr3: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr3_q1: IQuestion;
          d5_attr3_q2: IQuestion;
          d5_attr3_q3: IQuestion;
        }
      },
      d5_attr4: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr4_q1: IQuestion;
          d5_attr4_q2: IQuestion;
        }
      },
      d5_attr5: {
        general: IScore;
        filtered: IScore;
        questions: {
          d5_attr5_q1: IQuestion;
          d5_attr5_q2: IQuestion;
        }
      }
    }
  }
  leader: ILeaderDimension;
}
