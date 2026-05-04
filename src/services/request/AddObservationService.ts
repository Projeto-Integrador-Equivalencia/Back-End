import { Request, RequestProps } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

import { ActionLog } from '../../domain/entities/ActionLog';
import { IActionLogRepository } from '../../domain/repositories/IActionLogRepository';

export class AddObservationService {
  constructor(
    private requestRepo: IRequestRepository,
    private logRepo: IActionLogRepository,
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
  }
}
