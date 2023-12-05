
interface IScatter {
  scatter: number | {
    average: number;
    scores: Array<number>;
  }
}

interface ILeaderDimension {
    leader_q1: IScatter;
    leader_q2: IScatter;
    leader_q3: IScatter;
    leader_q4: IScatter;
    leader_q5: IScatter;
    leader_q6: IScatter;
    leader_q7: IScatter;
    leader_q8: IScatter;
    leader_q9: IScatter;
    leader_q10: IScatter;
    leader_q11: IScatter;
    leader_q12: IScatter;
}

export interface IDimensionScatter {
  d1: {
    attrs: {
      d1_attr_1: {
        questions: {
          d1_attr_1_q1: IScatter;
          d1_attr_1_q2: IScatter;
          d1_attr_1_q3: IScatter;
        }
      },
      d1_attr_2: {
        questions: {
          d1_attr_2_q1: IScatter;
          d1_attr_2_q2: IScatter;
        }
      },
      d1_attr_3: {
        questions: {
          d1_attr_3_q1: IScatter;
        }
      },
      d1_attr_4: {
        questions: {
          d1_attr_4_q1: IScatter;
        }
      },
      d1_attr_5: {
        questions: {
          d1_attr_5_q1: IScatter;
          d1_attr_5_q2: IScatter;
          d1_attr_5_q3: IScatter;
        }
      },
      d1_attr_6: {
        questions: {
          d1_attr_6_q1: IScatter;
          d1_attr_6_q2: IScatter;
        }
      }
    }
  },
  d2: {
    attrs: {
      d2_attr_1: {
        questions: {
          d2_attr_1_q1: IScatter;
        }
      },
      d2_attr_2: {
        questions: {
          d2_attr_2_q1: IScatter;
        }
      },
      d2_attr_3: {
        questions: {
          d2_attr_3_q1: IScatter;
          d2_attr_3_q2: IScatter;
          d2_attr_3_q3: IScatter;
        }
      },
      d2_attr_4: {
        questions: {
          d2_attr_4_q1: IScatter;
          d2_attr_4_q2: IScatter;
        }
      },
      d2_attr_5: {
        questions: {
          d2_attr_5_q1: IScatter;
        }
      },
      d2_attr_6: {
        questions: {
          d2_attr_6_q1: IScatter;
          d2_attr_6_q2: IScatter;
          d2_attr_6_q3: IScatter;
        }
      },
      d2_attr_7: {
        questions: {
          d2_attr_7_q1: IScatter;
        }
      }
    }
  },
  d3: {
    attrs: {
      d3_attr_1: {
        questions: {
          d3_attr_1_q1: IScatter;
        }
      },
      d3_attr_2: {
        questions: {
          d3_attr_2_q1: IScatter;
          d3_attr_2_q2: IScatter;
          d3_attr_2_q3: IScatter;
        }
      },
      d3_attr_3: {
        questions: {
          d3_attr_3_q1: IScatter;
          d3_attr_3_q2: IScatter;
          d3_attr_3_q3: IScatter;
        }
      },
      d3_attr_4: {
        questions: {
          d3_attr_4_q1: IScatter;
          d3_attr_4_q2: IScatter;
          d3_attr_4_q3: IScatter;
        }
      },
      d3_attr_5: {
        questions: {
          d3_attr_5_q1: IScatter;
        }
      },
      d3_attr_6: {
        questions: {
          d3_attr_6_q1: IScatter;
        }
      }
    }
  },
  d4: {
    attrs: {
      d4_attr_1: {
        questions: {
          d4_attr_1_q1: IScatter;
          d4_attr_1_q2: IScatter;
        }
      },
      d4_attr_2: {
        questions: {
          d4_attr_2_q1: IScatter;
        }
      },
      d4_attr_3: {
        questions: {
          d4_attr_3_q1: IScatter;
        }
      },
      d4_attr_4: {
        questions: {
          d4_attr_4_q1: IScatter;
          d4_attr_4_q2: IScatter;
        }
      },
      d4_attr_5: {
        questions: {
          d4_attr_5_q1: IScatter;
        }
      },
      d4_attr_6: {
        questions: {
          d4_attr_6_q1: IScatter;
        }
      },
      d4_attr_7: {
        questions: {
          d4_attr_7_q1: IScatter;
          d4_attr_7_q2: IScatter;
        }
      }
    }
  },
  d5: {
    attrs: {
      d5_attr_1: {
        questions: {
          d5_attr_1_q1: IScatter;
        }
      },
      d5_attr_2: {
        questions: {
          d5_attr_2_q1: IScatter;
          d5_attr_2_q2: IScatter;
        }
      },
      d5_attr_3: {
        questions: {
          d5_attr_3_q1: IScatter;
          d5_attr_3_q2: IScatter;
          d5_attr_3_q3: IScatter;
        }
      },
      d5_attr_4: {
        questions: {
          d5_attr_4_q1: IScatter;
          d5_attr_4_q2: IScatter;
        }
      },
      d5_attr_5: {
        questions: {
          d5_attr_5_q1: IScatter;
          d5_attr_5_q2: IScatter;
        }
      }
    }
  },
  leader: ILeaderDimension;
}
