import { SequelizeEquivalencyRepository } from '../../infrastructure/database/sequelize/repositories/SequelizeEquivalencyRepository';
import { CreateEquivalencyService } from '../../services/equivalency/CreateEquivalencyService';
import { FindAllService } from '../../services/equivalency/FindAllService';
import { FindByNameService } from '../../services/equivalency/FindByNameService';
import { FindByIdService } from '../../services/equivalency/FindByIdService';
import { UpdateEquivalency } from '../../services/equivalency/UpdateEquivalency';
import { EquivalencyController } from '../../controllers/EquivalencyController';

export const EquivalencyFactory = () => {
  const equivalencyRepository = new SequelizeEquivalencyRepository();

  const createEquivalencyService = new CreateEquivalencyService(
    equivalencyRepository,
  );
  const findAllService = new FindAllService(equivalencyRepository);
  const findByNameService = new FindByNameService(equivalencyRepository);
  const findByIdService = new FindByIdService(equivalencyRepository);
  const updatedEquivalency = new UpdateEquivalency(equivalencyRepository);

  const equivalencyController = new EquivalencyController(
    createEquivalencyService,
    findAllService,
    findByNameService,
    findByIdService,
    updatedEquivalency,
  );

  return equivalencyController;
};
