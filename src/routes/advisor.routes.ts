import { Router } from 'express';
import { AdvisorFactory } from '../main/factories/AdvisorFactory';
import { authMiddleware } from '../infrastructure/http/middlewares/AuthMiddleware';
import { authorize } from '../infrastructure/http/middlewares/RoleMiddleware';
import { validateBody } from '../middlewares/ValidateBody';
import { userSchema } from '../infrastructure/schemas/user.schemas';

const advisorRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Advisors
 *     description: Advisor API endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Advisor:
 *       type: object
 *       required:
 *          - name
 *          - email
 *          - password
 *          - cpf
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         cpf:
 *           type: string
 * securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /advisors/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Advisors
 *     summary: Get advisor by ID.
 *     description: Get advisor by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Advisor ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Advisor not found
 *       '500':
 *         description: Internal server error
 */
advisorRouter.get(
  '/:id',
  authMiddleware,
  authorize(['student', 'advisor', 'administrator']),
  (req, res) => {
    return AdvisorFactory().getById(req, res);
  },
);

/**
 * @swagger
 * /advisors/search/cpf?cpf={cpf}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Advisors
 *     summary: Get advisor by CPF.
 *     description: Get advisor by CPF.
 *     parameters:
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         required: true
 *         description: Advisor CPF
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Advisor not found
 *       '500':
 *         description: Internal server error
 */
advisorRouter.get(
  '/search/cpf',
  authMiddleware,
  authorize(['advisor', 'administrator']),
  (req, res) => {
    return AdvisorFactory().getByCpf(req, res);
  },
);

/**
 * @swagger
 * /advisors/search/email?email={email}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Advisors
 *     summary: Get advisor by E-mail.
 *     description: Get advisor by E-mail.
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Advisor E-mail
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Advisor not found
 *       '500':
 *         description: Internal server error
 */
advisorRouter.get(
  '/search/email',
  authMiddleware,
  authorize(['advisor', 'administrator']),
  (req, res) => {
    return AdvisorFactory().getByEmail(req, res);
  },
);

/**
 * @swagger
 * /advisors/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Advisors
 *     summary: Create advisor.
 *     description: Create Advisor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Create advisor
 *           schema:
 *             $ref: '#/components/schemas/Advisor'
 *     responses:
 *       '201':
 *         description: Created advisor successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
advisorRouter.post(
  '/',
  authMiddleware,
  authorize(['administrator']),
  validateBody(userSchema),
  (req, res) => {
    return AdvisorFactory().create(req, res);
  },
);

export default advisorRouter;
