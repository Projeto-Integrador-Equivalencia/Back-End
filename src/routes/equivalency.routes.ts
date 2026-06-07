import { Router } from 'express';
import { EquivalencyFactory } from '../main/factories/EquivalencyFactory';
import { authMiddleware } from '../infrastructure/http/middlewares/AuthMiddleware';
import { authorize } from '../infrastructure/http/middlewares/RoleMiddleware';

const equivalencyRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Equivalency
 *     description: Equivalency API endpoint
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Equivalency:
 *       type: object
 *       required:
 *          - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         courseId:
 *           type: integer
 */

/**
 * @swagger
 * /equivalencies/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Equivalency
 *     summary: List all equivalencies.
 *     description: List all equivalencies.
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Equivalency not found
 *       '500':
 *         description: Internal server error
 */
equivalencyRouter.get('/', authMiddleware, (req, res) => {
  return EquivalencyFactory().findAll(req, res);
});

/**EquivalencyFactory
 * @swagger
 * /equivalencies/search?name={name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Equivalency
 *     summary: Get equivalency by name.
 *     description: Get equivalency by name.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Equivalency name
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Equivalency not found
 *       '500':
 *         description: Internal server error
 */
equivalencyRouter.get('/search', authMiddleware, (req, res) => {
  return EquivalencyFactory().findByName(req, res);
});

/**
 * @swagger
 * /equivalencies/{id}:
 *   get:
 *     tags:
 *       - Equivalency
 *     summary: Get equivalency by ID.
 *     description: Get equivalency by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Equivalency ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Equivalency not found
 *       '500':
 *         description: Internal server error
 */
equivalencyRouter.get('/:id', authMiddleware, (req, res) => {
  return EquivalencyFactory().findById(req, res);
});

/**
 * @swagger
 * /equivalencies/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Equivalency
 *     summary: Create equivalency.
 *     description: Create equivalency.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Create equivalency
 *           schema:
 *             $ref: '#/components/schemas/Equivalency'
 *     responses:
 *       '201':
 *         description: Created equivalency successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
equivalencyRouter.post(
  '/create',
  authMiddleware,
  authorize(['administrator']),
  (req, res) => {
    return EquivalencyFactory().create(req, res);
  },
);

/**
 * @swagger
 * /equivalencies/updated/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Equivalency
 *     summary: Update equivalency.
 *     description: Update equivalency.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Update equivalency
 *           schema:
 *             $ref: '#/components/schemas/Equivalency'
 *     responses:
 *       '201':
 *         description: update equivalency successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
equivalencyRouter.patch(
  '/updated/:id',
  authMiddleware,
  authorize(['administrator']),
  (req, res) => {
    return EquivalencyFactory().update(req, res);
  },
);

export default equivalencyRouter;
