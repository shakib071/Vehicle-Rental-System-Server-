import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import initDB from './config/db';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();



//parser 
app.use(express.json());

//Initalize db
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World! ')
})

export default app;