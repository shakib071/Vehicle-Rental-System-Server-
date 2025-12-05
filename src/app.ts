import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import initDB, { pool } from './config/db';
import { authRoutes } from './modules/auth/auth.routes';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();



//parser 
app.use(express.json());

//Initalize db
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World! ')
})

app.use("/api/v1/auth",authRoutes)

// app.post('/api/v1/auth/signup', async(req:Request,res:Response)=> {
//     const {name , email, password, phone,role } = req.body;

//     try{
//         // console.log(name , email, password, phone,role);
//         const result = await pool.query(
//             `INSERT INTO Users(name,email,password,phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`,[name , email, password, phone,role]
//         );

//         res.status(201).json({
//             success:true,
//             message: "User registered successfully",
//             data: result?.rows[0],
//         });
//     }

//     catch(err:any) {
//         res.status(500).json({
//             success: false,
//             message: err?.message,
//         });
//     }

    
// });

export default app;