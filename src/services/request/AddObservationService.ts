import { Request, RequestProps } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

import { ActionLog } from '../../domain/entities/ActionLog';
import { IActionLogRepository } from '../../domain/repositories/IActionLogRepository';

import { IMailProvider } from '../../domain/providers/IMailProvider';

import { IStudentRepository } from '../../domain/repositories/IStudentRepository';

import { IAdvisorRepository } from '../../domain/repositories/IAdvisorRepository';

export class AddObservationService {
  constructor(
    private requestRepo: IRequestRepository,
    private logRepo: IActionLogRepository,
    private mailProvider: IMailProvider,
    private studentRepo: IStudentRepository,
    private advisorRepo: IAdvisorRepository,
  ) {}

  async execute(
    requestId: number,
    logInfo: { author: string; authorRole: string },
    observation: string,
  ) {
    const request = await this.requestRepo.findById(requestId);

    if (!request) throw new Error('Solicitação não encontrada!');

    const newLog = new ActionLog({
      requestId: requestId,
      action: 'Observação da solicitação atualizada.',
      author: logInfo.author,
      authorRole: logInfo.authorRole,
      createdAt: new Date(),
    });

    if (request.props.observation === observation) {
      return;
    }

    await this.logRepo.save(newLog);

    await this.requestRepo.addObservation(requestId, observation);

    const student = await this.studentRepo.findById(request.props.studentId);

    const advisor = await this.advisorRepo.findById(
      Number(request.props.advisorId),
    );

    if (!student || !advisor) {
      throw new Error(
        'Falha ao obter ID do estudante ou orientador para envio de E-mail.',
      );
    }

    const requestUrl = `http://localhost:3000/requests/${request.props.id}`;

    await this.mailProvider.sendMail({
      to: student.props.email,
      subject: 'Observação adicionada.',
      body: `<p>Olá ${student.props.name}! Uma nova observação foi adicionada por seu Orientador (${advisor?.props.name}). Para visualizá-la, clique no link: <a href="${requestUrl}">${requestUrl}</a></p>`,
    });
  }
}
