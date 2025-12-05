import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";


const createVehicles = async(req:Request,res:Response) => {
    try{
        const result = await vehiclesService.createVehicles(req.body);
        res.status(201).json({
            status:true,
            message: "Vehicle created successfully",
            data: result?.rows[0],
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getVehicles = 10;


export const vehiclesController = {
    createVehicles,
    getVehicles,
}