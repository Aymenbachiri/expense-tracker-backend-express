import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  },
);

export default model<ICategory>('Category', CategorySchema);
