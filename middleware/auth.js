import User from "../models/User.js";
import { normalize } from "../utils/normalize.js";


const isLoggedIn = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect("/auth/login");
        }

        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            console.log("User not found or session invalid.");
            req.session.destroy();
            return res.redirect("/auth/login");
        }

        req.user = user;

        next();

    } catch (err) {
        console.error(err);
        return res.status(500).render("error", {
            success: false,
            message: "Internal Server Error"
        });
    }
};


const isAdmin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    if (normalize(req.session?.user?.role) !== "admin") {
        return res.status(403).render("403", {
            success: false,
            message: "Access Denied!"
        });
    }

    next();
};

export {isAdmin , isLoggedIn};