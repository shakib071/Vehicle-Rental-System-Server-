import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles:string[]) => {
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

            if(roles.length && !roles.includes(decoded?.role as string)){
                return res.status(401).json({
                    success:false,
                    message: "Unauthorized",
                    errors:"User is not Authrized",
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

export default auth;


