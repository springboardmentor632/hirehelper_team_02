import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRequest,
  getRequestsForMyTasks,
  getMyRequests,
  updateRequestStatus
} from "../controllers/requestController.js";

const router = express.Router();

   ///CREATE REQUEST
router.post("/", authMiddleware, createRequest);

   //GET REQUESTS RECEIVED (Task Owner)
router.get("/received", authMiddleware, getRequestsForMyTasks);

   //GET MY REQUESTS (Helper)
router.get("/my", authMiddleware, getMyRequests);

  // UPDATE REQUEST STATUS
router.put("/:requestId", authMiddleware, updateRequestStatus);

export default router;
