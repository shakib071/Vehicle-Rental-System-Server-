import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { pool } from "../../config/db";
import { error } from "console";



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
};

const getBooking = async(req:Request,res:Response) => {
    
    try{
        const bookings = await bookingService.getBooking(req?.user?.role,req?.user?.email);

        
        const message = req?.user?.role === 'customer' ? 'Your bookings retrieved successfully' : 'Bookings retrieved successfully'; 
        res.status(200).json({
            success:true,
            message: message,
            data: bookings
        });
    }
    
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateBooking = async(req:Request,res:Response) => {
    try{
        // console.log(req?.params?.bookingId);
        

        if(req?.user?.role==='customer' && req?.body?.status === "cancelled"){
            const userId:any = await bookingService.getUserIdFromEmail(req?.user?.email);
            // console.log(userId?.id);
            
            if(!userId?.id){
                return  res.status(404).json({
                    success: false,
                    message: "no user found",
                    error: "not a valid user"
                });
            }

            const result = await bookingService.cancelBooking(req?.params?.bookingId!,userId?.id);

            if(!result){
                return res.status(200).json({
                    success: false,
                    message: "No booking available to cancel",
                    error: "Need valid bookingId or valid User"
                });
            }

            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result
            });
        }

        else if(req?.user?.role==='admin' && req?.body?.status === "returned"){
            const result = await bookingService.markBookingsReturnedByAdmin(req?.params?.bookingId!);

            if(result.length === 0){
                return res.status(200).json({
                    success: false,
                    message: "No booking available to cancel",
                    error: "Need valid bookingId or valid User"
                });
            }

            res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result
            });
        }

        else{
            res.status(401).json({
                success: true,
                message: "Booking update Unsuccessfull",
                error:"Unauthorized request"
            });
        }
       



        
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



export const bookingController = {
    createBooking,
    getBooking,
    updateBooking,
}

