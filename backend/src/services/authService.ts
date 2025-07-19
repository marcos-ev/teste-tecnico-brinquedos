import { db } from '../config/database';
import bcrypt from 'bcryptjs';
import { LoginRequest, AuthUser } from '../types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthUser | null> {
    return new Promise((resolve, reject) => {
      const { email, password } = credentials;

      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const isValidPassword = await bcrypt.compare(password, (row as any).password);
          if (isValidPassword) {
            resolve({
              id: (row as any).id,
              email: (row as any).email
            });
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  static async createUser(email: string, password: string): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);

      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              email
            });
          }
        }
      );
    });
  }
} 