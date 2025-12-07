import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import initDB, { pool } from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoute } from './modules/vehicles/vehicles.routes';
import { usersRoute } from './modules/users/users.routes';
import { bookingRoute } from './modules/bookings/bookings.routes';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();



//parser 
app.use(express.json());

//Initalize db
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Welcome to vehicle Rental system server API ');
});

app.use("/api/v1/auth",authRoutes);

app.use("/api/v1/vehicles",vehiclesRoute);

app.use("/api/v1/users",usersRoute);

app.use('/api/v1/bookings',bookingRoute);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`
  });
});


export default app;