import { Router } from 'express';
import { RequestFactory } from '../main/factories/RequestFactory';
import { upload } from '../infrastructure/http/middlewares/upload';
import { authMiddleware } from '../infrastructure/http/middlewares/AuthMiddleware';
import { authorize } from '../infrastructure/http/middlewares/RoleMiddleware';

const requestRoutes = Router();
const requestController = RequestFactory.create();

/**
 * @swagger
 * tags:
 *   - name: Request
 *     description: Request API endpoint
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
 *     Experiences:
 *       type: object
 *       required:
 *          - role
 *          - cnpj
 *          - startDate
 *       properties:
 *         role:
 *           type: string
 *         cnpj:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /requests/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Create request.
 *     description: Generate request.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *               equivalencyId:
 *                 type: integer
 *               advisorId:
 *                 type: integer
 *               experiences:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Experiences"
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       '200':
 *         description: Request generated successfully
 *       '400':
 *         description: Failed to generate request
 *       '401':
 *         description: Invalid token
 *       '500':
 *         description: Internal server error
 */
requestRoutes.post(
  '/',
  authMiddleware,
  authorize(['student']),
  upload.array('files'),
  (req, res) => requestController.create(req, res),
);

/**
 * @swagger
 * /requests/protocol/generate:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Generate request protocol.
 *     description: Generate request protocol.
 *     responses:
 *       '200':
 *         description: Protocol generated successfully
 *       '400':
 *         description: Failed to generate protocol
 *       '500':
 *         description: Internal server error
 */
requestRoutes.post('/protocol/generate', (req, res) =>
  requestController.generateProtocol(req, res),
);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Get request by ID.
 *     description: Get request by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.get('/:id', authMiddleware, (req, res) =>
  requestController.findById(req, res),
);

/**
 * @swagger
 * /requests/student/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Get request by student ID.
 *     description: Get request by student ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.get('/student/:studentId', authMiddleware, (req, res) =>
  requestController.findByStudent(req, res),
);

/**
 * @swagger
 * /requests/search/protocol/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Get request by protocol.
 *     description: Get request by protocol.
 *     parameters:
 *       - in: query
 *         name: protocol
 *         schema:
 *           type: string
 *         required: true
 *         description: Request protocol
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.get('/search/protocol', authMiddleware, (req, res) =>
  requestController.findByProtocol(req, res),
);

/**
 * @swagger
 * /requests/search/protocol/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Check request duplicity.
 *     description: Check request duplicity.
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Student ID
 *       - in: query
 *         name: equivalencyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.get('/check/duplicity', authMiddleware, (req, res) =>
  requestController.checkDuplicity(req, res),
);

/**
 * @swagger
 * /requests/advisor/{id}/course/{courseId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Get request by Advisor Course link.
 *     description: Get request by Advisor Course link.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Advisor ID
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: number
 *         required: true
 *         description: Course ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.get(
  '/advisor/:id/course/:courseId',
  authMiddleware,
  authorize(['advisor']),
  (req, res) => requestController.findByAdvisorCourse(req, res),
);

/**
 * @swagger
 * /requests/{id}/status/:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Update request status.
 *     description: Update request status.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Request new status
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pendente, Reprovado, Aprovado]
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.patch(
  '/:id/status',
  authMiddleware,
  authorize(['advisor']),
  (req, res) => requestController.updatedStatus(req, res),
);

/**
 * @swagger
 * /requests/{id}/observation/:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Update request observation.
 *     description: Update request observation.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Request new status
 *           schema:
 *             type: object
 *             required:
 *               - observation
 *             properties:
 *               observation:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.patch(
  '/:id/observation',
  authMiddleware,
  authorize(['advisor']),
  (req, res) => requestController.addObservation(req, res),
);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Request
 *     summary: Delete request by ID.
 *     description: Delete request by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal server error
 */
requestRoutes.delete(
  '/:id',
  authMiddleware,
  authorize(['student']),
  (req, res) => requestController.cancel(req, res),
);

export default requestRoutes;
