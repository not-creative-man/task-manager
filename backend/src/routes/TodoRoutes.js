import express from "express";
import TodoController from '../controllers/TodoController.js'

const router = express.Router();

router.get("/getUserTasks", TodoController.findAllTasksByUser);
router.post("/changeTaskDone", TodoController.changeTaskDone);
router.get("/getTaskData", TodoController.getTaskData);
router.put("/createTask", TodoController.createTask);
router.post("/updateTask", TodoController.updateTask);
router.post("/deleteTask", TodoController.deleteTask);


export default router;