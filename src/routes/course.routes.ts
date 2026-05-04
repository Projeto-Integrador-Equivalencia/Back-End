import { Router } from 'express';
import { CourseFactory } from '../main/factories/CourseFactory';
import { authMiddleware } from '../infrastructure/http/middlewares/AuthMiddleware';
import { authorize } from '../infrastructure/http/middlewares/RoleMiddleware';

const courseRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Courses API endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *          - name
 *          - code
 *          - semesterAmount
 *          - shift
 *          - createdByAdminId
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         semesterAmount:
 *           type: integer
 *         shift:
 *           type: string
 *           enum: [Matutino, Vespertino, Noturno, Integral]
 *         createdByAdminId:
 *           type: integer
 * securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /courses/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Courses
 *     summary: List all courses.
 *     description: List all courses.
 *     responses:
 *       '200':
 *         description: A successful response
 *       '500':
 *         description: Internal server error
 */
courseRouter.get('/', authMiddleware, (req, res) => {
  return CourseFactory().findAll(req, res);
});

/**
 * @swagger
 * /courses/search/code?code={code}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Courses
 *     summary: Get course by code.
 *     description: Get course by code.
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Course code
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Course not found
 *       '500':
 *         description: Internal server error
 */
courseRouter.get('/search/code', authMiddleware, (req, res) => {
  return CourseFactory().findByCode(req, res);
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Courses
 *     summary: Get course by ID.
 *     description: Get course by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Course ID
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Course not found
 *       '500':
 *         description: Internal server error
 */
courseRouter.get('/:id', authMiddleware, authorize(['student']), (req, res) => {
  return CourseFactory().findById(req, res);
});

/**
 * @swagger
 * /courses/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Courses
 *     summary: Create course.
 *     description: Create course.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           description: Create course
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '201':
 *         description: Created course successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
courseRouter.post(
  '/',
  authMiddleware,
  authorize(['administrator']),
  (req, res) => {
    return CourseFactory().create(req, res);
  },
);

export default courseRouter;
