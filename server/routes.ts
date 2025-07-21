import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { verifyToken } from "./services/firebaseAdmin";
import { generateResumePDF } from "./services/pdfGenerator";
import { insertUserSchema, insertResumeSchema, resumeDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Middleware to verify Firebase token and attach user
  const authenticateUser = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      console.log('authHeader', authHeader);
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split('Bearer ')[1];
      console.log('token', token);
      const decodedToken = await verifyToken(token);
      
      // Get or create user in our database
      let user = await storage.getUserByFirebaseUid(decodedToken.uid);
      console.log('user', user);
      if (!user) {
        user = await storage.createUser({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || '',
          name: decodedToken.name || decodedToken.email || '',
          profilePicture: decodedToken.picture || null,
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Get user's resumes
  app.get('/api/resumes', authenticateUser, async (req: any, res) => {
    try {
      const resumes = await storage.getResumesByUserId(req.user.id);
      res.json(resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: 'Failed to fetch resumes' });
    }
  });

  // Get specific resume
  app.get('/api/resumes/:id', authenticateUser, async (req: any, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const resume = await storage.getResumeById(resumeId, req.user.id);
      
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: 'Failed to fetch resume' });
    }
  });

  // Create new resume
  app.post('/api/resumes', authenticateUser, async (req: any, res) => {
    try {
      const validatedData = insertResumeSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      // Validate resume data structure
      resumeDataSchema.parse(validatedData.data);
      
      const resume = await storage.createResume(validatedData);
      res.status(201).json(resume);
    } catch (error) {
      console.error('Error creating resume:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid resume data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create resume' });
      }
    }
  });

  // Update resume
  app.put('/api/resumes/:id', authenticateUser, async (req: any, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const updateData = {
        title: req.body.title,
        data: req.body.data,
      };
      
      // Validate resume data structure
      if (updateData.data) {
        resumeDataSchema.parse(updateData.data);
      }
      
      const resume = await storage.updateResume(resumeId, req.user.id, updateData);
      
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error updating resume:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid resume data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update resume' });
      }
    }
  });

  // Delete resume
  app.delete('/api/resumes/:id', authenticateUser, async (req: any, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const success = await storage.deleteResume(resumeId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ message: 'Failed to delete resume' });
    }
  });

  // Generate PDF
  app.post('/api/generate-pdf', authenticateUser, async (req: any, res) => {
    try {
      const { title, data } = req.body;
      
      // Validate resume data structure
      resumeDataSchema.parse(data);
      
      const pdfBuffer = await generateResumePDF(title || 'Resume', data);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title || 'resume'}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid resume data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to generate PDF' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
