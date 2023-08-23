
import { default as EvaluationsService } from '../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../services/evaluated.srvc';
import { default as EvaluationAnswersService } from '../../services/evaluation-answers.srvc';
import { default as OpenQuestionService } from '../../services/open-question.srvc';
import { default as QuestionsIndexService } from '../../services/question-index.srvc';
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';

import RunHttpRequest from '../../utils/run-http-request';

class SaveTempAnswers {

  static readonly indices = ['generalHealth', 'burnoutIndividual', 'burnoutOrganizational'];

  public async processAnswers() {
    const pendingOperationThreads = await OperationThreadsService.findBatchByOperationAndStatus(
      'TempAnswers',
      'pending',
      100
    );

    let processedCount = 0;
    let breakLoop = false;
    const loopedEvaluationsIds = [];
    for (const thread of pendingOperationThreads) {
      try {
        const threadData = thread.data;

        // Check if answers had already been saved
        const answerExist = await EvaluationAnswersService.findOneByPopulationId(threadData.evaluationRef, threadData.populationRef);
        if (answerExist) {
          throw 'Answers already saved.';
        }

        // Check if valid participant
        const validEvaluated = await EvaluatedService.findOneCompletedByEvaluationRefAndId(threadData.evaluationRef, threadData.populationRef);
        if (!validEvaluated) {
          throw 'Invalid evaluated.';
        }

        const employeeData = threadData.employee.employeeEnterprise;
        const answerStructure = {
          evaluationRef: threadData.evaluationRef,
          _populationId: threadData.populationRef,
          demographicItems: {
            countryId: employeeData.countryId,
            headquarterId: employeeData.headquarterId,
            departmentId: employeeData.departmentId,
            enterpriseId: employeeData.enterpriseId,
            genderId: employeeData.genderId,
            jobTypeId: employeeData.jobTypeId,
            academicDegreeId: employeeData.academicDegreeId,
            chargeId: employeeData.chargeId,
            identifyTypeId: employeeData.identifyTypeId,
            additionalDemographic1Id: employeeData.additionalDemographic1Id,
            additionalDemographic2Id: employeeData.additionalDemographic2Id,
            birthdate: employeeData.birthdate,
            admission: employeeData.admission
          },
          segmentation: [],
          evaluations: [],
          indices: [],
          openQuestions: [],
          additionalQuestions: []
        };

        const tempAnswers = threadData.tempAnswers;
        let indicesQs = [];
        for (const key of Object.keys(tempAnswers)) {
          switch (key) {
            case 'segmentation':
              answerStructure.segmentation = tempAnswers[key];
              // Save Employee Segmentation into SUITE
              for (const segmentation of tempAnswers[key]) {
                if (segmentation.detailId !== -1) {
                  const suiteRes = await RunHttpRequest.suitePost(undefined, `additional-segmentation/save-employee-detail/${segmentation.detailId}/${employeeData.id}`);
                  if (!suiteRes.success) throw 'Suite communication failed';
                }
              }
              break;
            case 'evaluations':
              const formattedData = await this.formatQuestionnaireAnswers(threadData.questionnaire, tempAnswers[key]);
              answerStructure.evaluations = formattedData.dimensionStructure;
              indicesQs = formattedData.indexAnswers;
              break;
            case 'indices':
              const indexStructure = [];
              let groupCnt = 0;
              for (const iGroup of SaveTempAnswers.indices) {
                let groupAcumulator = 0;
                indexStructure.push({ name: iGroup, score: 0, answers: []});
                // Questionnaire Index questions
                let indexCnt = 0;
                for (const qIndex of indicesQs) {
                  if (qIndex.index.includes(iGroup)) {
                    indexStructure[groupCnt].answers.push({
                      idx: undefined,
                      score: qIndex.answer
                    });
                    groupAcumulator += qIndex.answer;
                    indexCnt++;
                  }
                }
                // Index questions (Non-Questionnaire)
                const indexGroup = await QuestionsIndexService.listByIndexGroup(iGroup);
                for (const group of indexGroup) {
                  const iAnswer = tempAnswers[key].find(x => x.idx === group.idx);
                  indexStructure[groupCnt].answers.push({
                    idx: iAnswer.idx,
                    score: iAnswer.answer
                  });
                  groupAcumulator += iAnswer.answer;
                  indexCnt++;
                }
                // Update index group average score
                indexStructure[groupCnt].score = groupAcumulator / indexCnt;
                groupCnt++;
              }
              answerStructure.indices = indexStructure;
              break;
            case 'additional':
              answerStructure.additionalQuestions = tempAnswers[key];
              break;
            case 'open':
              const answersOpenQ = [];
              const allOpenQs = await OpenQuestionService.findAll();
              for (const oq of allOpenQs) {
                const q = tempAnswers[key].find(q => q.question === oq.name);
                answersOpenQ.push({
                  question: {
                    name: oq.name,
                    translation: oq.question
                  },
                  answer: q.answer
                });
              }
              answerStructure.openQuestions = answersOpenQ;
              break;
          }
        }

        // Save final answers
        await EvaluationAnswersService.save(answerStructure);

        // Close thread
        await OperationThreadsService.findOneAndUpdateStatus(thread._id, 'completed');

        // Update Evaluations's populationCompletedCount
        const evaluatedCnt = await EvaluatedService.countByEvaluationRef(threadData.evaluationRef);
        const newAnswerCount = await EvaluationAnswersService.countByEvaluationId(threadData.evaluationRef);
        if (newAnswerCount <= evaluatedCnt) {
          await EvaluationsService.updateAnsweredCount(threadData.evaluationRef, newAnswerCount);
        } else {
          breakLoop = true;
          throw 'Answer count exeeded.';
        }

        processedCount++;
      } catch (error) {
        await this.saveFailed(thread._id, 'TempAnswersLoop', {
          error: error.stack ? error.stack : error.toString()
        });
        if (breakLoop) {
          break;
        }
      }
    }

    return processedCount;
  }

  private formatQuestionnaireAnswers (questionnaire: any, data: any) {
    let dimCnt = 0;
    const dimensionStructure: any = [];
    const indexAnswers: any = [];
    for (const dimKey of Object.keys(questionnaire)) {
      let dimAcumulator = 0;
      dimensionStructure.push({ name: dimKey, score: 0, variables: [] });
      let varCnt = 0;
      let auxCnt = 0;
      for (const varKey of Object.keys(questionnaire[dimKey])) {
        let varAcumulator = 0;
        dimensionStructure[dimCnt].variables.push({ name: varKey, score: 0, questions: [] });
        let qCnt = 0;
        for (const qKey of Object.keys(questionnaire[dimKey][varKey])) {
          const foundIndex = questionnaire[dimKey][varKey][qKey].index.some(r => SaveTempAnswers.indices.includes(r));
          const qScore = data[dimCnt].variable[auxCnt].score;
          if (foundIndex) {
            indexAnswers.push({
              index: questionnaire[dimKey][varKey][qKey].index,
              answer: qScore
            });
          }
          dimensionStructure[dimCnt].variables[varCnt].questions.push({ name: qKey, score: qScore });
          varAcumulator += qScore;
          qCnt++;
          auxCnt++;
        }
        dimAcumulator += varAcumulator / qCnt;
        // Update variable average score
        dimensionStructure[dimCnt].variables[varCnt].score = varAcumulator / qCnt;
        varCnt++;
      }
      // Update dimension average score
      dimensionStructure[dimCnt].score = dimAcumulator / varCnt;
      dimCnt++;
    }

    return {
      dimensionStructure,
      indexAnswers
    };
  }

  private async saveFailed (_id: string, type: string, data: {[key: string]: any}) {
    await OperationThreadsService.findOneAndSaveFail(_id, { type, ...data});
    return `failed by: ${type}`;
  }
}

export default new SaveTempAnswers();
