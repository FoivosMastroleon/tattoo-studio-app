import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './utils/db';
import app from './app';

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start().catch(console.error);
