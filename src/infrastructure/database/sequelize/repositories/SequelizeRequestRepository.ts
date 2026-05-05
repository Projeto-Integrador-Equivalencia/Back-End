import { Request, Status } from '../../../../domain/entities/Request';
import { IRequestRepository } from '../../../../domain/repositories/IRequestRepository';
import RequestModel from '../models/RequestModel';
import ProfessionalExperienceModel from '../models/ProfessionalExperienceModel';
import DocumentModel from '../models/DocumentModel';

import AdvisorCourseModel from '../models/AdvisorCourseModel';
import StudentModel from '../models/StudentModel';

export class SequelizeRequestRepository implements IRequestRepository {
  async create(request: Request): Promise<Request> {
    const t = await RequestModel.sequelize!.transaction();
    try {
      const createdRequest = await RequestModel.create(request.props as any, {
        include: [
          { model: DocumentModel, as: 'Documents' },
          { model: ProfessionalExperienceModel, as: 'Professional_Experience' },
        ],
        transaction: t,
      });
      await t.commit();

      return new Request(createdRequest.get({ plain: true }) as any);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateStatus(id: number, status: Status): Promise<void> {
    await RequestModel.update({ status }, { where: { id } });
  }

  async addObservation(id: number, observation: string): Promise<void> {
    await RequestModel.update({ observation }, { where: { id } });
  }

  async cancelRequest(id: number): Promise<void> {
    await RequestModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Request | null> {
    const foundRequest = await RequestModel.findByPk(id, {
      include: ['Documents', 'Professional_Experience'],
    });

    if (!foundRequest) return null;

    return new Request(foundRequest.get({ plain: true }) as any);
  }

  async findByStudent(studentId: number): Promise<Request[]> {
    const requests = await RequestModel.findAll({
      where: { studentId },
      include: [
        { model: DocumentModel, as: 'Documents' },
        { model: ProfessionalExperienceModel, as: 'Professional_Experience' },
      ],
    });

    return requests.map((req) => new Request(req.toJSON() as any));
  }

  async findByAdvisorCourses(advisorId: number): Promise<Request[]> {
    const advisorCursos = await AdvisorCourseModel.findAll({
      where: { advisorId },
      attributes: ['courseId'],
    });

    const idsDosCursos = advisorCursos.map((vc) => vc.courseId);
    if (idsDosCursos.length === 0) return [];

    const requests = await RequestModel.findAll({
      include: [
        {
          model: StudentModel,
          as: 'student',
          where: { courseId: idsDosCursos },
          required: true,
        },
        { model: DocumentModel, as: 'Documents' },
        { model: ProfessionalExperienceModel, as: 'Professional_Experience' },
      ],
    });

    return requests.map((req) => new Request(req.toJSON() as any));
  }

  async findByProtocol(protocol: string): Promise<Request | null> {
    const request = await RequestModel.findOne({
      where: { protocol },

      include: ['Documents', 'Professional_Experience'],
    });

    if (!request) return null;

    const rawData = request.get({ plain: true }) as any;

    return new Request(rawData);
  }

  async checkDuplicity(
    studentId: number,
    equivalencyId: number,
  ): Promise<boolean> {
    const duplicity = await RequestModel.findOne({
      where: { studentId, equivalencyId },
    });

    return !!duplicity;
  }

  async generateProtocol(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await RequestModel.count();

    return `REQ-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async assignAdvisor(advisorId: number, requestId: number): Promise<void> {
    const request = await RequestModel.findByPk(requestId);

    if (!request) {
      throw new Error('Solicitação não encontrada.');
    }

    await request.update({ advisorId: advisorId });
  }
}
