import { Router } from "express";
import  verifyJWT  from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.use(verifyJWT);
router.route("/create").post(createOrder);

export default router;
