import express from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import movie from "./movie.routes";
import image from "./image.routes";
import list from "./userList.routes";
const router = express.Router();

router.get("/ping", (_, res) => {
    res.status(200).send({
        message: "pong"
    });
});
router.use(auth);
router.use(user);
router.use(movie);
router.use(image);
router.use(list);

export default router;
