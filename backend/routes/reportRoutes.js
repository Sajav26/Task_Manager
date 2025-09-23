import express from 'express';
import { admin, protect } from '../middlewares/authMiddleware.js';
import { exportTasksReport, exportUsersReport } from '../controllers/reportController.js';

const router = express.Router();

router.get("/export/tasks", protect, admin, exportTasksReport); // Export all tasks as pdf or excel
router.get("/export/users", protect, admin, exportUsersReport); // Export all user-task report

export default router;