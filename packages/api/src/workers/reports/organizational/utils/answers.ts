
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';

class AnswersUtils {

  // Answers for Scatter Initializer
  public iniAnswersForScatter (isFinal = false): IDimensionScatter {
    const getInitScatter = () => ({ scatter: isFinal ? 0 : { average: 0, scores: [] } });

    const getInitLeaderScatter = () => ({
      leader_q1: getInitScatter(),
      leader_q2: getInitScatter(),
      leader_q3: getInitScatter(),
      leader_q4: getInitScatter(),
      leader_q5: getInitScatter(),
      leader_q6: getInitScatter(),
      leader_q7: getInitScatter(),
      leader_q8: getInitScatter(),
      leader_q9: getInitScatter(),
      leader_q10: getInitScatter(),
      leader_q11: getInitScatter(),
      leader_q12: getInitScatter()
    });

    return {
      d1: {
        attrs: {
          d1_attr1: {
            questions: {
              d1_attr1_q1: getInitScatter(),
              d1_attr1_q2: getInitScatter(),
              d1_attr1_q3: getInitScatter(),
            }
          },
          d1_attr2: {
            questions: {
              d1_attr2_q1: getInitScatter(),
              d1_attr2_q2: getInitScatter(),
            }
          },
          d1_attr3: {
            questions: {
              d1_attr3_q1: getInitScatter(),
            }
          },
          d1_attr4: {
            questions: {
              d1_attr4_q1: getInitScatter(),
            }
          },
          d1_attr5: {
            questions: {
              d1_attr5_q1: getInitScatter(),
              d1_attr5_q2: getInitScatter(),
              d1_attr5_q3: getInitScatter(),
            }
          },
          d1_attr6: {
            questions: {
              d1_attr6_q1: getInitScatter(),
              d1_attr6_q2: getInitScatter(),
            }
          }
        }
      },
      d2: {
        attrs: {
          d2_attr1: {
            questions: {
              d2_attr1_q1: getInitScatter(),
            }
          },
          d2_attr2: {
            questions: {
              d2_attr2_q1: getInitScatter(),
            }
          },
          d2_attr3: {
            questions: {
              d2_attr3_q1: getInitScatter(),
              d2_attr3_q2: getInitScatter(),
              d2_attr3_q3: getInitScatter(),
            }
          },
          d2_attr4: {
            questions: {
              d2_attr4_q1: getInitScatter(),
              d2_attr4_q2: getInitScatter(),
            }
          },
          d2_attr5: {
            questions: {
              d2_attr5_q1: getInitScatter(),
            }
          },
          d2_attr6: {
            questions: {
              d2_attr6_q1: getInitScatter(),
              d2_attr6_q2: getInitScatter(),
              d2_attr6_q3: getInitScatter(),
            }
          },
          d2_attr7: {
            questions: {
              d2_attr7_q1: getInitScatter(),
            }
          }
        }
      },
      d3: {
        attrs: {
          d3_attr1: {
            questions: {
              d3_attr1_q1: getInitScatter(),
            }
          },
          d3_attr2: {
            questions: {
              d3_attr2_q1: getInitScatter(),
              d3_attr2_q2: getInitScatter(),
              d3_attr2_q3: getInitScatter(),
            }
          },
          d3_attr3: {
            questions: {
              d3_attr3_q1: getInitScatter(),
              d3_attr3_q2: getInitScatter(),
              d3_attr3_q3: getInitScatter(),
            }
          },
          d3_attr4: {
            questions: {
              d3_attr4_q1: getInitScatter(),
              d3_attr4_q2: getInitScatter(),
              d3_attr4_q3: getInitScatter(),
            }
          },
          d3_attr5: {
            questions: {
              d3_attr5_q1: getInitScatter(),
            }
          },
          d3_attr6: {
            questions: {
              d3_attr6_q1: getInitScatter(),
            }
          }
        }
      },
      d4: {
        attrs: {
          d4_attr1: {
            questions: {
              d4_attr1_q1: getInitScatter(),
              d4_attr1_q2: getInitScatter(),
            }
          },
          d4_attr2: {
            questions: {
              d4_attr2_q1: getInitScatter(),
            }
          },
          d4_attr3: {
            questions: {
              d4_attr3_q1: getInitScatter(),
            }
          },
          d4_attr4: {
            questions: {
              d4_attr4_q1: getInitScatter(),
              d4_attr4_q2: getInitScatter(),
            }
          },
          d4_attr5: {
            questions: {
              d4_attr5_q1: getInitScatter(),
            }
          },
          d4_attr6: {
            questions: {
              d4_attr6_q1: getInitScatter(),
            }
          },
          d4_attr7: {
            questions: {
              d4_attr7_q1: getInitScatter(),
              d4_attr7_q2: getInitScatter(),
            }
          }
        }
      },
      d5: {
        attrs: {
          d5_attr1: {
            questions: {
              d5_attr1_q1: getInitScatter(),
            }
          },
          d5_attr2: {
            questions: {
              d5_attr2_q1: getInitScatter(),
              d5_attr2_q2: getInitScatter(),
            }
          },
          d5_attr3: {
            questions: {
              d5_attr3_q1: getInitScatter(),
              d5_attr3_q2: getInitScatter(),
              d5_attr3_q3: getInitScatter(),
            }
          },
          d5_attr4: {
            questions: {
              d5_attr4_q1: getInitScatter(),
              d5_attr4_q2: getInitScatter(),
            }
          },
          d5_attr5: {
            questions: {
              d5_attr5_q1: getInitScatter(),
              d5_attr5_q2: getInitScatter(),
            }
          }
        }
      },
      leader: getInitLeaderScatter()
    };
  }

  // Questionnaire Answers Initializer
  public iniAnswersDimension (): IAnswersDimension {
    const getInitScore = () => ({ score: 0, previous: 0 });
    const getInitScores = () => ({ score: 0, scores: [], previous: 0 });
    const getInitQuestion = () => ({ qType: '', general: getInitScores() });
    const getInitLeaderDimension = () => ({
      general: getInitScore(),
      leader_q1: getInitQuestion(),
      leader_q2: getInitQuestion(),
      leader_q3: getInitQuestion(),
      leader_q4: getInitQuestion(),
      leader_q5: getInitQuestion(),
      leader_q6: getInitQuestion(),
      leader_q7: getInitQuestion(),
      leader_q8: getInitQuestion(),
      leader_q9: getInitQuestion(),
      leader_q10: getInitQuestion(),
      leader_q11: getInitQuestion(),
      leader_q12: getInitQuestion()
    });

    return {
      d1: {
        general: getInitScore(),
        attrs: {
          d1_attr1: {
            general: getInitScore(),
            questions: {
              d1_attr1_q1: getInitQuestion(),
              d1_attr1_q2: getInitQuestion(),
              d1_attr1_q3: getInitQuestion(),
            }
          },
          d1_attr2: {
            general: getInitScore(),
            questions: {
              d1_attr2_q1: getInitQuestion(),
              d1_attr2_q2: getInitQuestion(),
            }
          },
          d1_attr3: {
            general: getInitScore(),
            questions: {
              d1_attr3_q1: getInitQuestion(),
            }
          },
          d1_attr4: {
            general: getInitScore(),
            questions: {
              d1_attr4_q1: getInitQuestion(),
            }
          },
          d1_attr5: {
            general: getInitScore(),
            questions: {
              d1_attr5_q1: getInitQuestion(),
              d1_attr5_q2: getInitQuestion(),
              d1_attr5_q3: getInitQuestion(),
            }
          },
          d1_attr6: {
            general: getInitScore(),
            questions: {
              d1_attr6_q1: getInitQuestion(),
              d1_attr6_q2: getInitQuestion(),
            }
          }
        }
      },
      d2: {
        general: getInitScore(),
        attrs: {
          d2_attr1: {
            general: getInitScore(),
            questions: {
              d2_attr1_q1: getInitQuestion(),
            }
          },
          d2_attr2: {
            general: getInitScore(),
            questions: {
              d2_attr2_q1: getInitQuestion(),
            }
          },
          d2_attr3: {
            general: getInitScore(),
            questions: {
              d2_attr3_q1: getInitQuestion(),
              d2_attr3_q2: getInitQuestion(),
              d2_attr3_q3: getInitQuestion(),
            }
          },
          d2_attr4: {
            general: getInitScore(),
            questions: {
              d2_attr4_q1: getInitQuestion(),
              d2_attr4_q2: getInitQuestion(),
            }
          },
          d2_attr5: {
            general: getInitScore(),
            questions: {
              d2_attr5_q1: getInitQuestion(),
            }
          },
          d2_attr6: {
            general: getInitScore(),
            questions: {
              d2_attr6_q1: getInitQuestion(),
              d2_attr6_q2: getInitQuestion(),
              d2_attr6_q3: getInitQuestion(),
            }
          },
          d2_attr7: {
            general: getInitScore(),
            questions: {
              d2_attr7_q1: getInitQuestion(),
            }
          }
        }
      },
      d3: {
        general: getInitScore(),
        attrs: {
          d3_attr1: {
            general: getInitScore(),
            questions: {
              d3_attr1_q1: getInitQuestion(),
            }
          },
          d3_attr2: {
            general: getInitScore(),
            questions: {
              d3_attr2_q1: getInitQuestion(),
              d3_attr2_q2: getInitQuestion(),
              d3_attr2_q3: getInitQuestion(),
            }
          },
          d3_attr3: {
            general: getInitScore(),
            questions: {
              d3_attr3_q1: getInitQuestion(),
              d3_attr3_q2: getInitQuestion(),
              d3_attr3_q3: getInitQuestion(),
            }
          },
          d3_attr4: {
            general: getInitScore(),
            questions: {
              d3_attr4_q1: getInitQuestion(),
              d3_attr4_q2: getInitQuestion(),
              d3_attr4_q3: getInitQuestion(),
            }
          },
          d3_attr5: {
            general: getInitScore(),
            questions: {
              d3_attr5_q1: getInitQuestion(),
            }
          },
          d3_attr6: {
            general: getInitScore(),
            questions: {
              d3_attr6_q1: getInitQuestion(),
            }
          }
        }
      },
      d4: {
        general: getInitScore(),
        attrs: {
          d4_attr1: {
            general: getInitScore(),
            questions: {
              d4_attr1_q1: getInitQuestion(),
              d4_attr1_q2: getInitQuestion(),
            }
          },
          d4_attr2: {
            general: getInitScore(),
            questions: {
              d4_attr2_q1: getInitQuestion(),
            }
          },
          d4_attr3: {
            general: getInitScore(),
            questions: {
              d4_attr3_q1: getInitQuestion(),
            }
          },
          d4_attr4: {
            general: getInitScore(),
            questions: {
              d4_attr4_q1: getInitQuestion(),
              d4_attr4_q2: getInitQuestion(),
            }
          },
          d4_attr5: {
            general: getInitScore(),
            questions: {
              d4_attr5_q1: getInitQuestion(),
            }
          },
          d4_attr6: {
            general: getInitScore(),
            questions: {
              d4_attr6_q1: getInitQuestion(),
            }
          },
          d4_attr7: {
            general: getInitScore(),
            questions: {
              d4_attr7_q1: getInitQuestion(),
              d4_attr7_q2: getInitQuestion(),
            }
          }
        }
      },
      d5: {
        general: getInitScore(),
        attrs: {
          d5_attr1: {
            general: getInitScore(),
            questions: {
              d5_attr1_q1: getInitQuestion(),
            }
          },
          d5_attr2: {
            general: getInitScore(),
            questions: {
              d5_attr2_q1: getInitQuestion(),
              d5_attr2_q2: getInitQuestion(),
            }
          },
          d5_attr3: {
            general: getInitScore(),
            questions: {
              d5_attr3_q1: getInitQuestion(),
              d5_attr3_q2: getInitQuestion(),
              d5_attr3_q3: getInitQuestion(),
            }
          },
          d5_attr4: {
            general: getInitScore(),
            questions: {
              d5_attr4_q1: getInitQuestion(),
              d5_attr4_q2: getInitQuestion(),
            }
          },
          d5_attr5: {
            general: getInitScore(),
            questions: {
              d5_attr5_q1: getInitQuestion(),
              d5_attr5_q2: getInitQuestion(),
            }
          }
        }
      },
      leader: getInitLeaderDimension()
    };
  }

  public runAnswersDimension (
    answers: Array<any>,
    answersForScatter: IDimensionScatter,
    answersDimension: IAnswersDimension,
    isLeader: boolean,
    previous: boolean
  ) {
    const dynamicKey = previous ? 'previous' : 'score';

    // Dimensions
    let dimCnt = 0;
    for (const dimKey of Object.keys(answersDimension)) {
      if (dimKey !== 'leader') {
        // Attributes
        let qCnt = 0;
        const dimAttributes = answersDimension[dimKey].attrs;
        for (const attrKey of Object.keys(dimAttributes)) {
          // Questions
          const attrQuestions = answersDimension[dimKey].attrs[attrKey].questions;
          for (const qKey of Object.keys(attrQuestions)) {
            const question = answers[dimCnt].attribute[qCnt];
            answersDimension[dimKey].attrs[attrKey].questions[qKey].qType = question.qType;
            if (['closed', 'likert'].includes(question.qType)) {
              if (question.qType === 'closed' && ![0, 1].includes(question.score[0])) {
                // Closed questions that were not answered with yes o no, worth zero (0)
                question.score[0] = 0;
              }
              if (question.qType === 'likert' && ![0, 0.25, 0.5, 0.75, 1].includes(question.score[0])) {
                // Likert questions that were not answered, worth zero (0)
                question.score[0] = 0;
              }
              answersDimension[dimKey].attrs[attrKey].questions[qKey].general[dynamicKey] += question.score[0];
              if (!previous) {
                answersForScatter[dimKey].attrs[attrKey].questions[qKey].scatter.scores.push(question.score[0]);
              }
            } else {
              // Options questions
              if ([-1].includes(question.score[0])) {
                // Options questions that were not answered, worth zero (0)
                question.score[0] = 0;
              }
              answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores.push(...question.score);
            }
            qCnt++;
          }
        }
      } else if (isLeader) {
        // Questions
        let qCnt = 0;
        for (const qKey of Object.keys(answersDimension[dimKey])) {
          if (!['general', 'filtered'].includes(qKey)) {
            const question = answers[dimCnt].attribute[qCnt];
            answersDimension[dimKey][qKey].qType = question.qType;
            if (['closed', 'likert'].includes(question.qType)) {
              if (question.qType === 'closed' && ![0, 1].includes(question.score[0])) {
                // Closed questions that were not answered with yes o no, worth zero (0)
                question.score[0] = 0;
              }
              answersDimension[dimKey][qKey].general[dynamicKey] += question.score[0];
              if (!previous) {
                answersForScatter[dimKey][qKey].scatter.scores.push(question.score[0]);
              }
            } else {
              // Options questions
              answersDimension[dimKey][qKey].general.scores.push(...question.score);
            }
            qCnt++;
          }
        }
      }
      dimCnt++;
    }

    return {
      evaluations: answersDimension,
      scatter: answersForScatter
    };
  }
}

export default new AnswersUtils();
