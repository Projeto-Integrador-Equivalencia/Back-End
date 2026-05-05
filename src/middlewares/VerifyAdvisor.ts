import { Request, Response, NextFunction } from 'express';
import { SequelizeRequestRepository } from '../infrastructure/database/sequelize/repositories/SequelizeRequestRepository';

export async function VerifyAdvisor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const advisorId = req.user!.id;

    const requestRepo = new SequelizeRequestRepository();
    const request = await requestRepo.findById(Number(id));

    if (!request) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    if (request.props.advisorId !== Number(advisorId)) {
      return res.status(403).json({
        error: 'Acesso negado. Solicitação já pertence a outro orientador.',
      });
    }
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro interno na verificação de permissão.' });
  }
}
