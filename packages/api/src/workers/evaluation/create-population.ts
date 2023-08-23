
import { default as EvaluationService } from '../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../services/evaluated.srvc';
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';

import RunHttpRequest from '../../utils/run-http-request';
import TokenUtils from '../../utils/token-utils';

class CreatePopulation {

  public async checkCreatePopulation () {
    const pendingOperationThread = await OperationThreadsService.findByOperationAndStatus(
      'CreateEvaluationPopulation',
      'pending'
    );
    if (!pendingOperationThread) {
      return;
    }
    const threadData = pendingOperationThread.data;

    // Population's base token
    let generatedToken = await TokenUtils.hash(`evaluated${threadData.slug}${new Date().toDateString()}`);
    let existTokenId;
    do {
      generatedToken = TokenUtils.sanitize(generatedToken);
      existTokenId = await EvaluatedService.getOneByToken(generatedToken, '_id');
    } while (existTokenId);

    const chunkSize = 100;
    const maximumLaps = Math.ceil(threadData.totalReceivers / chunkSize);

    await OperationThreadsService.findOneAndUpdateStatusData(pendingOperationThread._id,
      'in_progress',
      {
        progress: 0,
        lap: 0,
        maxLaps: maximumLaps,
        baseToken: generatedToken,
        ...threadData
      }
    );

    return pendingOperationThread._id;
  }

  public async runCreatePopulation () {
    const pendingOperationThread = await OperationThreadsService.findByOperationAndStatus(
      'CreateEvaluationPopulation',
      'in_progress'
    );
    if (!pendingOperationThread) {
      return;
    }

    await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThread._id, 'running');

    try {
      const suitePath = 'employees/chunks-by-criteria';
      const threadData = pendingOperationThread.data;
      const thisLap = threadData.lap + 1;
      delete threadData.lap;
      delete threadData.progress;

      // Already created Population
      const alreadyCreatedPopulation = await EvaluatedService.getByEvaluationRef(threadData._evaluation, 'indEmpEntId');
      const alreadyCreatedPopulationIds = alreadyCreatedPopulation.map(x => x.indEmpEntId);
      const alreadyCreatedPopulationCount = alreadyCreatedPopulationIds.length;

      // Get Employees from Suite
      const employees = await RunHttpRequest.suitePost(undefined, suitePath, {
        enterpriseId: threadData.enterpriseId,
        selectionType: threadData.selectionType,
        limit: Math.ceil(threadData.totalReceivers / threadData.maxLaps),
        offset: alreadyCreatedPopulationCount,
        filters: threadData.selectionDetails
      });
      if (!employees.success) {
        return await this.saveFailed(pendingOperationThread._id, 'Suite communication', {
          path: suitePath,
          laps: thisLap,
          status: employees.error.status,
          error: employees.error.msg,
        });
      }

      let increases = alreadyCreatedPopulationCount;
      let decreases = threadData.totalReceivers - alreadyCreatedPopulationCount;
      const population = [];
      for (const employee of employees.res) {
        // Skip if employee already exists in population
        if (alreadyCreatedPopulationIds.includes(employee.id)) {
          continue;
        }
        if (employee.active) {
          const token: string = threadData.baseToken.concat(String(increases++))
            .concat(String(employee.enterpriseId))
            .concat(String(employee.id))
            .concat(String(decreases--));
          population.push({
            evaluationRef: threadData._evaluation,
            baseToken: threadData.baseToken,
            token,
            status: 'pending',
            indEmpEntId: employee.id,
            employee: {
              id: employee.employee.id,
              userId: employee.employee.userId,
              email: employee.employee.email,
              employeeEnterprise: {
                employeeId: employee.employeeId,
                countryId: employee.countryId,
                headquarterId: employee.headquarterId,
                departmentId: employee.departmentId,
                enterpriseId: employee.enterpriseId,
                genderId: employee.genderId,
                jobTypeId: employee.jobTypeId,
                academicDegreeId: employee.academicDegreeId,
                chargeId: employee.chargeId,
                identifyTypeId: employee.identifyTypeId,
                additionalDemographic1Id: employee.additionalDemographic1Id,
                additionalDemographic2Id: employee.additionalDemographic2Id,
                id: employee.id,
                identifyDocument: employee.identifyDocument,
                firstName: employee.firstName,
                lastName: employee.lastName,
                phoneNumber: employee.phoneNumber,
                active: employee.active,
                birthdate: employee.birthdate,
                admission: employee.admission,
                deletedAt: employee.deletedAt
              }
            }
          });
        }
      }

      // Save Population
      try {
        await EvaluatedService.save(population);
      } catch (error) {
        return await this.saveFailed(pendingOperationThread._id, 'Mongo EvaluatedService', {
          error: error.stack ? error.stack : error.toString()
        });
      }

      await OperationThreadsService.findOneAndUpdateStatusData(pendingOperationThread._id,
        'in_progress',
        {
          progress: (thisLap / threadData.maxLaps) * 100,
          lap: thisLap,
          ...pendingOperationThread.data
        }
      );

      // When all population has been created
      if (thisLap === threadData.maxLaps &&
        (alreadyCreatedPopulationCount + population.length) === threadData.totalReceivers
      ) {
        try {
          await EvaluationService.updateStatus('pending', threadData._evaluation);
          await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThread._id, 'completed');
        } catch (error) {
          return await this.saveFailed(pendingOperationThread._id, 'Mongo EvaluationService', {
            error: error.stack ? error.stack : error.toString()
          });
        }
      }
    } catch (error) {
      return await this.saveFailed(pendingOperationThread._id, 'CreatingPopulationError', {
        error: error.stack ? error.stack : error.toString()
      });
    }
    return pendingOperationThread._id;
  }

  private async saveFailed (_id: string, type: string, data: {[key: string]: any}) {
    await OperationThreadsService.findOneAndSaveFail(_id, { type, ...data});
    return `failed by: ${type}`;
  }
}

export default new CreatePopulation();
