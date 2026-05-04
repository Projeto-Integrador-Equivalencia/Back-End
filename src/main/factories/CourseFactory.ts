import { SequelizeCourseRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeCourseRepository';
import { CreateCourseService } from '../../services/course/CreateCourseService';
import { FindCourseByIdService } from '../../services/course/FindByIdService';
import { FindAllCourseService } from '../../services/course/FindAllCourseService';
import { FindByCodeService } from '../../services/course/FindByCodeService';
import { CourseController } from '../../controllers/CourseController';

import { SequelizeAdminRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeAdminRepository';

export const CourseFactory = () => {
  const courseRepository = new SequelizeCourseRepository();
  const adminRepository = new SequelizeAdminRepository();

  const createCourseService = new CreateCourseService(
    courseRepository,
    adminRepository,
  );
  const findCourseByIdService = new FindCourseByIdService(courseRepository);
  const findAllCourseService = new FindAllCourseService(courseRepository);
  const findByCodeService = new FindByCodeService(courseRepository);

  const courseController = new CourseController(
    createCourseService,
    findCourseByIdService,
    findAllCourseService,
    findByCodeService,
  );

  return courseController;
};
