import { z } from 'zod';
import { isPhone } from 'brazilian-values';

export const studentSchema = z.looseObject({
  rg: z
    .string('RG é obrigatório.')
    .min(8, 'O RG deve possuir ao menos 8 caracteres')
    .max(9, 'O RG deve possuir no máximo 9 caracteres.'),

  ra: z
    .string('RA é obrigatório')
    .min(9, 'O RA deve possuir ao menos 9 caracteres.')
    .max(10, 'O RA deve possuir no máximo 10 caracteres.'),

  tel: z.string('Telefone é obrigatório.').refine((val) => isPhone(val), {
    message: 'Telefone inválido.',
  }),

  courseId: z.number('ID do Curso deve ser um número válido.'),
});
