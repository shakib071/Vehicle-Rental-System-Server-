//DB

import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: `${config.connection_str}`
});

const initDB = async() => {
    //users DB table
    //email lowercase
    await pool.query(`
            CREATE TABLE IF NOT EXISTS Users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(200) NOT NULL UNIQUE CHECK(email = LOWER(email)),
                password TEXT NOT NULL CHECK(LENGTH(password) >= 6),
                phone VARCHAR(20) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('admin','customer'))
        )
    `);
    
    
    //Vehicles DB table 

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name TEXT NOT NULL,
            type VARCHAR(20) CHECK(type IN ('car','bike','van','SUV')),
            registration_number VARCHAR(200) NOT NULL UNIQUE,
            daily_rent_price NUMERIC(12,3) NOT NULL CHECK(daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))

        )

    `);


    // Bookings DB table 

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES Vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
            total_price NUMERIC(12,3) NOT NULL CHECK(total_price > 0),
            status VARCHAR(20) NOT NULL CHECK(status IN ('active','cancelled','returned'))
        )
        
    `);





    
}

export default initDB;

