import User from "../models/User.js";
import Gallery from "../models/Gallery.js";
import Booking from "../models/Booking.js";
import Inquire from "../models/Inquire.js";
import Package from "../models/Packages.js";
import fs from "fs";

// ============= USER FUNCTIONS =============

const fetchUsers = async () => {
  try {
    const users = await User.find();
    if (!users) throw new Error("Users not found");
    return users;
  } catch (error) {
    return [];
  }
};

// ============= GALLERY FUNCTIONS =============

const createGallery = async (req, res) => {
  try {
    const {
      galleryName,
      location,
      state,
      country,
      category,
      description,
      bestTimeToVisit,
      openingHours,
      entryFee,
      rating,
      featured,
      status,
    } = req.body;

    // Required Validation
    if (!galleryName || !location || !category || !description) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).render("pages/admin/add-gallery", {
        pageName: "Add Gallery",
        user: req.session.user,
        currentPath: req.originalUrl,   
        error: "Please fill all required fields.",
        values: req.body,
      });
    }

    // Image Validation
    if (!req.file) {
      return res.status(400).render("pages/admin/add-gallery", {
        pageName: "Add Gallery",
        user: req.session.user,
        currentPath: req.originalUrl,   
        error: "Gallery image is required.",
        values: req.body,
      });
    }

    // Duplicate Check
    const existingGallery = await Gallery.findOne({
      galleryName: galleryName.trim(),
      location: location.trim(),
    });

    if (existingGallery) {
      fs.unlinkSync(req.file.path);

      return res.status(409).render("pages/admin/add-gallery", {
        pageName: "Add Gallery",
        user: req.session.user,
        currentPath: req.originalUrl,   
        error: "Gallery already exists.",
        values: req.body,
      });
    }

    await Gallery.create({
      galleryName: galleryName.trim(),
      galleryImage: `/uploads/gallery/${req.file.filename}`,
      location: location.trim(),
      state: state?.trim(),
      country: country?.trim() || "India",
      category,
      description: description.trim(),
      bestTimeToVisit: bestTimeToVisit?.trim(),
      openingHours: openingHours?.trim(),
      entryFee: entryFee?.trim() || "Free",
      rating: Number(rating) || 5,
      featured: featured === "true",
      status: status || "Active",
    });

    return res.redirect("/admin/gallery");

  } catch (error) {
    console.error(error);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    return res.status(500).render("pages/admin/add-gallery", {
      pageName: "Add Gallery",
      user: req.session.user,
      currentPath: req.originalUrl,   
      error: "Something went wrong. Please try again.",
      values: req.body,
    });
  }
};

const fetchGallery = async () => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });
        if (!gallery) throw new Error("Gallery not found");
        return gallery;
    } catch (error) {
        return [];
    }
};

const getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.status(404).render("pages/admin/gallery", {
                pageName: "Gallery",
                user: req.session.user,
                galleries: [],
                currentPath: req.originalUrl,
            });
        }

        res.render("pages/admin/edit-gallery", {
            pageName: "Edit Gallery",
            user: req.session.user,
            currentPath: req.originalUrl,
            values: gallery,
            error: null
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/gallery");
    }
};

const updateGallery = async (req, res) => {
    try {
        const {
            galleryName, location, state, country, category,
            description, bestTimeToVisit, openingHours, entryFee,
            rating, featured, status
        } = req.body;

        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.redirect("/admin/gallery");
        }

        const updateData = {
            galleryName: galleryName.trim(),
            location: location.trim(),
            state: state?.trim(),
            country: country?.trim() || "India",
            category,
            description: description.trim(),
            bestTimeToVisit: bestTimeToVisit?.trim(),
            openingHours: openingHours?.trim(),
            entryFee: entryFee?.trim() || "Free",
            rating: Number(rating) || 5,
            featured: featured === "true",
            status: status || "Active",
        };

        // If new image uploaded
        if (req.file) {
            // Delete old image
            const oldImagePath = gallery.galleryImage;
            if (oldImagePath) {
                const fullPath = "public" + oldImagePath;
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            updateData.galleryImage = `/uploads/gallery/${req.file.filename}`;
        }

        await Gallery.findByIdAndUpdate(req.params.id, updateData);
        return res.redirect("/admin/gallery");

    } catch (error) {
        console.error(error);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(500).render("pages/admin/edit-gallery", {
            pageName: "Edit Gallery",
            user: req.session.user,
            currentPath: req.originalUrl,
            error: "Something went wrong. Please try again.",
            values: req.body,
        });
    }
};

const deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.redirect("/admin/gallery");
        }

        // Delete image file
        const imagePath = gallery.galleryImage;
        if (imagePath) {
            const fullPath = "public" + imagePath;
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        await Gallery.findByIdAndDelete(req.params.id);
        return res.redirect("/admin/gallery");

    } catch (error) {
        console.error(error);
        return res.redirect("/admin/gallery");
    }
};

// ============= BOOKING FUNCTIONS =============

const createBooking = async (req, res) => {
    try {
        const { destination, guests, arrival, leaving } = req.body;
        if (!destination || !guests || !arrival || !leaving) {
            return res.redirect("/");
        }

        await Booking.create({
            userId: req.session.user.id,
            destination: destination.trim(),
            guests: Number(guests),
            arrivalDate: new Date(arrival),
            leavingDate: new Date(leaving),
        });

        return res.redirect("/my-bookings");
    } catch (error) {
        console.error(error);
        return res.redirect("/");
    }
};

const fetchBookings = async () => {
    try {
        const bookings = await Booking.find().populate("userId", "fullName email").sort({ createdAt: -1 });
        return bookings;
    } catch (error) {
        return [];
    }
};

const fetchUserBookings = async (userId) => {
    try {
        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
        return bookings;
    } catch (error) {
        return [];
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("userId", "fullName email phone");
        if (!booking) {
            return res.redirect("/admin/bookings");
        }
        res.render("pages/admin/booking-details", {
            pageName: "Booking Details",
            user: req.session.user,
            booking,
            currentPath: req.originalUrl,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/bookings");
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Booking.findByIdAndUpdate(req.params.id, { bookingStatus: status });
        return res.redirect("/admin/bookings");
    } catch (error) {
        console.error(error);
        return res.redirect("/admin/bookings");
    }
};

const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        return res.redirect("/admin/bookings");
    } catch (error) {
        console.error(error);
        return res.redirect("/admin/bookings");
    }
};

// ============= INQUIRY FUNCTIONS =============

const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !phone || !subject || !message) {
            return res.redirect("/#contact");
        }

        await Inquire.create({
            fullName: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            subject: subject.trim(),
            message: message.trim(),
        });

        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.redirect("/");
    }
};

const fetchInquiries = async () => {
    try {
        const inquiries = await Inquire.find().sort({ createdAt: -1 });
        return inquiries;
    } catch (error) {
        return [];
    }
};

const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquire.findById(req.params.id);
        if (!inquiry) {
            return res.redirect("/admin/inquire");
        }
        res.render("pages/admin/inquiry-details", {
            pageName: "Inquiry Details",
            user: req.session.user,
            inquiry,
            currentPath: req.originalUrl,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/inquire");
    }
};

const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Inquire.findByIdAndUpdate(req.params.id, { status });
        return res.redirect("/admin/inquire");
    } catch (error) {
        console.error(error);
        return res.redirect("/admin/inquire");
    }
};

const deleteInquiry = async (req, res) => {
    try {
        await Inquire.findByIdAndDelete(req.params.id);
        return res.redirect("/admin/inquire");
    } catch (error) {
        console.error(error);
        return res.redirect("/admin/inquire");
    }
};

// ============= PACKAGE FUNCTIONS =============

const createPackage = async (req, res) => {
    try {
        const { packageName, packagePrice, packageDescription, packageRating } = req.body;

        if (!packageName || !packagePrice || !packageDescription || !packageRating) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).render("pages/admin/add-package", {
                pageName: "Add Package",
                user: req.session.user,
                currentPath: req.originalUrl,
                error: "Please fill all required fields.",
                values: req.body,
            });
        }

        if (!req.file) {
            return res.status(400).render("pages/admin/add-package", {
                pageName: "Add Package",
                user: req.session.user,
                currentPath: req.originalUrl,
                error: "Package image is required.",
                values: req.body,
            });
        }

        await Package.create({
            packageName: packageName.trim(),
            packageImage: `/uploads/gallery/${req.file.filename}`,
            packagePrice: Number(packagePrice),
            packageDescription: packageDescription.trim(),
            packageRating: Number(packageRating),
        });

        return res.redirect("/admin/packages");

    } catch (error) {
        console.error(error);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(500).render("pages/admin/add-package", {
            pageName: "Add Package",
            user: req.session.user,
            currentPath: req.originalUrl,
            error: "Something went wrong. Please try again.",
            values: req.body,
        });
    }
};

const fetchPackages = async () => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        return packages;
    } catch (error) {
        return [];
    }
};

const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.redirect("/admin/packages");
        }
        res.render("pages/admin/edit-package", {
            pageName: "Edit Package",
            user: req.session.user,
            currentPath: req.originalUrl,
            values: pkg,
            error: null
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/packages");
    }
};

const updatePackage = async (req, res) => {
    try {
        const { packageName, packagePrice, packageDescription, packageRating } = req.body;
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.redirect("/admin/packages");
        }

        const updateData = {
            packageName: packageName.trim(),
            packagePrice: Number(packagePrice),
            packageDescription: packageDescription.trim(),
            packageRating: Number(packageRating),
        };

        if (req.file) {
            const oldImagePath = pkg.packageImage;
            if (oldImagePath) {
                const fullPath = "public" + oldImagePath;
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            updateData.packageImage = `/uploads/gallery/${req.file.filename}`;
        }

        await Package.findByIdAndUpdate(req.params.id, updateData);
        return res.redirect("/admin/packages");

    } catch (error) {
        console.error(error);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        return res.status(500).render("pages/admin/edit-package", {
            pageName: "Edit Package",
            user: req.session.user,
            currentPath: req.originalUrl,
            error: "Something went wrong.",
            values: req.body,
        });
    }
};

const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg && pkg.packageImage) {
            const fullPath = "public" + pkg.packageImage;
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        await Package.findByIdAndDelete(req.params.id);
        return res.redirect("/admin/packages");
    } catch (error) {
        console.error(error);
        return res.redirect("/admin/packages");
    }
};

// ============= DASHBOARD STATS =============

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalPackages = await Package.countDocuments();
        const totalInquiries = await Inquire.countDocuments();

        const recentBookings = await Booking.find()
            .populate("userId", "fullName")
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("pages/admin/dashboard", {
            pageName: "Dashboard",
            user: req.session.user,
            currentPath: req.originalUrl,
            totalUsers,
            totalBookings,
            totalPackages,
            totalInquiries,
            recentBookings
        });
    } catch (error) {
        console.error(error);
        res.render("pages/admin/dashboard", {
            pageName: "Dashboard",
            user: req.session.user,
            currentPath: req.originalUrl,
            totalUsers: 0,
            totalBookings: 0,
            totalPackages: 0,
            totalInquiries: 0,
            recentBookings: []
        });
    }
};

export {
    fetchUsers,
    createGallery,
    fetchGallery,
    getGalleryById,
    updateGallery,
    deleteGallery,
    createBooking,
    fetchBookings,
    fetchUserBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    createInquiry,
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
};