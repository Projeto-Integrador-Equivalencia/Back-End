import { Request, RequestProps, Status } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

import { ActionLog } from '../../domain/entities/ActionLog';
import { IActionLogRepository } from '../../domain/repositories/IActionLogRepository';

export class UpdateStatusService {
  constructor(
    private requestRepo: IRequestRepository,
    private logRepo: IActionLogRepository,
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
  }
}
