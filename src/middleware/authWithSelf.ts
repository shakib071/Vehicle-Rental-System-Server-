import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const authWithSelf = (...roles:string[]) => {
    return async(req:Request,res:Response,next:NextFunction) => {
        try{
            const token = req.headers.authorization;
            // console.log(token);
            if(!token){
                return res.status(400).json({
                    success:false,
                    message: "bad request",
                    errors:"No authorization token",
                })
            }

            const cleanedToken = token?.split(" ")[1];

            if(!cleanedToken){
                return res.status(400).json({
                    success:false,
                    message: "bad request",
                    errors:"No authorization token",
                })
            }

            const decoded = jwt.verify(
                cleanedToken,
                config.jwtSecret as string
            ) as JwtPayload;


            // console.log("decode is ",{decoded});

            req.user = decoded;

            const userIdFromDatabase = await pool.query("SELECT * FROM Users WHERE id=$1",[req.params?.userId]);
        
            const isSelf = userIdFromDatabase.rows[0]?.email && userIdFromDatabase.rows[0]?.email === decoded?.email;

            // console.log(isSelf);
            

            if(roles.length && !roles.includes(decoded?.role as string) && !isSelf){
                return res.status(401).json({
                    success:false,
                    message: "Unauthorized",
                    errors:"User is not Authorized",
                });
            }

            next();
        }
        catch(err:any){
            res.status(500).json({
                success:false,
                message:err?.message,
            });
        }
    };
};

export default authWithSelf;


