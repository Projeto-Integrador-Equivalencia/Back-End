import { email, z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';
import { isPhone } from 'brazilian-values';

export const studentSchema = z.object({
  name: z
    .string('Nome é obrigatório')
    .min(3, 'Nome deve ter um mínimo de 3 caracteres.')
    .max(100, 'Nome deve ter um máximo de 100 caracteres.'),

  email: z
    .email('Email é obrigatório.')
    .refine(
      (email) =>
        email.endsWith('@aluno.cps.sp.gov.br') ||
        email.endsWith('@cps.sp.gov.br'),
      {
        message: 'Apenas emails do Centro Paula Souza podem acessar o sistema.',
      },
    ),

  password: z
    .string('Senha é obrigatório.')
    .min(8, 'A senha deve um mínimo de 8 caracteres.')
    .max(100, 'A senha possui um máximo de 100 caracteres.'),

  cpf: z
    .string('CPF é obrigatório.')
    .min(11, 'CPF incompleto')
    .refine((val) => cpf.isValid(val), {
      message: 'CPF inválido.',
    }),

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
