import express from "express";
import HealthController from "../controllers/HealthController.js";

const router = express.Router();
router.get("/", HealthController.check);

export default router;

//module.exports = router;