import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import initDB, { pool } from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoute } from './modules/vehicles/vehicles.routes';
import { usersRoute } from './modules/users/users.routes';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();



//parser 
app.use(express.json());

//Initalize db
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World! ')
});

app.use("/api/v1/auth",authRoutes);

app.use("/api/v1/vehicles",vehiclesRoute);

app.use("/api/v1/users",usersRoute);

export default app;