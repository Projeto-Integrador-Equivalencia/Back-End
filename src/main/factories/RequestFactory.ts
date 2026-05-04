import { RequestController } from '../../controllers/RequestController';
import { SequelizeRequestRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeRequestRepository';
import { SequelizeStudentRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeStudentRepository';
import { SequelizeAdvisorRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeAdvisorRepository';
import { ActionLogRepository } from '../../infrastructure/database/mongoose/repositories/ActionLogRepository';
import { EtheralMailProvider } from '../../infrastructure/mail/EtheralMailProvider';

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
    const mailProvider = new EtheralMailProvider();
    const studentRepository = new SequelizeStudentRepository();
    const advisorRepository = new SequelizeAdvisorRepository();

    const addObservationService = new AddObservationService(
      requestRepository,
      logRepository,
      mailProvider,
      studentRepository,
      advisorRepository,
    );
    const cancelRequestService = new CancelRequestService(requestRepository);
    const checkDuplicityService = new CheckDuplicityService(requestRepository);
    const createRequestService = new CreateRequestService(
      requestRepository,
      logRepository,
      mailProvider,
      studentRepository,
    );
    const findAdvisorCourseService = new FindAdvisorCourseService(
      requestRepository,
    );
    const findByIdService = new FindByIdService(
      requestRepository,
      logRepository,
    );
    const findByProtocolService = new FindByProtocolService(requestRepository);
    const findByStudentService = new FindByStudentService(requestRepository);
    const generateProtocolService = new GenerateProtocolService(
      requestRepository,
    );
    const updateStatusService = new UpdateStatusService(
      requestRepository,
      logRepository,
      mailProvider,
      studentRepository,
    );

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
