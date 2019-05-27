import { Document, Schema } from 'mongoose';
import { DB_REF_MAQUETTE } from '../../constants';

export const MasterSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  maquettes: [{ type: Schema.Types.ObjectId, ref: DB_REF_MAQUETTE }],
});

export interface Master extends Document {
  readonly name: string;
  readonly description: string;
}

/*

	name String,
    descripton String,
 */
