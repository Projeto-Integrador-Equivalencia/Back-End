import { IRequestRepository } from '../../domain/repositories/IRequestRepository';
import { IAdvisorRepository } from '../../domain/repositories/IAdvisorRepository';

import { ActionLog } from '../../domain/entities/ActionLog';
import { IActionLogRepository } from '../../domain/repositories/IActionLogRepository';

import { IMailProvider } from '../../domain/providers/IMailProvider';

import { IStudentRepository } from '../../domain/repositories/IStudentRepository';

export class AssignAdvisorService {
  constructor(
    private requestRepo: IRequestRepository,
    private advisorRepo: IAdvisorRepository,
    private actionLogRepo: IActionLogRepository,
    private mailProvider: IMailProvider,
    private studentRepo: IStudentRepository,
  ) {}

  async execute(
    advisorId: number,
    requestId: number,
    logInfo: { author: string; authorRole: string },
  ) {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new Error('Solicitação não encontrada!');
    }

    const advisor = await this.advisorRepo.findById(advisorId);
    if (!advisor) {
      throw new Error('Orientador não encontrado!');
    }

    if (
      request.props.advisorId &&
      request.props.advisorId !== advisor.props.id
    ) {
      throw new Error(
        'Esta Solicitação já está sendo atendida por um outro orientador.',
      );
    }

    await this.requestRepo.assignAdvisor(advisorId, requestId);

    const newLog = new ActionLog({
      requestId: Number(request.props.id),
      action: `Solicitação vinculada a um Orientador: ${advisor.props.name}`,
      author: logInfo.author,
      authorRole: logInfo.authorRole,
      createdAt: new Date(),
    });

    await this.actionLogRepo.save(newLog);

    const student = await this.studentRepo.findById(
      Number(request.props.studentId),
    );
    if (!student) {
      throw new Error('Estudante não encontrado!');
    }

    const requestUrl = `http://localhost:3000/requests/${request.props.id}`;

    await this.mailProvider.sendMail({
      to: student.props.email,
      subject: 'Solicitação vinculada a um orientador.',
      body: `<p>Olá ${student.props.name}!</p>
             <p>Sua solicitação de protocolo <strong>${request.props.protocol}</strong> agora está sendo acompanhada pelo Orientador <strong>${advisor.props.name}</strong>.</p>
             <p>Para acompanhar o progresso, acesse: <a href="${requestUrl}">${requestUrl}</a></p>`,
    });
  }
}
