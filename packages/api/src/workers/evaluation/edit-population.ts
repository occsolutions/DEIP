
import { default as EvaluationService } from '../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../services/evaluated.srvc';
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';

import RunHttpRequest from '../../utils/run-http-request';

class EditPopulation {

  public async checkEditPopulation () {
    const pendingOperationThread = await OperationThreadsService.findByOperationAndStatus(
      'EditEvaluationPopulation',
      'pending'
    );
    if (!pendingOperationThread) {
      return;
    }
    const threadData = pendingOperationThread.data;

    // Get Population's base token
    const generatedToken = await EvaluatedService.getEvaluationBaseToken(threadData._evaluation);
    if (generatedToken && generatedToken.baseToken) {
      const chunkSize = 100;
      const hasIncluded = threadData.included.length > 0;
      const maximumLaps = hasIncluded ? Math.ceil(threadData.included.length / chunkSize) : 1;

      await OperationThreadsService.findOneAndUpdateStatusData(pendingOperationThread._id,
        'in_progress',
        {
          progress: 0,
          lap: 0,
          maxLaps: maximumLaps,
          baseToken: generatedToken.baseToken,
          ...threadData
        }
      );
    } else {
      return await this.saveFailed(pendingOperationThread._id, 'EditingPopulationError1', {
        error: 'baseToken not found'
      });
    }

    return pendingOperationThread._id;
  }

  public async runEditPopulation () {
    const pendingOperationThread = await OperationThreadsService.findByOperationAndStatus(
      'EditEvaluationPopulation',
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

      // Population to be INCLUDED
      let finishedIncluding = false;
      if (threadData.included.length) {
        // Already created Population
        const alreadyExistingPopulation = await EvaluatedService.getByEvaluationRef(threadData._evaluation, 'indEmpEntId');
        const alreadyExistingPopulationIds = alreadyExistingPopulation.map(x => x.indEmpEntId);

        const alreadyIncludedPopulationIds = alreadyExistingPopulationIds
          .filter(inc => threadData.included.includes(inc));

        const alreadyIncludedPopulationCount = alreadyIncludedPopulationIds.length;

        // Get Employees from Suite
        const employees = await RunHttpRequest.suitePost(undefined, suitePath, {
          enterpriseId: threadData.enterpriseId,
          selectionType: threadData.selectionType,
          limit: Math.ceil(threadData.included.length / threadData.maxLaps),
          offset: alreadyIncludedPopulationCount,
          filters: { evaluatedIds: threadData.included }
        });
        if (!employees.success) {
          return await this.saveFailed(pendingOperationThread._id, 'Suite communication', {
            path: suitePath,
            laps: thisLap,
            status: employees.error.status,
            error: employees.error.msg,
          });
        }

        let increases = alreadyIncludedPopulationCount;
        let decreases = threadData.included.length - alreadyIncludedPopulationCount;
        const population = [];
        for (const employee of employees.res) {
          // Skip if employee already exists in population
          if (alreadyExistingPopulationIds.includes(employee.id)) {
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
                  id: employee.id,
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
          return await this.saveFailed(pendingOperationThread._id, 'Mongo EvaluatedService Edit', {
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
        if (thisLap === threadData.maxLaps &&
          (alreadyIncludedPopulationCount + population.length) === threadData.included.length
        ) {
          finishedIncluding = true;
        }
      } else {
        finishedIncluding = true;
      }

      // Population to be EXCLUDED
      let finishedExcluding = false;
      if (threadData.excluded.length && finishedIncluding) {
        const populationToExclude = await EvaluatedService.findBatchByEvaluationRefAndEmployeeEnterpriseIds(
          threadData._evaluation,
          threadData.excluded,
          '_id'
        );
        const populationIdsToExclude = populationToExclude.map(x => x._id);
        let excludedCount = 0;
        if (threadData.evaluationStatus === 'pending') {
          // Delete from collection
          const deletedPopulation = await EvaluatedService.deleteBatch(
            threadData._evaluation,
            populationIdsToExclude
          );
          excludedCount = deletedPopulation['deletedCount'];
        } else {
          // Update status to 'excluded'
          const excludedPopulation = await EvaluatedService.excludeBatch(
            threadData._evaluation,
            populationIdsToExclude
          );
          excludedCount = excludedPopulation.modifiedCount;
        }
        if (threadData.excluded.length === excludedCount) {
          finishedExcluding = true;
        }
      } else {
        finishedExcluding = true;
      }

      // When ALL population has been updated
      if (finishedIncluding && finishedExcluding) {
        try {
          const newEvaluatedCnt = await EvaluatedService.countByEvaluationRef(threadData._evaluation);
          await EvaluationService.updateEvaluatedCount(threadData._evaluation, newEvaluatedCnt);
          await EvaluationService.updateStatus(threadData.evaluationStatus, threadData._evaluation);
          await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThread._id, 'completed');
        } catch (error) {
          return await this.saveFailed(pendingOperationThread._id, 'Mongo EvaluationService Edit', {
            error: error.stack ? error.stack : error.toString()
          });
        }
      }
    } catch (error) {
      return await this.saveFailed(pendingOperationThread._id, 'EditingPopulationError2', {
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

export default new EditPopulation();
