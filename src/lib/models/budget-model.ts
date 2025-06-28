import { Schema, model, Document, Types } from 'mongoose';

export interface IBudget extends Document {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  category: Types.ObjectId;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate: Date;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    name: {
      type: String,
      required: [true, 'Budget name is required'],
      trim: true,
      minlength: [1, 'Budget name cannot be empty'],
      maxlength: [100, 'Budget name cannot be more than 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0.01, 'Budget amount must be greater than 0'],
      validate: {
        validator: function (value: number) {
          return Number.isFinite(value) && value > 0;
        },
        message: 'Budget amount must be a valid positive number',
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly', 'yearly'],
      required: [true, 'Budget period is required'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

BudgetSchema.index({ userId: 1, isActive: 1 });
BudgetSchema.index({ userId: 1, category: 1 });
BudgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

BudgetSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

export default model<IBudget>('Budget', BudgetSchema);
