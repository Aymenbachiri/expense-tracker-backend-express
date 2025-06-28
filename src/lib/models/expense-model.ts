import { Schema, model, Document, Types } from 'mongoose';

export interface IExpense extends Document {
  _id: Types.ObjectId;
  amount: number;
  description: string;
  notes?: string;
  category: Types.ObjectId;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      validate: {
        validator: function (value: number) {
          return Number.isFinite(value) && value > 0;
        },
        message: 'Amount must be a valid positive number',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, amount: 1 });

export default model<IExpense>('Expense', ExpenseSchema);
