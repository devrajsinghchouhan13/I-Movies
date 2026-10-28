import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/store.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

export async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.createUser({
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'user',
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed due to server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed due to server error' });
  }
}

export function getProfile(req, res) {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user = db.findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
}
