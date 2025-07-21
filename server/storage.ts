import { users, resumes, type User, type InsertUser, type Resume, type InsertResume } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume methods
  getResumesByUserId(userId: number): Promise<Resume[]>;
  getResumeById(id: number, userId: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, userId: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private currentUserId: number;
  private currentResumeId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.currentUserId = 1;
    this.currentResumeId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      profilePicture: insertUser.profilePicture || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async getResumeById(id: number, userId: number): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    return resume && resume.userId === userId ? resume : undefined;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const now = new Date();
    const resume: Resume = {
      ...insertResume,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, userId: number, updateData: Partial<InsertResume>): Promise<Resume | undefined> {
    const existingResume = this.resumes.get(id);
    if (!existingResume || existingResume.userId !== userId) {
      return undefined;
    }

    const updatedResume: Resume = {
      ...existingResume,
      ...updateData,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number, userId: number): Promise<boolean> {
    const resume = this.resumes.get(id);
    if (!resume || resume.userId !== userId) {
      return false;
    }
    return this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
