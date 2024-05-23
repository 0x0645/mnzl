import express from "express";
import validateResource from "../middleware/validateResource";
import { createUserHandler, getCurrentUserHandler, } from "../controller/user.controller";

import { createUserSchema, } from "../schema/user.schema";
import requireUser from "../middleware/requireUser";
const router = express.Router();

router.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserHandler
);

router.get("/api/users/me", requireUser, getCurrentUserHandler);
export default router;