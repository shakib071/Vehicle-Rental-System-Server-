import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(process.cwd(),".env")});

const app = express();
const port = 5000;

//parser 
app.use(express.json());


//DB

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
});

const initDB = async() => {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS test(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
            )
        `);
}

initDB();



app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
