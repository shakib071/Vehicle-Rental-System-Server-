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

const getVehicles = async(req:Request,res:Response) => {
    
    try{
        const result = await vehiclesService.getVehicles();
        // console.log(result.rows);
        const message = result.rows ? "No vehicles found" : "Vehicle created successfully";
        res.status(200).json({
            status:true,
            message: message,
            data: result?.rows,
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};


const getVehiclesById = async(req:Request,res:Response) => {

    try{
        const result = await vehiclesService.getVehiclesById(req.params.vehicleId!); // treated as definitely a string

        // console.log(result.rows);
        const message = result.rows ? "No vehicles found" : "Vehicle created successfully";
        res.status(200).json({
            status:true,
            message: message,
            data: result?.rows[0] || [],
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


export const vehiclesController = {
    createVehicles,
    getVehicles,
    getVehiclesById,
}