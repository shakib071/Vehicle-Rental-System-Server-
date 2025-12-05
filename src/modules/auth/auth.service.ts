import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


const signUp = async(payload: Record<string,unknown>) => {
    const {name , email, password, phone,role } = payload;

    const hashedPass = await bcrypt.hash(password as string , 10);
    console.log(hashedPass);

    const result = await pool.query(
                `INSERT INTO Users(name,email,password,phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`,[name , email, hashedPass, phone,role]
    );

    

    return result;

};

export const authServices = {
    signUp,
}
