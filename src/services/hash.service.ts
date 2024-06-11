import { Injectable } from '@angular/core';
import bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class HashService {
  constructor() {}

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
