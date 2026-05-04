import { SequelizeStudentRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeStudentRepository';
import { CreateStudentService } from '../../services/student/CreateStudentService';
import { GetStudentByIdService } from '../../services/student/GetStudentByIdService';
import { GetStudentByCpfService } from '../../services/student/GetStudentByCpfService';
import { GetStudentByEmailService } from '../../services/student/GetStudentByEmailService';
import { StudentController } from '../../controllers/StudentController';
import { SequelizeCourseRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeCourseRepository';
import { SequelizeUserRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeUserRepository';

export const StudentFactory = () => {
  //Instancia o repositório do Sequelize
  const studentRepository = new SequelizeStudentRepository();
  const courseRepository = new SequelizeCourseRepository();
  const userRepository = new SequelizeUserRepository();

  //Instancia as Services passando o repositório
  const createStudentService = new CreateStudentService(
    studentRepository,
    userRepository,
    courseRepository,
  );
  const getStudentByIdService = new GetStudentByIdService(studentRepository);
  const getStudentByCpfService = new GetStudentByCpfService(studentRepository);
  const getStudentByEmailService = new GetStudentByEmailService(
    studentRepository,
  );

  //Instancia a Controller passando as instâncias das Services
  const studentController = new StudentController(
    createStudentService,
    getStudentByIdService,
    getStudentByCpfService,
    getStudentByEmailService,
  );

  return studentController;
};
