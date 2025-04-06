import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import * as fs from 'fs';
import * as path from 'path';
import { insertFacilityProgressSchema, User } from "@shared/schema";

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      login(user: User, callback: (err: any) => void): void;
      logout(callback: (err: any) => void): void;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // ==========================================
  // Public routes (no auth required)
  // ==========================================
  
  // API endpoint to read the SNF data CSV file
  app.get('/api/snf-data', async (req, res) => {
    try {
      const csvPath = path.resolve(process.cwd(), 'data', 'snf_cleaned.csv');
      
      if (fs.existsSync(csvPath)) {
        const fileContent = fs.readFileSync(csvPath, 'utf8');
        res.status(200).send(fileContent);
      } else {
        res.status(404).json({ 
          message: 'SNF data file not found',
          path: csvPath
        });
      }
    } catch (error) {
      console.error('Error reading SNF data file:', error);
      res.status(500).json({ 
        message: 'Error reading SNF data file', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Proxy for PRD and rules files
  app.get('/api/docs/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const docsPath = path.resolve(process.cwd(), 'docs', filename);
      
      if (fs.existsSync(docsPath)) {
        const fileContent = fs.readFileSync(docsPath, 'utf8');
        res.status(200).send(fileContent);
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      console.error('Error reading document:', error);
      res.status(500).json({ 
        message: 'Error reading document', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ==========================================
  // Client routes (auth required)
  // ==========================================
  
  // Get basic facility list (accessible to all authenticated users)
  app.get('/api/facilities', isAuthenticated, async (req, res) => {
    try {
      const facilities = await storage.getFacilities();
      res.status(200).json(facilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      res.status(500).json({ 
        message: 'Error fetching facilities', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Get specific facility
  app.get('/api/facilities/:id', isAuthenticated, async (req, res) => {
    try {
      const facility = await storage.getFacility(req.params.id);
      
      if (!facility) {
        return res.status(404).json({ message: 'Facility not found' });
      }
      
      res.status(200).json(facility);
    } catch (error) {
      console.error('Error fetching facility:', error);
      res.status(500).json({ 
        message: 'Error fetching facility', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Save facility progress
  app.post('/api/facility-progress', isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validProgress = insertFacilityProgressSchema.safeParse(req.body);
      if (!validProgress.success) {
        return res.status(400).json({ 
          message: 'Invalid progress data', 
          details: validProgress.error 
        });
      }
      
      // Add user ID to progress data
      const progressData = {
        ...req.body,
        user_id: req.user ? (req.user as any).id : null,
        last_updated: new Date().toISOString()
      };
      
      // Check if progress already exists for this facility
      const existingProgress = await storage.getFacilityProgress(progressData.facility_id);
      
      let progress;
      if (existingProgress) {
        progress = await storage.updateFacilityProgress(existingProgress.id, progressData);
      } else {
        progress = await storage.createFacilityProgress(progressData);
      }
      
      res.status(200).json(progress);
    } catch (error) {
      console.error('Error saving facility progress:', error);
      res.status(500).json({ 
        message: 'Error saving facility progress', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get facility progress
  app.get('/api/facility-progress/:facilityId', isAuthenticated, async (req, res) => {
    try {
      const progress = await storage.getFacilityProgress(req.params.facilityId);
      
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found for this facility' });
      }
      
      res.status(200).json(progress);
    } catch (error) {
      console.error('Error fetching facility progress:', error);
      res.status(500).json({ 
        message: 'Error fetching facility progress', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // ==========================================
  // Admin routes (admin auth required)
  // ==========================================
  
  // Admin API for user management
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      // In a real application, we would fetch users from a database
      // Here we're returning only non-sensitive information
      const users = Array.from(storage.users.values()).map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        message: 'Error fetching users', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Admin API to create a new facility
  app.post('/api/admin/facilities', isAdmin, async (req, res) => {
    try {
      const facility = await storage.createFacility(req.body);
      res.status(201).json(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
      res.status(500).json({ 
        message: 'Error creating facility', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Admin API to update a facility
  app.patch('/api/admin/facilities/:id', isAdmin, async (req, res) => {
    try {
      const facility = await storage.updateFacility(req.params.id, req.body);
      
      if (!facility) {
        return res.status(404).json({ message: 'Facility not found' });
      }
      
      res.status(200).json(facility);
    } catch (error) {
      console.error('Error updating facility:', error);
      res.status(500).json({ 
        message: 'Error updating facility', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Admin API to get all facility progress records
  app.get('/api/admin/facility-progress', isAdmin, async (req, res) => {
    try {
      // In a real application, we would fetch all progress records from a database
      // Here we're returning an array of progress records
      const progressRecords = Array.from(storage.progress.values());
      res.status(200).json(progressRecords);
    } catch (error) {
      console.error('Error fetching facility progress records:', error);
      res.status(500).json({ 
        message: 'Error fetching facility progress records', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
