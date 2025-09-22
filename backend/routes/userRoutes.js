import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { getUserById, getUsers } from "../controllers/userController.js";

const router = express.Router();

//* @desc    Get all users (Admin only)
//* @route   GET /api/users
//! @access  Private/Admin
router.get("/", protect, admin, getUsers);

//* @desc    Get a specific user
//* @route   GET /api/users/:id
//! @access  Private
router.get("/:id", protect, getUserById);

export default router;
