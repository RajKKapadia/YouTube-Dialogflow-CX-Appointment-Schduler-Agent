import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import homeRouter from "./routes/homeRoute";
import dialogflowRouter from "./routes/dialogflowRoute";

dotenv.config();

const app: Express = express();

// Seetings for the application
app.use(express.json())
app.use(express.urlencoded())
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Path ${req.path} with method ${req.method}.`);
    next();
});

const PORT = process.env.PORT || 5000;

app.use("/", homeRouter);
app.use("/dialogflow", dialogflowRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}.`);
});
