import express from "express";
import { createEvent, getEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:eventId", getEvent);

export default router;
