import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

// Hash password using scrypt
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare supplied password with stored password
async function comparePasswords(supplied: string, stored: string) {
  // Check if stored password has the correct format
  if (!stored || !stored.includes(".")) {
    // Handle the case where the stored password doesn't have the expected format
    console.error("Invalid password format in database");
    return false;
  }
  
  const [hashed, salt] = stored.split(".");
  
  if (!hashed || !salt) {
    console.error("Invalid password format - missing hash or salt");
    return false;
  }
  
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Set up session middleware
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "evergridsecret2024",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Ensure default users exist
  const createDefaultUsers = async () => {
    // Check if default client user exists
    const clientUser = await storage.getUserByUsername("client");
    if (!clientUser) {
      await storage.createUser({
        username: "client",
        password: await hashPassword("password123"),
        role: "client",
        created_at: new Date().toISOString(),
      });
      console.log("Created default client user");
    }
    
    // Check if default admin user exists
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      await storage.createUser({
        username: "admin",
        password: await hashPassword("admin123"),
        role: "admin",
        created_at: new Date().toISOString(),
      });
      console.log("Created default admin user");
    }
  };
  
  // Create default users
  createDefaultUsers();

  // Register routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
        role: req.body.role || "client", // Default to 'client' role if not specified
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Admin routes for user management
  app.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      const allUsers = Array.from(storage.users.values()).map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(allUsers);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/admin/facility-progress", isAdmin, async (req, res, next) => {
    try {
      const progressData = Array.from(storage.progress.values());
      res.json(progressData);
    } catch (err) {
      next(err);
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

// Middleware to check if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
}