import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as fs from 'fs';
import * as path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Example API endpoint for facility data storage (would use localStorage in practice)
  app.post('/api/save-facility-progress', async (req, res) => {
    try {
      const { facilityId, progressData } = req.body;
      
      if (!facilityId || !progressData) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // In a real application, this would save to a database
      // For this implementation, we acknowledge receipt but rely on client localStorage
      
      res.status(200).json({ 
        message: 'Progress saved successfully',
        facilityId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving facility progress:', error);
      res.status(500).json({ 
        message: 'Error saving facility progress', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
