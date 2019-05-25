import { Document, Schema } from 'mongoose';
import { ADMIN_ROLE } from './roles.constants';

export const UserSchema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  roles: { type: [String], default: [] },
});

export interface User extends Document {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly roles: string[];
}

export const isAdmin = (user: User): boolean => user.roles.includes(ADMIN_ROLE);
