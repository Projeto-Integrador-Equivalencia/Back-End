import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';

export const userSchema = z.looseObject({
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
});
