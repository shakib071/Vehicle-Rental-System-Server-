//DB

import { Pool } from "pg";
import config from ".";

const pool = new Pool({
    connectionString: `${config.connection_str}`
});

const initDB = async() => {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS test(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
            )
        `);
}

export default initDB;