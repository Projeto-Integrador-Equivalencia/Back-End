import { Request, RequestProps, Status } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

import { ActionLog } from '../../domain/entities/ActionLog';
import { IActionLogRepository } from '../../domain/repositories/IActionLogRepository';

import { IMailProvider } from '../../domain/providers/IMailProvider';

import { IStudentRepository } from '../../domain/repositories/IStudentRepository';

export class UpdateStatusService {
  constructor(
    private requestRepo: IRequestRepository,
    private logRepo: IActionLogRepository,
    private mailProvider: IMailProvider,
    private studentRepo: IStudentRepository,
  ) {}

  async execute(
    requestId: number,
    logInfo: { author: string; authorRole: string },
    status: Status,
  ) {
    const request = await this.requestRepo.findById(requestId);

    if (!request) throw new Error('Solicitação não encontrada!');

    if (request.props.status === status) {
      return;
    }

    const newLog = new ActionLog({
      requestId: requestId,
      action: 'Status da solicitação atualizada.',
      author: logInfo.author,
      authorRole: logInfo.authorRole,
      createdAt: new Date(),
    });

    await this.logRepo.save(newLog);

    await this.requestRepo.updateStatus(requestId, status);

    const student = await this.studentRepo.findById(request.props.studentId);

    if (!student) {
      throw new Error('Falha ao obter ID do estudante para envio de E-mail.');
    }

    const requestUrl = `http://localhost:3000/requests/${request.props.id}`;

    await this.mailProvider.sendMail({
      to: student.props.email,
      subject: 'Devolutiva da Solicitação de Equivalência',
      body: `<p>Olá ${student.props.name}! O status de sua Solicitação de Equivalência foi alterado para ${status}. Para visualizá-la, clique no link: <a href="${requestUrl}">${requestUrl}</a></p>`,
    });
  }
}
