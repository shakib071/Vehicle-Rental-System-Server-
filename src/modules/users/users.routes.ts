import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";
import authWithSelf from "../../middleware/authWithSelf";


const router = Router();

//base url /api/v1/users

router.get('/',auth('admin'),usersController.getAllUser);

router.put('/:userId',authWithSelf('admin'),usersController.updateUserById);

router.delete('/:userId',auth('admin'),usersController.deleteUserById);

export const usersRoute = router;