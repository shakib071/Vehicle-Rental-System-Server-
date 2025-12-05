import { Request, Response } from "express";
import { bookingService } from "./booking.service";



const createBooking = async(req:Request,res:Response) => {

    try{

        const result = await bookingService.createBooking(req.body);

        // console.log(result?.result.rows[0],result?.changeVehicleStatus.rows[0]);

        if(!result){
            return res.status(404).json({
                success:false,
                message:"Vehicle Unavailable"
            });
        }

        const data = result?.result.rows[0];
        data.vehicle = {
            vehicle_name: result?.changeVehicleStatus?.rows[0]?.vehicle_name,
            daily_rent_price: result?.changeVehicleStatus?.rows[0]?.daily_rent_price,
        }

        // console.log(data);

        res.status(201).json({
            success:true,
            message: "Booking created successfully",
            data: data
        })
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}



export const bookingController = {
    createBooking,
}

