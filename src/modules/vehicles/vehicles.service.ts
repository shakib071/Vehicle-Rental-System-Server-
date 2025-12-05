import { pool } from "../../config/db";

const createVehicles = async(payload: Record<string,unknown>) => {

    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;

    const result = await pool.query(
        `INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING*`,[vehicle_name,type,registration_number,daily_rent_price,availability_status]
    );

    return result;
}

const getVehicles = async() => {
    
    const result = await pool.query(
        `SELECT * FROM Vehicles`
    );
    return result;
}


const getVehiclesById = async(id:string) => {
    const result = await pool.query(
        `SELECT * FROM Vehicles WHERE id = $1`,[id]
    );
    return result;
}


export const vehiclesService = {
    createVehicles,
    getVehicles,
    getVehiclesById,
}