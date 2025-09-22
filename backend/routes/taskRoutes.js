import express from 'express';
import { admin, protect } from '../middlewares/authMiddleware.js';
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

//* Task Management routes 
router.get("/dashboard-data", protect, getDashboardData); // Get dashboard data
router.get("/user-dashboard-data", protect, getUserDashboardData); // Get user-specific dashboard data
router.get("/", protect, getTasks)  // Get all tasks (Admin: all tasks, User: assigned tasks)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, admin, createTask); // Create a new task (Admin only)
router.put("/:id", protect,  updateTask); // Update a task
router.delete("/:id", protect, admin, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect,  updateTaskStatus); // Update task status
router.put("/:id/todo", protect,  updateTaskChecklist); // Update task to-do list

export default router;