import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from '../../middleware/auth'



const router = Router();

// base url /api/v1/vehicles

router.get('/',vehiclesController.getVehicles);

router.get('/:vehicleId',vehiclesController.getVehiclesById);

router.post('/',auth('admin'),vehiclesController.createVehicles);

router.put('/:vehicleId',auth('admin'),vehiclesController.updateVehicleById);






export const vehiclesRoute = router;