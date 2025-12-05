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
            data: {
                id:result?.rows[0]?.id,
                name:result?.rows[0]?.name,
                email:result?.rows[0]?.email,
                phone:result?.rows[0]?.phone,
                role:result?.rows[0]?.role,
            },
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