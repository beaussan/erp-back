import { Document, Schema } from 'mongoose';

export const MasterSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
});

export interface Master extends Document {
  readonly name: string;
  readonly description: string;
}

/*

	name String,
    descripton String,
 */
