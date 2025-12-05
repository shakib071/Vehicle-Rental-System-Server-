import { pool } from "../../config/db";

const createVehicles = async(payload: Record<string,unknown>) => {

    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;

    const result = await pool.query(
        `INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING*`,[vehicle_name,type,registration_number,daily_rent_price,availability_status]
    );

    return result;
};

const getVehicles = async() => {
    
    const result = await pool.query(
        `SELECT * FROM Vehicles`
    );
    return result;
};


const getVehiclesById = async(id:string) => {
    const result = await pool.query(
        `SELECT * FROM Vehicles WHERE id = $1`,[id]
    );
    return result;
};

const updateVehicleById = async(payload:Record<string,unknown>,id:string) => {

    const vehicle = await pool.query(`SELECT * FROM Vehicles WHERE id=$1 `,[id]);

    // console.log(vehicle);

    if(vehicle.rows.length === 0) return null;

    const keys = Object.keys(payload);
    const values = Object.values(payload);

    if(keys.length === 0) return null;

    //vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
    const setClause = keys.map((key,index) => `${key}=$${index+1}`).join(", ");

    const query = `Update Vehicles SET ${setClause} WHERE id=$${keys.length + 1} RETURNING*`;


    const result = await pool.query(query,[...values,id]);

    

    return result;
};


const deleteVehicleById = async(id:string) => {

    const vehicle = await pool.query(`SELECT * FROM Vehicles WHERE id=$1 `,[id]);

    if(vehicle.rows.length === 0) return null;

    const result = await pool.query("DELETE FROM Vehicles WHERE id=$1 RETURNING *",[id]);

    return result;
}


export const vehiclesService = {
    createVehicles,
    getVehicles,
    getVehiclesById,
    updateVehicleById,
    deleteVehicleById,
}