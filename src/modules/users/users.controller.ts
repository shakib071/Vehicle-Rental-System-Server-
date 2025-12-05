import { Request, Response } from "express";
import { usersService } from "./users.service";


const getAllUser = async(req:Request,res:Response) => {
    try{

        const result = await usersService.getAllUser();

        // console.log(result.rows);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



const updateUserById = async(req:Request,res:Response) => {

    try{
 
        const result = await usersService.updateUserById(req.body,req.params.userId!); //treated as definitely a string

        // console.log(result?.rows);

        if(!result){
            return res.status(200).json({
                status:false,
                message: "User not updated",
                error: "No user data to Update",
            });
        }
        
        const {password:pass , ...updatedResult} = result.rows[0];
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: updatedResult
        });

    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};


const deleteUserById = async(req:Request,res:Response) => {

    try{
        
        const result = await usersService.deleteUserById(req.params.userId!) ; //treated as definitely a string

        // console.log(result);

        if(result == 'isActive'){
            return res.status(404).json({
                success:false,
                message:"deletion failed",
                error: "active booking exist" 
            });
        }

        if (!result || result.rowCount === 0) {
            return res.status(404).json({
                success:false,
                message:"deletion failed",
                error: "user data doesnot exist" 
            });
        }

        res.status(200).json({
            success:true,
            message: "User deleted successfully"
        })
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};


export const usersController = {
    getAllUser,
    updateUserById,
    deleteUserById,
}

