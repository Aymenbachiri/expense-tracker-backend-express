import dotenv from 'dotenv';

dotenv.config();

export const PORT: string = process.env.PORT!;
export const MONGODB_URI: string = process.env.MONGODB_URI!;
