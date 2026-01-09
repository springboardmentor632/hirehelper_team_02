import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRequest,
  getRequestsForMyTasks,
  getMyRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";

const router = express.Router();

/* =========================
   CREATE REQUEST (Helper)
========================= */
router.post("/", authMiddleware, createRequest);

/* =========================
   GET INCOMING REQUESTS (Owner)
========================= */
router.get("/incoming", authMiddleware, getRequestsForMyTasks);

/* =========================
   GET MY REQUESTS (Helper)
========================= */
router.get("/my", authMiddleware, getMyRequests);

/* =========================
   ACCEPT / REJECT REQUEST
========================= */
router.patch("/:requestId", authMiddleware, updateRequestStatus);

export default router;
