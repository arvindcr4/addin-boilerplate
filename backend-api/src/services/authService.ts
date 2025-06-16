import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

// In-memory user store (replace with database in production)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();
const refreshTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();

// Seed demo user
const demoUser: User = {
  id: '1',
  email: 'demo@spellbook.legal',
  password: bcrypt.hashSync('demo', 10),
  name: 'Demo User',
  createdAt: new Date(),
};
users.set(demoUser.id, demoUser);

export class AuthService {
  static async login(email: string, password: string) {
    const user = Array.from(users.values()).find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      token,
      refreshToken,
    };
  }

  static async signup(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    users.set(user.id, user);

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      token,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string) {
    const tokenData = refreshTokens.get(refreshToken);
    
    if (!tokenData || tokenData.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = users.get(tokenData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old refresh token
    refreshTokens.delete(refreshToken);

    // Generate new tokens
    const newToken = this.generateToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  static getUserById(id: string): User | undefined {
    return users.get(id);
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  }

  private static generateRefreshToken(user: User): string {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    refreshTokens.set(token, {
      userId: user.id,
      expiresAt,
    });

    return token;
  }
}