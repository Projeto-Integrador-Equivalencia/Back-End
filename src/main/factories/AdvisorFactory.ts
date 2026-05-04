import { SequelizeAdvisorRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeAdvisorRepository';
import { CreateAdvisorService } from '../../services/advisor/CreateAdvisorService';
import { GetAdvisorByIdService } from '../../services/advisor/GetAdvisorByIdService';
import { GetAdvisorByCpfService } from '../../services/advisor/GetAdvisorByCpfService';
import { GetAdvisorByEmailService } from '../../services/advisor/GetAdvisorByEmailService';
import { AdvisorController } from '../../controllers/AdvisorController';

import { SequelizeUserRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeUserRepository';

export const AdvisorFactory = () => {
  const advisorRepository = new SequelizeAdvisorRepository();
  const userRepository = new SequelizeUserRepository();

  const createAdvisorService = new CreateAdvisorService(
    advisorRepository,
    userRepository,
  );
  const getAdvisorByIdService = new GetAdvisorByIdService(advisorRepository);
  const getAdvisorByCpfService = new GetAdvisorByCpfService(advisorRepository);
  const getAdvisorByEmailService = new GetAdvisorByEmailService(
    advisorRepository,
  );

  const advisorController = new AdvisorController(
    createAdvisorService,
    getAdvisorByIdService,
    getAdvisorByCpfService,
    getAdvisorByEmailService,
  );
  return advisorController;
};
