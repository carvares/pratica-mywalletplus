import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connection from "./database.js";
import userController from "./controllers/userController.js"

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", userController.signUp);

app.post("/sign-in", userController.signIn);

app.post("/financial-events", userController.newTransaction);

app.get("/financial-events", userController.transactions);

app.get("/financial-events/sum", userController.sumTransactions);

export default app;
