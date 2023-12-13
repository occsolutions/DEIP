
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import slugify from 'slugify';
import * as xlsx from 'xlsx';

import { default as EvaluationsService } from '../services/evaluations.srvc';
import { default as EvaluatedService } from '../services/evaluated.srvc';
import { default as ProductServiceService } from '../services/product-service.srvc';
import { default as QuestionnairesService } from '../services/questionnaires.srvc';

import { default as OperationThreadsService } from '../services/operation-threads.srvc';

import { BadRequestException } from '../error';

import IRequest from './contracts/request';

import RunHttpRequest from '../utils/run-http-request';
import SpendRequest from '../utils/spend-request';

const promisify = require('util.promisify');

interface SuiteResInterface {
  res: any;
  success: boolean;
  request: any;
  error: any;
}

class EvaluationsController {

  async list(req: IRequest, res: Response) {
    const selectFields = 'displayName name questionnaire.name  status deliveredAt validUntil slug _id';
    const filter = req.query.filter ? { status: req.query.filter } : {};
    if (req.user.role === 'admin') {
      res.send({ items: await EvaluationsService.listAll(filter, selectFields) });
    } else {
      res.send({ items: await EvaluationsService.listByEnterprise(req.user.enterprise.id, filter, selectFields) });
    }
  }

  async saveTempAnswers(req: Request, resp: Response) {
    try {
      await EvaluatedService.updateTempAnswers(req.body.tokenId, req.body.data);
      resp.send();
    } catch (error) {
      resp.send({
        msg: 'Not found',
        er: error,
        status: 404
      });
    }
  }

  async finishPollByToken(req: Request, resp: Response) {
    try {
      // Find Evaluated
      const evaluated: any = await EvaluatedService.getOneByToken(req.body.tokenId);
      // Find Evaluation
      const evaluation: any = await EvaluationsService.findById(evaluated.evaluationRef as any);
      if (evaluation.status === 'completed') {
        throw new BadRequestException('evaluation-has-ended');
      }
      // Finish Poll
      const closedPoll: any = await EvaluatedService.setPollCompleted(req.body.tokenId);

      // Update Evaluation's populationCompletedCount
      const completedCount: number = await EvaluatedService.countCompletedByEvaluationRef(evaluation._id);
      await EvaluationsService.updateAnsweredCount(evaluation._id, completedCount);

      // Check if there are still uncompleted participants
      const isInProgress = await EvaluatedService.getAtLeastOneActiveParticipant(evaluation._id);
      if (!isInProgress) {
        await EvaluationsService.closeEvaluationById(evaluation._id);
      }

      resp.send(closedPoll.temp);
    } catch (error) {
      if (error._code && error._httpCode) {
        resp.status(error._httpCode).send({ code: error._code });
      } else {
        resp.send({
          msg: 'Not found',
          er: error,
          status: 404
        });
      }
    }
  }

  async create(req: IRequest, res: Response) {
    const input = req.body.evaluation;
    const name = input.name;
    const slug = slugify(name, { lower: true }) + `-${new Date().getTime()}`;
    try {
      const reminders: any[] = [];
      for (const reminder of input.reminders) {
        if (!reminder.value) {
          continue;
        }
        reminders.push({
          dateTime: new Date(reminder.value + 'T' + reminder.hour + ':00Z'),
          status: 'pending',
          customEmail: {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body
          }
        });
      }

      const questionnaire = await QuestionnairesService.findOneBySlug(input.questionnaire);
      if (!questionnaire) {
        throw new BadRequestException('por-fail/questionnaire-not-found');
      }

      const spend = await SpendRequest(req, 'MEDICIÓN DEIP', input.populationCount);
      if (typeof spend === 'string') {
        throw new BadRequestException('suite-fail/create-por/spend-fail');
      }

      const criteria: any = {};
      if (input.selectionType === 'by_demographic') {
        const demographicsDictionary = [
          'academicDegreeIds',
          'additionalDemographic1Ids',
          'additionalDemographic2Ids',
          'chargeIds',
          'countrySelect',
          'departmentIds',
          'headquarterSelect',
          'jobTypeIds',
          'rangeAge',
          'rangeAntiquity'
        ];

        if (input['genderId']) {
          criteria['genderId'] = input['genderId'];
        }
        for (const cut of demographicsDictionary) {
          if (input[cut] && input[cut].length) {
            criteria[cut] = input[cut];
          }
        }
      }
      if (input.selectionType === 'individual') {
        criteria['evaluatedIds'] = input.evaluated;
      }

      const evaluationData = {
        name,
        displayName: input.displayName ? input.displayName : '',
        slug,
        status: 'creating',
        enterpriseId: req.user.enterprise.id,
        enterprise: input.enterprise,
        operations: spend,
        questionnaire,
        additionalQuestions: input.additionalQuestions,
        deliveredAt: new Date(`${input.deliveredAt.value} ${input.deliveredAt.hour}`),
        validUntil: new Date(`${input.validUntil.value} ${input.validUntil.hour}`),
        timeZone: input.timeZone,
        reminders,
        customEmailRelease: {
          subject: input.pollInvitation.subject,
          body: input.pollInvitation.body
        },
        customEmailReminder: {
          subject: input.reminderMail.subject,
          body: input.reminderMail.body
        },
        populationSelectionType: input.selectionType,
        populationSelectionDetails: criteria,
        populationCount: input.populationCount,
        populationLeaders: input.leaders,
        populationCompletedCount: 0,
        additionalSegmentation: input.additionalSegmentation
      };
      const evaluation: any = await EvaluationsService.create(evaluationData);

      await OperationThreadsService.save({
        operation: 'CreateEvaluationPopulation',
        status: 'pending',
        createdAt: new Date(),
        data: {
          _evaluation: evaluation._id,
          evaluationSlug: evaluation.slug,
          enterpriseId: req.user.enterprise.id,
          selectionType: input.selectionType,
          selectionDetails: Object.keys(criteria).length ? criteria : undefined,
          totalReceivers: input.populationCount,
          lang: req.user.lang
        }
      });

      const productService: any = await ProductServiceService.findByName('MEDICIÓN DEIP');
      await RunHttpRequest.suitePost(req, 'activities/create-activity', {
        service: {
          enterpriseId: req.user.enterprise.id,
          _id: evaluation._id
        },
        productService: productService.code
      });

      res.send(evaluation);
    } catch (error) {
      res.send({
        msg: error,
        status: 400
      });
    }
  }

  async update (req: IRequest, res: Response) {
    const input = req.body.evaluation;
    const oldEvaluation: any = await EvaluationsService.findOneBySlug(req.params.slug, '_id slug reminders status enterpriseId operations populationCount populationSelectionType populationSelectionDetails');
    if (!oldEvaluation) {
      throw new BadRequestException('por-fail/not-found');
    }
    if (oldEvaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('por-fail/user-enterprise-not-found');
    }

    // Launch Email
    if (oldEvaluation.customEmailRelease.attachment) {
      if (input.invitationFileFlag === false) {
        input.customEmailRelease = {
          subject: input.pollInvitation.subject,
          body: input.pollInvitation.body
        };
      } else {
        if (input.pollInvitation.file === undefined) {
          input.customEmailRelease = {
            subject: input.pollInvitation.subject,
            body: input.pollInvitation.body,
            attachment: oldEvaluation.customEmailRelease.attachment
          };
        } else {
          input.customEmailRelease = {
            subject: input.pollInvitation.subject,
            body: input.pollInvitation.body
          };
        }
      }
    } else {
      input.customEmailRelease = {
        subject: input.pollInvitation.subject,
        body: input.pollInvitation.body
      };
    }

    // Reminder Email
    if (oldEvaluation.customEmailReminder.attachment) {
      if (input.reminderFileFlag === false) {
        input.customEmailReminder = {
          subject: input.reminderMail.subject,
          body: input.reminderMail.body
        };
      } else {
        if (input.reminderMail.file === undefined) {
          input.customEmailReminder = {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body,
            attachment: oldEvaluation.customEmailReminder.attachment
          };
        } else {
          input.customEmailReminder = {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body
          };
        }
      }
    } else {
      input.customEmailReminder = {
        subject: input.reminderMail.subject,
        body: input.reminderMail.body
      };
    }

    const evaluation: any = {
      name: input.name,
      displayName: input.displayName ? input.displayName : '',
      customEmailReminder: input.customEmailReminder,
      reminders: [],
      populationSelectionDetails: oldEvaluation.populationSelectionDetails
    };

    if (oldEvaluation.status === 'pending') {
      const questionnaire = await QuestionnairesService.findOneBySlug(input.questionnaire);
      if (!questionnaire) {
        throw new BadRequestException('por-fail/questionnaire-not-found');
      }
      evaluation.questionnaire = questionnaire;
      evaluation.timeZone = input.timeZone;
      evaluation.deliveredAt = new Date(`${input.deliveredAt.value} ${input.deliveredAt.hour}`);
      evaluation.customEmailRelease = input.customEmailRelease;
      evaluation.additionalSegmentation = input.additionalSegmentation;
    }

    evaluation.populationLeaders = input.leaders;
    evaluation.validUntil = new Date(`${input.validUntil.value} ${input.validUntil.hour}`);

    // Reminders
    if (input.reminders) {
      for (const reminder of input.reminders) {
        const rem: any = {
          dateTime: undefined,
          status: '',
          customEmail: {
            subject: '',
            body: ''
          }
        };

        if (reminder.value !== '') {
          rem.dateTime = new Date(reminder.value + 'T' + reminder.hour + ':00Z');
          rem.status = 'pending';
          rem.customEmail = {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body
          };

          evaluation.reminders.push(rem);
        }
      }
    }

    // Check for population changes (Only additions allowed)
    if (oldEvaluation.populationCount < input.evaluated.length) {
      const oldEvaluatedIds = await EvaluatedService.getByEvaluationRef(oldEvaluation._id, 'indEmpEntId');
      const newEvaluatedIds = input.evaluated.filter(inc => !oldEvaluatedIds.map(x => x.indEmpEntId).includes(inc));

      if (newEvaluatedIds.length) {
        const newPopulationCount = oldEvaluation.populationCount + newEvaluatedIds.length;
        const addedPopulationCount = newPopulationCount - oldEvaluation.populationCount;
        if (addedPopulationCount > 0) {
          const spend = await SpendRequest(req, 'MEDICIÓN DEIP', addedPopulationCount);
          if (typeof spend === 'string') {
            throw new BadRequestException('suite-fail/edit-por/spend-fail');
          }
          spend.unshift(...oldEvaluation.operations);
          evaluation.operations = spend;
        }

        evaluation.status = oldEvaluation.status === 'pending' ? 'editing' : oldEvaluation.status;
        evaluation.populationCount = newPopulationCount;

        // Create population editing thread
        await OperationThreadsService.save({
          operation: 'EditEvaluationPopulation',
          status: 'pending',
          createdAt: new Date(),
          data: {
            _evaluation: oldEvaluation._id,
            evaluationStatus: oldEvaluation.status,
            enterpriseId: req.user.enterprise.id,
            selectionType: oldEvaluation.populationSelectionType,
            included: newEvaluatedIds,
            lang: req.user.lang
          }
        });
      }
    }

    await EvaluationsService.updateBySlug(req.params.slug, evaluation);

    res.send(oldEvaluation);
  }

  async getParticipantsByPoll(req: IRequest, res: Response) {
    const evaluation: any = await EvaluationsService.findById(req.params.pollId, 'enterpriseId');
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }

    const completedPolls = await EvaluatedService.getCompletedDemographicsByEvaluation(evaluation._id);
    res.send(completedPolls);
  }

  async getCountEvaluatedsByTeam(req: IRequest, res: Response) {
    const evaluation: any = await EvaluationsService.findOneBySlug(req.params.slug, 'enterpriseId populationCount');
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    res.send({ count: evaluation.populationCount });
  }

  async getOneToEdit(req: IRequest, res: Response) {
    const evaluation: any = await EvaluationsService.findOneBySlug(req.params.slug);
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    const activePolls = await EvaluatedService.getByEvaluationRefAndStatus(evaluation._id, ['in_progress', 'completed'], 'indEmpEntId');

    res.send({
      evaluation,
      activePolls: activePolls.map(x => x.indEmpEntId)
    });
  }

  async getOneToShow(req: IRequest, res: Response) {
    const evaluation: any = await EvaluationsService.findOneBySlug(req.params.slug, 'name displayName slug status timeZone deliveredAt validUntil reminders enterpriseId populationCount populationCompletedCount');
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    // evaluation.evaluated = await EvaluatedService.getByEvaluationRef(evaluation._id, 'status employee');
    res.send(evaluation);
  }

  async getOne(req: Request, res: Response) {
    res.send(await EvaluationsService.findOneBySlug(req.params.slug));
  }

  async findByTokenId(req: Request, resp: Response) {
    try {
      const evaluated = await EvaluatedService.getOneByToken(req.params.tokenId);
      if (!evaluated) {
        resp.send({
          executed: false,
          msg: 'Evaluation not found'
        });
      } else {
        const evaluation: any = await EvaluationsService.findById(evaluated.evaluationRef as any);
        if (!evaluation) {
          resp.send({
            executed: false,
            msg: 'Evaluation not found'
          });
        } else {
          const questionsTypes: any = await QuestionnairesService.getQuestionsType();
          resp.send({
            executed: true,
            evaluated,
            evaluation,
            questionsTypes,
            isLeader: evaluation.populationLeaders.includes(evaluated.indEmpEntId)
          });
        }
      }
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async findById(req: IRequest, resp: Response) {
    try {
      const evaluation: any = await EvaluationsService.findById(req.params.id);
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }

      const response = await RunHttpRequest.suiteGet(req, 'enterprises/get-base64-logo');
      if (response.success) {
        evaluation.enterprise.logo = response.res.logo;
      }

      resp.send(evaluation);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async generateOrganizationalReport(req: IRequest, resp: Response) {
    try {
      const evaluation: any = await EvaluationsService.findById(req.params.id, 'name displayName questionnaire status enterpriseId enterprise deliveredAt validUntil populationLeaders');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      if (evaluation.status !== 'completed') {
        throw new BadRequestException('evaluation-not-completed');
      }

      const answeredCount: number = await EvaluatedService.countCompletedByEvaluationRef(evaluation._id);
      if (!answeredCount) {
        throw new BadRequestException('evaluation-no-answers');
      }
      const answeredLeadersCount: number = await EvaluatedService.countCompletedByEvaluationRefInIds(evaluation._id, evaluation.populationLeaders);

      await OperationThreadsService.save({
        operation: 'DownloadReport',
        status: 'pending',
        createdAt: new Date(),
        data: {
          _evaluation: evaluation._id,
          evaluationSlug: evaluation.slug,
          enterpriseId: evaluation.enterpriseId,
          type: 'organizational',
          answeredCount,
          answeredLeadersCount
        }
      });

      resp.send({ _id: evaluation._id});
    } catch (error) {
      if (error._code && error._httpCode) {
        resp.status(error._httpCode).send({ code: error._code });
      } else {
        resp.send({
          msg: 'Not found',
          er: error,
          status: 404
        });
      }
    }
  }

  async generateDemographicReport(req: IRequest, resp: Response) {
    try {
      const evaluation: any = await EvaluationsService.findById(req.params.id, 'name displayName questionnaire status enterpriseId enterprise deliveredAt validUntil populationCompletedCount');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      if (evaluation.status !== 'completed') {
        throw new BadRequestException('evaluation-not-completed');
      }

      const demographicIds = {
        academicDegrees: 'academicDegreeId',
        additionalDemographics1: 'additionalDemographic1Id',
        additionalDemographics2: 'additionalDemographic2Id',
        charges: 'chargeId',
        countries: 'countryId',
        departments: 'departmentId',
        headquarters: 'headquarterId',
        jobTypes: 'jobTypeId'
      };

      const calcDates = (rng1, rng2) => {
        const dateOne = new Date();
        const dateTwo = new Date();
        dateOne.setHours(0, 0, 0, 0);
        dateTwo.setHours(0, 0, 0, 0);
        dateOne.setMonth(dateOne.getMonth() - rng1 * 12);
        dateTwo.setMonth(dateTwo.getMonth() - rng2 * 12);

        return { dateOne, dateTwo };
      };

      const filters: any = {
        $and: []
      };
      const criteria = req.body.criteria;
      for (const key of Object.keys(criteria)) {
        const demoFilters: any = {};
        switch (key) {
          case 'age':
            const ageDates = calcDates(criteria[key][0], criteria[key][1]);
            demoFilters['employee.employeeEnterprise.birthdate'] = {
              $gte: ageDates.dateTwo.toISOString().slice(0, 10),
              $lt: ageDates.dateOne.toISOString().slice(0, 10)
            };
            break;
          case 'antiquity':
            const antiquityDates = calcDates(criteria[key][0], criteria[key][1]);
            demoFilters['employee.employeeEnterprise.admission'] = {
              $gte: antiquityDates.dateTwo.toISOString().slice(0, 10),
              $lt: antiquityDates.dateOne.toISOString().slice(0, 10)
            };
            break;
          case 'genders':
            demoFilters['employee.employeeEnterprise.genderId'] = { $in: [criteria[key]] };
            break;
          default:
            if (!key.startsWith('segmentation')) {
              demoFilters[`employee.employeeEnterprise.${demographicIds[key]}`] = { $in: criteria[key] };
            } else {
              // Filter by Additional Segmentation
              const segmentationId = parseInt(key.replace(/[^0-9]/g, ''));
              demoFilters['temp.segmentation.segmentationId'] = { $in: [segmentationId] };
              demoFilters['temp.segmentation.detailId'] = { $in: criteria[key] };
            }
            break;
        }
        filters.$and.push(demoFilters);
      }

      const filteredAnswersCount = await EvaluatedService.countByEvaluationIdAndFilterItems(
        evaluation._id,
        filters
      );
      if (!filteredAnswersCount) {
        throw new BadRequestException('evaluation-no-answers');
      }

      const spend = await SpendRequest(req, 'REPORTE DEIP POR POBLACION', 1);
      if (typeof spend === 'string') {
        throw new BadRequestException('suite-fail/evaluation/spend-fail');
      }

      const productService: any = await ProductServiceService.findByName('REPORTE DEIP POR POBLACION');
      await RunHttpRequest.suitePost(req, 'activities/create-activity', {
        service: {
          enterpriseId: req.user.enterprise.id,
          _id: evaluation._id
        },
        productService: productService.code
      });

      const filteredLeadersAnswersCount: number = await EvaluatedService.countCompletedByEvaluationRefInIdsAndFilterItems(
        evaluation._id,
        filters,
        evaluation.populationLeaders
      );

      const usr: any = {
        ...req.user,
        token: req.header('Authorization')!.replace('Bearer ', ''),
      };

      await OperationThreadsService.save({
        operation: 'DownloadReport',
        status: 'pending',
        createdAt: new Date(),
        data: {
          user: usr,
          _evaluation: evaluation._id,
          evaluationSlug: evaluation.slug,
          operations: spend,
          enterpriseId: evaluation.enterpriseId,
          type: 'by_demographic',
          answeredCount: evaluation.populationCompletedCount,
          answeredLeadersCount: filteredLeadersAnswersCount,
          filteredAnswersCount,
          criteria: req.body.criteria
        }
      });

      resp.send({ _id: evaluation._id});
    } catch (error) {
      if (error._code && error._httpCode) {
        resp.status(error._httpCode).send({ code: error._code });
      } else {
        resp.send({
          msg: 'Not found',
          er: error,
          status: 404
        });
      }
    }
  }

  async currentThreads(req: IRequest, resp: Response) {
    try {
      const evaluation: any = await EvaluationsService.findById(req.params.id, '_id enterpriseId');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      resp.send(await OperationThreadsService.findDownloadReportsByPollId(evaluation._id, '_id status data.type data.progress data.criteria'));
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async openThreadReport(req: IRequest, resp: Response) {
    try {
      const evaluation: any = await EvaluationsService.findById(req.body.id, 'status enterpriseId');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      } else if (evaluation.status !== 'completed') {
        throw new BadRequestException('evaluation-status-not-found');
      }

      const thread = await OperationThreadsService.findOneDownloadReportById(req.params.id);
      if (!thread) {
        throw new BadRequestException('evaluation-thread-not-found');
      }

      resp.send(thread);
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async getAdditionalQuestionAnswers(req: Request, res: Response) {
    const answers = await EvaluatedService.findAdditionalByQuestion(req.params.pollId, req.body.question);
    res.send({ answers });
  }

  async checkBalance(req: IRequest, resp: Response) {
    const dictionary = {
      'individual': 'MEDICIÓN DEIP',
      'by_population': 'REPORTE DEIP POR POBLACION'
    };

    try {
      const balance: any = await RunHttpRequest.suiteGet(req, 'token-account-detail/balance');
      if (!balance.success) {
        throw new BadRequestException(`suite-fail/${balance.error!.msg}`);
      }
      const productServiceName = dictionary[req.params.key];
      const productService: any = await ProductServiceService.findByName(productServiceName);
      const productServiceSuite: any = await RunHttpRequest.suiteGet(req, `product-services/c/${productService.code}`);
      if (!productServiceSuite.success) {
        throw new BadRequestException(`suite-fail/${productServiceSuite.error!.msg}`);
      }

      resp.send({
        balance: balance.res.balance,
        productService: productServiceSuite.res.tokenPrice
      });
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404,
        error
      });
    }
  }

  async generateTemplate(req: Request, res: Response) {
    const headers = ['email'];

    const employeesRequest = await RunHttpRequest.suiteGet(req, 'employees/participants-list');
    if (!employeesRequest.success) {
      throw new BadRequestException('suite-fail/generateTemplate/employee-list');
    }

    const examples: any = [];
    for (const enterpriseEmployee of employeesRequest.res.items) {
      if (req.body.filters && req.body.filters.length) {
        if (req.body.filters.indexOf(enterpriseEmployee.id) === -1) {
          continue;
        }
      }
      if (enterpriseEmployee.employee.email) {
        examples.push([enterpriseEmployee.employee.email]);
      }
    }
    const unparsed = Papa.unparse({ fields: headers, data: examples});
    res.send({ template: unparsed });
  }

  async massiveUpload(req: IRequest, res: Response) {
    const employeesRequest = await RunHttpRequest.suiteGet(req, 'employees/participants-list');
    if (!employeesRequest.success) {
      throw new BadRequestException('suite-fail/generateTemplate/employee-list');
    }

    const file = req.file;
    const employees = employeesRequest.res.items;

    let parsed;
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (extension !== 'csv') {
      const workbook = xlsx.readFile(file.path);
      const sheetNameList = workbook.SheetNames;
      const auxFile = { data: xlsx.utils.sheet_to_csv(workbook.Sheets[sheetNameList[0]]) };
      parsed = Papa.parse( auxFile.data, { header: true });
    } else {
      const asyncReadFile = promisify(fs.readFile);
      const csvFile = await asyncReadFile(file.path, 'utf8');
      parsed = Papa.parse( csvFile, { header: true });
    }

    fs.unlink(file.path, (err) => {
      if (err) { throw err; }
    });

    const employeesUploaded = parsed.data;
    const evaluated: any = [];
    const errors: any = {
      evaluatedNotFound: [], // evaluado si no está recorrer hasta el siguiente evaluado y dar advertencia de que ese evaluado no existe (listo)
      evaluatedDuplicated: [], // Evaluador: ignorar y recorrer hasta el siguiente evaluador, solo se toma una vez y dar advertencia (listo)
    };

    for (const employeeUploaded of employeesUploaded) { // Recorre Empleados cargados en csv
      if (employeeUploaded.email) { // Si el empleado cargado no posee tipo entonces es un evaluado
        const employee = employees.find((emp) => { // Se busca los datos generales del empledo en base al correo
          return emp.employee.email === employeeUploaded.email;
        });
        if (!employee) { // Si no se consigue se agrega el email a los evaluados no conseguidos se enciende la bandera para continuar hasta el siguiente evaluado
          errors.evaluatedNotFound.push(employeeUploaded.email);
          continue;
        } else { // Se buscan los datos del nuevo evaluado
          const alreadyEmployee = evaluated.find((emp: any) => { // Se verifica que el evaluado no exista anteriormente como otro evaluado
            return emp.id === employee.id;
          });
          if (alreadyEmployee) { // Si el evaluado existe como otro evaluado se salta el proceso de llenado y se activa la bandera para continuar al siguiente evaluado
            errors.evaluatedDuplicated.push(employee);
            continue;
          }
          evaluated.push(employee);
        }
      }
    }

    res.send({ evaluated, errors });
  }

  async sendReminders (req: IRequest, res: Response) {
    try {
      const evaluation: any = await EvaluationsService.findOneBySlug(req.body.slug);

      const population = await EvaluatedService.getByEvaluationRefAndStatus(
        evaluation._id,
        ['pending', 'in_progress'],
        'token employee.email employee.employeeEnterprise.firstName employee.employeeEnterprise.lastName'
      );

      const endPopulation: any = [];
      population.forEach((emp) => {
        endPopulation.push({
          token: emp.token,
          email: emp.employee.email,
          name: `${emp.employee.employeeEnterprise.firstName} ${emp.employee.employeeEnterprise.lastName}`
        });
      });

      const suiteRes: SuiteResInterface = await RunHttpRequest.suitePost(undefined, 'emails/create-deip-emails', {
        population: endPopulation,
        customEmailRelease: evaluation.customEmailReminder,
        file: evaluation.customEmailReminder.attachment ? evaluation.customEmailReminder.attachment : ''
      });
      if (suiteRes.error?.status && suiteRes.error?.msg) {
        throw new Error(`Suite Request Failed with status: ${suiteRes.error!.status} by ${suiteRes.error!.msg}`);
      }

      res.send();
    } catch (error) {
      if (error._code && error._httpCode) {
        res.status(error._httpCode).send({ code: error._code });
      } else {
        res.status(404).send({
          msg: 'Not found',
          er: error,
          status: 404
        });
      }
    }
  }

  async acceptDataPolicy (req: IRequest, res: Response) {
    try {
      await EvaluatedService.setPolicyAccepted(req.params.tokenId, req.body.url);
      res.send();
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async close (req: IRequest, res: Response) {
    try {
      const evaluation: any = await EvaluationsService.closeEvaluation(req.params.slug);
      res.send(evaluation);
    } catch (error) {
      res.status(400);
      res.send({ error });
    }
  }
}

export default new EvaluationsController();
