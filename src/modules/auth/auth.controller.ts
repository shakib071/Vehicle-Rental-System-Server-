import { Request, Response } from 'express';
import { pool } from "../../config/db";
import { authServices } from './auth.service';

const SignUp = async(req:Request,res:Response)=> {
    

    try{
        // console.log(name , email, password, phone,role);
        const result = await authServices.signUp(req.body);

        res.status(201).json({
            success:true,
            message: "User registered successfully",
            data: result?.rows[0],
        });
    }

    catch(err:any) {
        res.status(500).json({
            success: false,
            message: err?.message,
        });
    }

    
};

export const authController = {
    SignUp,
}