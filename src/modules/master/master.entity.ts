import { Document, Schema } from 'mongoose';
import { DB_REF_MAQUETTE } from '../../constants';

export const MasterSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  maquettes: [{ type: Schema.Types.ObjectId, ref: DB_REF_MAQUETTE }],
});
MasterSchema.set('toObject', { virtuals: true });
MasterSchema.set('toJSON', { virtuals: true });

export interface Master extends Document {
  readonly name: string;
  readonly description: string;
  readonly maquettes: any[];
}

/*

	name String,
    descripton String,
 */
