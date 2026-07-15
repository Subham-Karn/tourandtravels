import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { changePassword } from "../controllers/authController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("pages/user/profile", {
        user: req.session.user
    });
});

router.get("/change-password", isLoggedIn, (req, res) => {
    res.render("pages/user/change-password", {
        user:req.session.user,
        success: true,
        message: null,
    });
});

router.post("/change-password", isLoggedIn, changePassword);




export default router;
