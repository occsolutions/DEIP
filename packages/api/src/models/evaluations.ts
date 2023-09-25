
import { Translations } from './translations';
import { Question } from './question';

export interface Evaluations {
  d1: {
    label: Translations,
    attrs: {
      d1_attr1: {
        label: Translations,
        questions: {
          d1_attr1_q1: Question,
          d1_attr1_q2: Question,
          d1_attr1_q3: Question
        }
      }
      d1_attr2: {
        label: Translations,
        questions: {
          d1_attr2_q1: Question,
          d1_attr2_q2: Question
        }
      },
      d1_attr3: {
        label: Translations,
        questions: {
          d1_attr3_q1: Question
        }
      },
      d1_attr4: {
        label: Translations,
        questions: {
          d1_attr4_q1: Question
        }
      },
      d1_attr5: {
        label: Translations,
        questions: {
          d1_attr5_q1: Question,
          d1_attr5_q2: Question
        }
      },
      d1_attr6: {
        label: Translations,
        questions: {
          d1_attr6_q1: Question,
          d1_attr6_q2: Question
        }
      }
    },
  },
  d2: {
    label: Translations,
    attrs: {
      d2_attr1: {
        label: Translations,
        questions: {
          d2_attr1_q1: Question
        }
      },
      d2_attr2: {
        label: Translations,
        questions: {
          d2_attr2_q2: Question
        }
      },
      d2_attr3: {
        label: Translations,
        questions: {
          d2_attr3_q1: Question,
          d2_attr3_q2: Question,
          d2_attr3_q3: Question,
          d2_attr3_q4: Question
        },
      },
      d2_attr4: {
        label: Translations,
        questions: {
          d2_attr4_q1: Question,
          d2_attr4_q2: Question
        }
      },
      d2_attr5: {
        label: Translations,
        questions: {
          d2_attr5_q1: Question
        }
      },
      d2_attr6: {
        label: Translations,
        questions: {
          d2_attr6_q1: Question,
          d2_attr6_q2: Question
        }
      },
      d2_attr7: {
        label: Translations,
        questions: {
          d2_attr7_q1: Question
        }
      }
    }
  },
  d3: {
    label: Translations,
    attrs: {
      d3_attr1: {
        label: Translations,
        questions: {
          d3_attr1_q1: Question,
          d3_attr1_q2: Question
        }
      },
      d3_attr2: {
        label: Translations,
        questions: {
          d3_attr2_q1: Question,
          d3_attr2_q2: Question,
          d3_attr2_q3: Question,
          d3_attr2_q4: Question
        }
      }
      d3_attr3: {
        label: Translations,
        questions: {
          d3_attr3_q1: Question,
          d3_attr3_q2: Question,
          d3_attr3_q3: Question
        }
      },
      d3_attr4: {
        label: Translations,
        questions: {
          d3_attr4_q1: Question,
          d3_attr4_q2: Question,
          d3_attr4_q3: Question
        }
      },
      d3_attr5: {
        label: Translations,
        questions: {
          d3_attr5_q1: Question
        }
      },
      d3_attr6: {
        label: Translations,
        questions: {
          d3_attr6_q1: Question
        }
      },
      d3_attr7: {
        label: Translations,
        questions: {
          d3_attr7_q1: Question
        }
      }
    }
  },
  d4: {
    label: Translations,
    attrs: {
      d4_attr1: {
        label: Translations,
        questions: {
          d4_attr1_q1: Question,
          d4_attr1_q2: Question
        }
      },
      d4_attr2: {
        label: Translations,
        questions: {
          d4_attr2_q1: Question
        }
      },
      d4_attr3: {
        label: Translations,
        questions: {
          d4_attr3_q1: Question
        }
      },
      d4_attr4: {
        label: Translations,
        questions: {
          d4_attr4_q1: Question
        }
      },
      d4_attr5: {
        label: Translations,
        questions: {
          d4_attr5_q1: Question
        }
      },
      d4_attr6: {
        label: Translations,
        questions: {
          d4_attr6_q1: Question
        }
      },
      d4_attr7: {
        label: Translations,
        questions: {
          d4_attr7_q1: Question,
          d4_attr7_q2: Question
        }
      }
    }
  }
  d5: {
    label: Translations,
    attrs: {
      d5_attr1: {
        label: Translations,
        questions: {
          d5_attr1_q1: Question
        }
      },
      d5_attr2: {
        label: Translations,
        questions: {
          d5_attr2_q1: Question,
          d5_attr2_q2: Question
        }
      },
      d5_attr3: {
        label: Translations,
        questions: {
          d5_attr3_q1: Question,
          d5_attr3_q2: Question,
          d5_attr3_q3: Question
        }
      },
      d5_attr4: {
        label: Translations,
        questions: {
          d5_attr4_q1: Question,
          d5_attr4_q2: Question
        }
      },
      d5_attr5: {
        label: Translations,
        questions: {
          d5_attr5_q1: Question
        }
      }
    }
  },
  leader: {
    leader_q1: Question,
    leader_q2: Question,
    leader_q3: Question,
    leader_q4: Question,
    leader_q5: Question,
    leader_q6: Question,
    leader_q7: Question,
    leader_q8: Question,
    leader_q9: Question,
    leader_q10: Question,
    leader_q11: Question,
    leader_q12: Question
  }
}
