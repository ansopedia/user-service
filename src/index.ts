import express, { type Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.APP_PORT ?? 3000;

// Boot express
export const app:     Application = express();

// Start server
app.listen(port, () => {
        console.log(`Server is listening on port ${port}!`);
});
