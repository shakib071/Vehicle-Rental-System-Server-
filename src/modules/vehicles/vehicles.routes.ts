import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from '../../middleware/auth'



const router = Router();

// base url /api/v1/vehicles

// router.get('/',vehiclesController.getVehicles);

router.post('/',auth('admin'),vehiclesController.createVehicles);






export const vehiclesRoute = router;