import express from "express";
import { isAdmin, isLoggedIn } from "../middleware/auth.js";
import {
    createGallery,
    fetchGallery,
    fetchUsers,
    getGalleryById,
    updateGallery,
    deleteGallery,
    fetchBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    fetchInquiries,
    getInquiryById,
    updateInquiryStatus,
    deleteInquiry,
    createPackage,
    fetchPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    getDashboardStats
} from "../controllers/adminController.js";
import { normalize } from "../utils/normalize.js";
import { uploadGallery } from "../config/storageConfig.js";
const router = express.Router();

// Dashboard
router.get("/dashboard", isLoggedIn, isAdmin, getDashboardStats);

// Users
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  const { q = "", status = "all" } = req.query;

  const users = await fetchUsers();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !q ||
      normalize(user.fullName).includes(normalize(q)) ||
      normalize(user.email).includes(normalize(q)) ||
      normalize(user.id).includes(normalize(q));

    const matchesRole =
      status === "all" || normalize(user.role) === normalize(status);

    return matchesSearch && matchesRole;
  });

  res.render("pages/admin/users", {
    pageName: "Users",
    users: filteredUsers,
    user: req.session.user,
    q,
    status,
    currentPath: req.originalUrl,
  });
});

// ============= GALLERY CRUD =============

router.get("/gallery", isLoggedIn, isAdmin, async (req, res) => {
    const galleries = await fetchGallery();
  res.render("pages/admin/gallery", {
    pageName: "Gallery",
    user: req.session.user,
    galleries: galleries || [],
    currentPath: req.originalUrl,
  });
});

router.get("/gallery/add", isLoggedIn, isAdmin, (req, res) => {
  res.render("pages/admin/add-gallery", {
    pageName: "Add Gallery",
    user: req.session.user,
    currentPath: req.originalUrl,
    values: {},
    error: null
  });
});

router.post(
  "/gallery/add",
  isLoggedIn,
  isAdmin,
  uploadGallery.single("galleryImage"),
  createGallery,
);

router.get("/gallery/edit/:id", isLoggedIn, isAdmin, getGalleryById);

router.post(
    "/gallery/edit/:id",
    isLoggedIn,
    isAdmin,
    uploadGallery.single("galleryImage"),
    updateGallery
);

router.get("/gallery/delete/:id", isLoggedIn, isAdmin, deleteGallery);

// ============= BOOKINGS CRUD =============

router.get("/bookings", isLoggedIn, isAdmin, async (req, res) => {
  const { q = "", status = "all" } = req.query;
  const bookings = await fetchBookings();

  const filtered = bookings.filter((b) => {
    const matchesSearch = !q || normalize(b.destination).includes(normalize(q));
    const matchesStatus = status === "all" || normalize(b.bookingStatus) === normalize(status);
    return matchesSearch && matchesStatus;
  });

  res.render("pages/admin/bookings", {
    pageName: "Bookings",
    user: req.session.user,
    bookings: filtered,
    q,
    status,
    currentPath: req.originalUrl,
  });
});

router.get("/bookings/:id", isLoggedIn, isAdmin, getBookingById);

router.post("/bookings/status/:id", isLoggedIn, isAdmin, updateBookingStatus);

router.get("/bookings/delete/:id", isLoggedIn, isAdmin, deleteBooking);

// ============= INQUIRIES CRUD =============

router.get("/inquire", isLoggedIn, isAdmin, async (req, res) => {
  const inquiries = await fetchInquiries();
  res.render("pages/admin/inquire", {
    pageName: "Inquire",
    user: req.session.user,
    inquiries,
    currentPath: req.originalUrl,
  });
});

router.get("/inquiries/:id", isLoggedIn, isAdmin, getInquiryById);

router.post("/inquiries/status/:id", isLoggedIn, isAdmin, updateInquiryStatus);

router.get("/inquiries/delete/:id", isLoggedIn, isAdmin, deleteInquiry);

// ============= PACKAGES CRUD =============

router.get("/packages", isLoggedIn, isAdmin, async (req, res) => {
  const packages = await fetchPackages();
  res.render("pages/admin/packages", {
    pageName: "Packages",
    user: req.session.user,
    packages,
    currentPath: req.originalUrl,
  });
});

router.get("/packages/add", isLoggedIn, isAdmin, (req, res) => {
    res.render("pages/admin/add-package", {
        pageName: "Add Package",
        user: req.session.user,
        currentPath: req.originalUrl,
        values: {},
        error: null
    });
});

router.post(
    "/packages/add",
    isLoggedIn,
    isAdmin,
    uploadGallery.single("packageImage"),
    createPackage
);

router.get("/packages/edit/:id", isLoggedIn, isAdmin, getPackageById);

router.post(
    "/packages/edit/:id",
    isLoggedIn,
    isAdmin,
    uploadGallery.single("packageImage"),
    updatePackage
);

router.get("/packages/delete/:id", isLoggedIn, isAdmin, deletePackage);

export default router;