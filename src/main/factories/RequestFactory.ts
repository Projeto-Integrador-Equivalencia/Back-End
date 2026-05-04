import { RequestController } from '../../controllers/RequestController';
import { SequelizeRequestRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeRequestRepository';
import { ActionLogRepository } from '../../infrastructure/database/mongoose/repositories/ActionLogRepository';

import { AddObservationService } from '../../services/request/AddObservationService';
import { CancelRequestService } from '../../services/request/CancelRequestService';
import { CheckDuplicityService } from '../../services/request/CheckDuplicityService';
import { CreateRequestService } from '../../services/request/CreateRequestService';
import { FindAdvisorCourseService } from '../../services/request/FindByAdvisorCourseService';
import { FindByIdService } from '../../services/request/FindByIdService';
import { FindByProtocolService } from '../../services/request/FindByProtocolService';
import { FindByStudentService } from '../../services/request/FindByStudentService';
import { GenerateProtocolService } from '../../services/request/GenerateProtocolService';
import { UpdateStatusService } from '../../services/request/UpdateStatusService';

export class RequestFactory {
  static create(): RequestController {
    const requestRepository = new SequelizeRequestRepository();
    const logRepository = new ActionLogRepository();

    const addObservationService = new AddObservationService(
      requestRepository,
      logRepository,
    );
    const cancelRequestService = new CancelRequestService(requestRepository);
    const checkDuplicityService = new CheckDuplicityService(requestRepository);
    const createRequestService = new CreateRequestService(requestRepository, logRepository);
    const findAdvisorCourseService = new FindAdvisorCourseService(requestRepository);
    const findByIdService = new FindByIdService(requestRepository, logRepository);
    const findByProtocolService = new FindByProtocolService(requestRepository);
    const findByStudentService = new FindByStudentService(requestRepository);
    const generateProtocolService = new GenerateProtocolService(requestRepository);
    const updateStatusService = new UpdateStatusService(requestRepository, logRepository);

    return new RequestController(
      addObservationService,
      cancelRequestService,
      checkDuplicityService,
      createRequestService,
      findAdvisorCourseService,
      findByIdService,
      findByProtocolService,
      findByStudentService,
      generateProtocolService,
      updateStatusService,
    );
  }
}
