import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";


const signUp = async(payload: Record<string,unknown>) => {
    const {name , email, password, phone,role } = payload;

    const hashedPass = await bcrypt.hash(password as string , 10);
    // console.log(hashedPass);

    const result = await pool.query(
                `INSERT INTO Users(name,email,password,phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`,[name , email, hashedPass, phone,role]
    );

    

    return result;

};





const signIn = async(payload: Record<string,unknown>) => {
    // console.log("payload is",payload);
    const {email,password} = payload;
    // console.log(email,password);
    
    const result = await pool.query(`SELECT * FROM Users WHERE email=$1`,[email]);
    
    if(result.rows.length === 0){
        return null;
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password as string,user?.password);

    if(!match){
        return false;
    }


    const token = jwt.sign(
        {name: user?.name, email:user?.email, phone: user?.phone, role: user?.role} , config.jwtSecret as string , {
            expiresIn: "10d",
        }
    );


    const {password:pass1, ...user1} =  user;



    return {token , user:user1};
}





export const authServices = {
    signUp,
    signIn,
}
