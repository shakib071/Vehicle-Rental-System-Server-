import { pool } from "../../config/db"


const getAllUser = async() => {

    const result = await pool.query("SELECT * FROM Users");
    return result;

}

const updateUserById = async(payload:Record<string,unknown>,id:string) => {

    const user = await pool.query("SELECT * FROM Users WHERE id=$1",[id]);
    // console.log(user.rows);

    if(user.rows.length === 0) return null;


    const keys = Object.keys(payload);
    const values = Object.values(payload);

    if(keys.length === 0) return null;

    //vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
    const setClause = keys.map((key,index) => `${key}=$${index+1}`).join(", ");

    const query = `Update Users SET ${setClause} WHERE id=$${keys.length + 1} RETURNING*`;


    const result = await pool.query(query,[...values,id]);

    return result;
}

export const usersService = {
    getAllUser,
    updateUserById,
}