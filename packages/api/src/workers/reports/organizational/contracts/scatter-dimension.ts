
interface IScatter {
  scatter: number | {
    average: number;
    scores: Array<number>;
  },
  previous: number | {
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
      d1_attr1: {
        questions: {
          d1_attr1_q1: IScatter;
          d1_attr1_q2: IScatter;
          d1_attr1_q3: IScatter;
        }
      },
      d1_attr2: {
        questions: {
          d1_attr2_q1: IScatter;
          d1_attr2_q2: IScatter;
        }
      },
      d1_attr3: {
        questions: {
          d1_attr3_q1: IScatter;
        }
      },
      d1_attr4: {
        questions: {
          d1_attr4_q1: IScatter;
        }
      },
      d1_attr5: {
        questions: {
          d1_attr5_q1: IScatter;
          d1_attr5_q2: IScatter;
          d1_attr5_q3: IScatter;
        }
      },
      d1_attr6: {
        questions: {
          d1_attr6_q1: IScatter;
          d1_attr6_q2: IScatter;
        }
      }
    }
  },
  d2: {
    attrs: {
      d2_attr1: {
        questions: {
          d2_attr1_q1: IScatter;
        }
      },
      d2_attr2: {
        questions: {
          d2_attr2_q1: IScatter;
        }
      },
      d2_attr3: {
        questions: {
          d2_attr3_q1: IScatter;
          d2_attr3_q2: IScatter;
          d2_attr3_q3: IScatter;
        }
      },
      d2_attr4: {
        questions: {
          d2_attr4_q1: IScatter;
          d2_attr4_q2: IScatter;
        }
      },
      d2_attr5: {
        questions: {
          d2_attr5_q1: IScatter;
        }
      },
      d2_attr6: {
        questions: {
          d2_attr6_q1: IScatter;
          d2_attr6_q2: IScatter;
          d2_attr6_q3: IScatter;
        }
      },
      d2_attr7: {
        questions: {
          d2_attr7_q1: IScatter;
        }
      }
    }
  },
  d3: {
    attrs: {
      d3_attr1: {
        questions: {
          d3_attr1_q1: IScatter;
        }
      },
      d3_attr2: {
        questions: {
          d3_attr2_q1: IScatter;
          d3_attr2_q2: IScatter;
          d3_attr2_q3: IScatter;
        }
      },
      d3_attr3: {
        questions: {
          d3_attr3_q1: IScatter;
          d3_attr3_q2: IScatter;
          d3_attr3_q3: IScatter;
        }
      },
      d3_attr4: {
        questions: {
          d3_attr4_q1: IScatter;
          d3_attr4_q2: IScatter;
          d3_attr4_q3: IScatter;
        }
      },
      d3_attr5: {
        questions: {
          d3_attr5_q1: IScatter;
        }
      },
      d3_attr6: {
        questions: {
          d3_attr6_q1: IScatter;
        }
      }
    }
  },
  d4: {
    attrs: {
      d4_attr1: {
        questions: {
          d4_attr1_q1: IScatter;
          d4_attr1_q2: IScatter;
        }
      },
      d4_attr2: {
        questions: {
          d4_attr2_q1: IScatter;
        }
      },
      d4_attr3: {
        questions: {
          d4_attr3_q1: IScatter;
        }
      },
      d4_attr4: {
        questions: {
          d4_attr4_q1: IScatter;
          d4_attr4_q2: IScatter;
        }
      },
      d4_attr5: {
        questions: {
          d4_attr5_q1: IScatter;
        }
      },
      d4_attr6: {
        questions: {
          d4_attr6_q1: IScatter;
        }
      },
      d4_attr7: {
        questions: {
          d4_attr7_q1: IScatter;
          d4_attr7_q2: IScatter;
        }
      }
    }
  },
  d5: {
    attrs: {
      d5_attr1: {
        questions: {
          d5_attr1_q1: IScatter;
        }
      },
      d5_attr2: {
        questions: {
          d5_attr2_q1: IScatter;
          d5_attr2_q2: IScatter;
        }
      },
      d5_attr3: {
        questions: {
          d5_attr3_q1: IScatter;
          d5_attr3_q2: IScatter;
          d5_attr3_q3: IScatter;
        }
      },
      d5_attr4: {
        questions: {
          d5_attr4_q1: IScatter;
          d5_attr4_q2: IScatter;
        }
      },
      d5_attr5: {
        questions: {
          d5_attr5_q1: IScatter;
          d5_attr5_q2: IScatter;
        }
      }
    }
  },
  leader: ILeaderDimension;
}
