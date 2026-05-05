import { Request, Response } from 'express';
import { AddObservationService } from '../services/request/AddObservationService';
import { CancelRequestService } from '../services/request/CancelRequestService';
import { CheckDuplicityService } from '../services/request/CheckDuplicityService';
import {
  CreateRequestService,
  RequestDTO,
} from '../services/request/CreateRequestService';
import { FindAdvisorCourseService } from '../services/request/FindByAdvisorCourseService';
import { FindByIdService } from '../services/request/FindByIdService';
import { FindByProtocolService } from '../services/request/FindByProtocolService';
import { FindByStudentService } from '../services/request/FindByStudentService';
import { GenerateProtocolService } from '../services/request/GenerateProtocolService';
import { UpdateStatusService } from '../services/request/UpdateStatusService';
import { AssignAdvisorService } from '../services/request/AssignAdvisorService';

export class RequestController {
  constructor(
    private addObservationService: AddObservationService,
    private cancelRequestService: CancelRequestService,
    private checkDuplicityService: CheckDuplicityService,
    private createRequestService: CreateRequestService,
    private findAdvisorCourseService: FindAdvisorCourseService,
    private findByIdService: FindByIdService,
    private findByProtocolService: FindByProtocolService,
    private findByStudentService: FindByStudentService,
    private generateProtocolService: GenerateProtocolService,
    private updateStatusService: UpdateStatusService,
    private assignAdvisorService: AssignAdvisorService,
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          message: 'Ao menos um documento deve ser enviado.',
        });
      }

      const { studentId, equivalencyId, advisorId, experiences } = req.body;

      const logInfo = {
        author: req.user!.name,
        authorRole: req.user!.role,
      };

      const requestDTO: RequestDTO = {
        studentId: Number(studentId),
        equivalencyId: Number(equivalencyId),
        advisorId: req.body.advisorId ? Number(advisorId) : undefined,

        Professional_Experience:
          typeof req.body.experiences === 'string'
            ? JSON.parse(req.body.experiences)
            : experiences,
      };

      const result = await this.createRequestService.execute(
        requestDTO,
        logInfo,
        files,
      );

      return res.status(201).json({
        status: 'Sucess',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro inesperado ao processar Solicitação.',
      });
    }
  }

  async addObservation(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { observation } = req.body;

      const logInfo = {
        author: req.user!.name,
        authorRole: req.user!.role,
      };

      await this.addObservationService.execute(
        Number(id),
        logInfo,
        observation,
      );

      return res.status(200).json({
        message: 'Observação adicionado com sucesso!',
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.cancelRequestService.execute(Number(id));

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async checkDuplicity(req: Request, res: Response): Promise<Response> {
    try {
      const { studentId, equivalencyId } = req.query;

      const checkDuplicity = await this.checkDuplicityService.execute(
        Number(studentId),
        Number(equivalencyId),
      );

      if (checkDuplicity) {
        return res.status(409).json({
          message: 'Aluno já possui solicitação similar!',
        });
      }

      return res.status(200).json({
        status: 'Success!',
        data: checkDuplicity,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findByAdvisorCourse(req: Request, res: Response): Promise<Response> {
    try {
      const { id, courseId } = req.params;

      const foundRequests = await this.findAdvisorCourseService.execute(
        Number(id),
        Number(courseId),
      );

      if (!foundRequests) {
        return res.status(404).json({
          message: 'Vínculo não encontrado!',
        });
      }

      return res.status(200).json({
        status: 'Success!',
        data: foundRequests,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const foundId = await this.findByIdService.execute(Number(id));

      if (!foundId) {
        return res.status(404).json({
          message: 'Solicitação não encontrada!',
        });
      }

      return res.status(200).json({
        status: 'Success',
        data: foundId,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findByProtocol(req: Request, res: Response): Promise<Response> {
    try {
      const { protocol } = req.body;

      const foundProtocol = await this.findByProtocolService.execute(
        String(protocol),
      );

      if (!foundProtocol) {
        return res.status(404).json({
          message: 'Solicitação não encontrada!',
        });
      }

      return res.status(200).json({
        status: 'Success!',
        data: foundProtocol,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findByStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { studentId } = req.params;

      if (!studentId) {
        return res.status(400).json({
          message: 'O ID do aluno é obrigatório.',
        });
      }

      const foundRequests = await this.findByStudentService.execute(
        Number(studentId),
      );

      return res.status(200).json({
        status: 'Success!',
        data: foundRequests,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro ao buscar solicitações do aluno.',
      });
    }
  }

  async generateProtocol(req: Request, res: Response): Promise<Response> {
    try {
      await this.generateProtocolService.execute();

      return res.status(200).json({
        status: 'Success!',
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async updatedStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const logInfo = {
        author: req.user!.name,
        authorRole: req.user!.role,
      };

      await this.updateStatusService.execute(Number(id), logInfo, status);

      return res.status(200).json({
        status: 'Success!',
        data: status,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async assignAdvisor(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ error: 'ID da solicitação é obrigatório.' });
      }

      const advisorId = req.user!.id;

      if (!advisorId) {
        return res.status(404).json({ error: 'Orientador não encontrado.' });
      }

      const logInfo = {
        author: req.user!.name,
        authorRole: req.user!.role,
      };

      await this.assignAdvisorService.execute(advisorId, Number(id), logInfo);

      return res.status(200).json({
        status: 'Success',
        message: 'Solicitação vinculada!',
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}
