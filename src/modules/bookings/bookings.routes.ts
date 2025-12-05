import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

// base url /api/v1/bookings

router.post('/',auth('admin','customer'),bookingController.createBooking);


export const bookingRoute = router;