import { Document, Schema, Types } from 'mongoose';
import { DB_REF_MASTER } from '../../constants';
import { Master } from '../master/master.entity';

const CourseSchema = new Schema({
  name: { type: String, required: true },
  // TODO TEACHER
  // teacher:
  nmbGroupTd: { type: Number, required: true },
  nmbAmphiHour: { type: Number, required: true },
  nmbTdHour: { type: Number, required: true },
  coefCC: { type: Number },
  coefExam: { type: Number },
  lengthExam: { type: Number, default: 0 },
  commun: { type: String, default: '' },
  nmbEcts: { type: Number },
  examType: { type: String },
  courseEnglish: { type: Boolean },
  englishTranslation: { type: String },
  ratrappage: { type: Boolean },
});
CourseSchema.virtual('totalProf').get(function() {
  return this.nmbGroupTd * this.nmbTdHour + this.nmbAmphiHour;
});
CourseSchema.virtual('totalEtu').get(function() {
  return this.nmbTdHour + this.nmbAmphiHour;
});
CourseSchema.set('toObject', { virtuals: true });
CourseSchema.set('toJSON', { virtuals: true });

const ModuleSchema = new Schema({
  name: { type: String, required: true },
  courses: [CourseSchema],
});

ModuleSchema.virtual('ects').get(function() {
  if (!this.courses) {
    return 0;
  }
  return this.courses.reduce((prev, curr) => prev + curr.nmbEcts, 0);
});

ModuleSchema.virtual('totalEtu').get(function() {
  if (!this.courses) {
    return 0;
  }
  return this.courses.reduce((prev, curr) => prev + curr.totalEtu, 0);
});

ModuleSchema.virtual('totalTD').get(function() {
  if (!this.courses) {
    return 0;
  }
  return this.courses.reduce((prev, curr) => prev + curr.nmbGroupTd, 0);
});

ModuleSchema.virtual('totalAmphi').get(function() {
  if (!this.courses) {
    return 0;
  }
  return this.courses.reduce((prev, curr) => prev + curr.nmbAmphiHour, 0);
});

ModuleSchema.virtual('totalExam').get(function() {
  if (!this.courses) {
    return 0;
  }
  return this.courses.reduce((prev, curr) => prev + curr.lengthExam, 0);
});
ModuleSchema.set('toObject', { virtuals: true });
ModuleSchema.set('toJSON', { virtuals: true });

const SemesterSchema = new Schema({
  number: { type: Number, required: true },
  modules: [ModuleSchema],
});

SemesterSchema.virtual('totalEtu').get(function() {
  if (!this.modules) {
    return 0;
  }
  return this.modules.reduce((prev, curr) => prev + curr.totalEtu, 0);
});

SemesterSchema.virtual('ects').get(function() {
  if (!this.modules) {
    return 0;
  }
  return this.modules.reduce((prev, curr) => prev + curr.ects, 0);
});

SemesterSchema.virtual('totalTD').get(function() {
  if (!this.modules) {
    return 0;
  }
  return this.modules.reduce((prev, curr) => prev + curr.totalTD, 0);
});

SemesterSchema.virtual('totalAmphi').get(function() {
  if (!this.modules) {
    return 0;
  }
  return this.modules.reduce((prev, curr) => prev + curr.totalAmphi, 0);
});

SemesterSchema.virtual('totalExam').get(function() {
  if (!this.modules) {
    return 0;
  }
  return this.modules.reduce((prev, curr) => prev + curr.totalExam, 0);
});
SemesterSchema.set('toObject', { virtuals: true });
SemesterSchema.set('toJSON', { virtuals: true });

const ExtraGroupItemSchema = new Schema({
  name: { type: String, required: true },
  hour: { type: Number, default: 0 },
  date: { type: String },
});

const ExtraGroupSchema = new Schema({
  name: { type: String, required: true },
  items: [ExtraGroupItemSchema],
});

ExtraGroupSchema.virtual('totalHour').get(function() {
  return this.items.reduce((prev, curr) => prev + curr.hour, 0);
});
ExtraGroupSchema.set('toObject', { virtuals: true });
ExtraGroupSchema.set('toJSON', { virtuals: true });

const YearSchema = new Schema({
  level: { type: String, required: true },
  semesters: [SemesterSchema],
  extras: [ExtraGroupSchema],
});

YearSchema.virtual('totalHour').get(function() {
  if (!this.semesters || !this.extras) {
    return 0;
  }
  const totalExam = this.semesters.reduce(
    (prev, curr) => prev + curr.totalExam,
    0,
  );
  const totalEtu = this.semesters.reduce(
    (prev, curr) => prev + curr.totalEtu,
    0,
  );
  const totalExtra = this.extras.reduce(
    (prev, curr) => prev + curr.totalHour,
    0,
  );
  return totalEtu + totalExam + totalExtra;
});
YearSchema.set('toObject', { virtuals: true });
YearSchema.set('toJSON', { virtuals: true });

export const MaquetteSchema = new Schema({
  schoolYear: { type: String, required: true },
  inProduction: { type: Boolean, default: false },
  master: { type: Schema.Types.ObjectId, ref: DB_REF_MASTER },
  years: [YearSchema],
});
MaquetteSchema.set('toObject', { virtuals: true });
MaquetteSchema.set('toJSON', { virtuals: true });

export interface Maquette extends Document {
  readonly schoolYear: string;
  readonly inProduction: boolean;
  readonly master: Master | Schema.Types.ObjectId;
  readonly years: [
    {
      readonly totalHour: number;
      readonly level: string;
      readonly semesters: [
        {
          readonly number: number;
          readonly totalAmphi: number;
          readonly totalExam: number;
          readonly totalTD: number;
          readonly totalEtu: number;
          readonly ects: number;
          readonly modules: [
            {
              readonly name: string;
              readonly totalEtu: number;
              readonly totalTD: number;
              readonly totalAmphi: number;
              readonly totalExam: number;
              readonly ects: number;
              readonly courses: [
                {
                  readonly name: string;
                  readonly nmbGroupTd: number;
                  readonly nmbAmphiHour: number;
                  readonly nmbTdHour: number;
                  readonly totalProf: number;
                  readonly totalEtu: number;
                  readonly coefCC: number;
                  readonly coefExam: number;
                  readonly lenghtExam: number;
                  readonly nmbEcts: number;
                  readonly examType: string;
                  readonly courseEnglish: boolean;
                  readonly englishTranslation: string;
                  readonly ratrappage: boolean;
                }
              ];
            }
          ];
        }
      ];
      readonly extras: [
        {
          readonly totalHour: number;
          readonly name: string;
          readonly items: [
            {
              readonly name: string;
              readonly hour: number;
              readonly date: string;
            }
          ];
        }
      ];
    }
  ];
}
