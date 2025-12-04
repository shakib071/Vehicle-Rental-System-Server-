import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import initDB from './config/db';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();
const port = 5000;

//parser 
app.use(express.json());

//Initalize db
initDB();



app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
