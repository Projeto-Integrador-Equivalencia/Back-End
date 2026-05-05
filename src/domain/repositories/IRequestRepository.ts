import { Request } from '../entities/Request';

export interface IRequestRepository {
  create(request: Request): Promise<Request>;
  updateStatus(id: number, status: string): Promise<void>;
  addObservation(requestId: number, observation: string): Promise<void>;
  cancelRequest(requestId: number): Promise<void>;
  findById(requestId: number): Promise<Request | null>;
  findByStudent(studentId: number): Promise<Request[]>;
  findByAdvisorCourses(advisorId: number, courseId: number): Promise<Request[]>;
  findByProtocol(protocol: string): Promise<Request | null>;
  checkDuplicity(studentId: number, equivalencyId: number): Promise<boolean>;
  generateProtocol(): Promise<string>;
  assignAdvisor(advisorId: number, requestId: number): Promise<void>;
}
