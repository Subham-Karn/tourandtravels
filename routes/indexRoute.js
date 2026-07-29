import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
import { changePassword } from "../controllers/authController.js";
import Gallery from "../models/Gallery.js";
import Package from "../models/Packages.js";
import { fetchGallery, createBooking, fetchUserBookings, createInquiry } from "../controllers/adminController.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const galleries = await fetchGallery();
    const packages = await Package.find().sort({ createdAt: -1 });
    res.render("index", { 
        user: req.session.user,  
        galleries,
        packages
    });
});

// Search route - searches both packages and gallery
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.redirect("/");
        }

        const regex = new RegExp(query, "i");

        const packages = await Package.find({
            $or: [
                { packageName: regex },
                { packageDescription: regex }
            ]
        }).sort({ createdAt: -1 });

        const galleries = await Gallery.find({
            status: "Active",
            $or: [
                { galleryName: regex },
                { location: regex },
                { state: regex },
                { country: regex },
                { category: regex },
                { description: regex }
            ]
        }).sort({ createdAt: -1 });

        res.render("pages/user/search", {
            user: req.session.user,
            query,
            packages,
            galleries,
            totalResults: packages.length + galleries.length
        });

    } catch (error) {
        console.log("Search error:", error);
        res.redirect("/");
    }
});

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("pages/user/profile", {
        user: req.session.user
    });
});

router.get("/my-bookings", isLoggedIn, async (req, res) => {
    const bookings = await fetchUserBookings(req.session.user.id);
    res.render("pages/user/my-bookings", {
        user: req.session.user,
        bookings
    });
});

// Package detail page with booking form
router.get("/package/:id", async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).render("404");
        }
        res.render("pages/user/package-details", {
            pkg,
            user: req.session.user
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

router.get("/gallery/:id", async (req, res) => {
    try {

        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).render("404");
        }

        // Get related galleries from the same category
        const related = await Gallery.find({
            category: gallery.category,
            _id: { $ne: gallery._id },
            status: "Active"
        }).limit(4);

        res.render("pages/user/gallery-details", {
            gallery,
            related,
            user: req.session.user,
            currentPath: req.originalUrl
        });

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

// Booking route
router.post("/booking", isLoggedIn, createBooking);

// Contact/Inquiry route
router.post("/contact", createInquiry);

router.get("/change-password", isLoggedIn, (req, res) => {
    res.render("pages/user/change-password", {
        user:req.session.user,
        success: true,
        message: null,
    });
});

router.post("/change-password", isLoggedIn, changePassword);

export default router;