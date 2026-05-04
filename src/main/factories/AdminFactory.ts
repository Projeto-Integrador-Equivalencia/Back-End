import { SequelizeAdminRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeAdminRepository';
import { CreateAdminService } from '../../services/admin/CreateAdminService';
import { GetAdminByIdService } from '../../services/admin/GetAdminByIdService';
import { GetAdminByCpfService } from '../../services/admin/GetAdminByCpfService';
import { GetAdminByEmailService } from '../../services/admin/GetAdminByEmailService';
import { AdminController } from '../../controllers/AdminController';
import { SequelizeUserRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeUserRepository';

export const AdminFactory = () => {
  const adminRepository = new SequelizeAdminRepository();
  const userRepository = new SequelizeUserRepository();

  const createAdminService = new CreateAdminService(
    adminRepository,
    userRepository,
  );
  const getAdminByIdService = new GetAdminByIdService(adminRepository);
  const getAdminByCpfService = new GetAdminByCpfService(adminRepository);
  const getAdminByEmailService = new GetAdminByEmailService(adminRepository);

  const adminController = new AdminController(
    createAdminService,
    getAdminByIdService,
    getAdminByCpfService,
    getAdminByEmailService,
  );

  return adminController;
};
