import express from "express";
import { forgotPassword, loginUser, logoutUser, resetPassword, signupUser } from "../controllers/authController.js";
import User from "../models/User.js";
const router = express.Router();

router.get("/signup" , (req,res)=>{
    res.render("pages/user/signup" , {
        success:false,
        message:null,
    })
});

router.post("/signup" , signupUser);


router.get("/login" , (req,res)=>{
    res.render("pages/user/login" , {
        success:false,
        message:null,
    })
});

router.post("/login" , loginUser);



router.get("/logout" , logoutUser);



router.get("/reset-password/:token", async (req, res) => {

    const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExpire: {
            $gt: Date.now(),
        },
    });

    if (!user) {
        return res.render("pages/user/reset-password" , {
         token: req.params.token,
          success:false,
          message: "Invalid token or Token is Expired!"
        });
    }

    res.render("pages/user/reset-password", {
        token: req.params.token,
        success:false,
        message: null,
    });

});

router.post("/reset-password/:token", resetPassword);

router.get("/forget-password" , (req, res)=>{
  res.render("pages/user/forgot-password" , {
      success:true,
      message:null,
  })
});

router.post("/forget-password" , forgotPassword);


export default router;