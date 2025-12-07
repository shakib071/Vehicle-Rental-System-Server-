import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";


const createVehicles = async(req:Request,res:Response) => {
    try{
        const result = await vehiclesService.createVehicles(req.body);
        res.status(201).json({
            status:true,
            message: "Vehicle created successfully",
            data: result?.rows[0] || [],
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error:'Unexpected server errors'
        });
    }
};


const getVehicles = async(req:Request,res:Response) => {
    
    try{
        const result = await vehiclesService.getVehicles();
        // console.log(result.rows);
        const message = result.rows.length === 0 ? "No vehicles found" : "Vehicle created successfully";
        res.status(200).json({
            status:true,
            message: message,
            data: result?.rows || [],
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error:'Unexpected server errors'
        });
    }

};


const getVehiclesById = async(req:Request,res:Response) => {

    try{
        const result = await vehiclesService.getVehiclesById(req.params.vehicleId!); // treated as definitely a string

        // console.log(result.rows);
        const message = result.rows.length==0 ? "No vehicles found" : "Vehicle created successfully";
        res.status(200).json({
            status:true,
            message: message,
            data: result?.rows[0] || [],
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error:'Unexpected server errors'
        });
    }
};


const updateVehicleById = async(req:Request,res:Response) => {
    try{
        const result:any = await vehiclesService.updateVehicleById(req.body,req.params?.vehicleId!); // treated as definitely a string

        // console.log(result);

        if(!result){
            return res.status(200).json({
                status:false,
                message: "Vehicle not updated",
                error: "No data to Update",
            });
        }
        
        res.status(200).json({
            status:true,
            message: "Vehicle updated successfully",
            data: result.rows[0] || [],
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error:'Unexpected server errors',
        });
    }
};


const deleteVehicleById = async(req:Request,res:Response) => {
    try{
        // check for vehicle active bookings 
        const activeBooking = await vehiclesService.checkActiveBookingByVehicleId(req.params?.vehicleId!);

        if(activeBooking){
            return res.status(403).json({
                success:false,
                message:"Vehicle has active booking so it can't be deleted",
                error:"Vehicle is Forbidden to delete"
            });
        }

        //if no active booking then delete vehicle 
        const result:any = await vehiclesService.deleteVehicleById(req.params?.vehicleId!);
        // console.log(result);
        if (!result || result.rowCount === 0) {
            return res.status(404).json({
                success:false,
                message:"deletion failed",
                error: "vehicle data doesnot exist" 
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};


export const vehiclesController = {
    createVehicles,
    getVehicles,
    getVehiclesById,
    updateVehicleById,
    deleteVehicleById,
}