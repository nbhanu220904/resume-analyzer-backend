// routes/resumeRoutes.js
import express from "express";
import multer from "multer";
import {
  analyzeResume,
  getAllResumes,
  getResumeById,
} from "../controllers/resumeController.js";

const router = express.Router();

// Multer setup to save uploaded resumes to "uploads/" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../../sample_data"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Route to upload and analyze resume using Gemini API
router.post("/analyze", upload.single("resume"), analyzeResume);

// Optional routes to fetch historical data
router.get("/", getAllResumes);
router.get("/:id", getResumeById);

export default router;
