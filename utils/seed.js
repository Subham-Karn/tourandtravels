import "dotenv/config.js";
import connectDb from "../config/dbConfig.js";
import Package from "../models/Packages.js";

const seedPackages = [
    {
        packageName: "Patna City Tour",
        packageImage: "/images/image4.webp",
        packagePrice: 5000,
        packageDescription: "Explore the historic capital of Bihar. Visit Golghar, Patna Museum, Mahatma Gandhi Setu, and enjoy the vibrant local culture. Includes guided tour and hotel pickup.",
        packageRating: 4.5
    },
    {
        packageName: "Bodh Gaya Pilgrimage",
        packageImage: "/images/bhodgaya.jpeg",
        packagePrice: 8000,
        packageDescription: "Visit the sacred Mahabodhi Temple, meditate under the Bodhi Tree, and explore the Tibetan Monastery. A spiritual journey to the place where Buddha attained enlightenment.",
        packageRating: 4.8
    },
    {
        packageName: "Nalanda University Tour",
        packageImage: "/images/glass bridge.jpg",
        packagePrice: 3500,
        packageDescription: "Discover the ancient Nalanda University ruins, one of the world's oldest universities. Visit the Nalanda Archaeological Museum and the Glass Bridge viewpoint.",
        packageRating: 4.3
    },
    {
        packageName: "Sitamarhi Heritage Walk",
        packageImage: "/images/image22.jpeg",
        packagePrice: 3000,
        packageDescription: "Explore the mythological birthplace of Goddess Sita. Visit Janaki Temple, Haleshwar Sthan, and experience the rich cultural heritage of Mithila region.",
        packageRating: 4.0
    },
    {
        packageName: "Monastery Discovery Tour",
        packageImage: "/images/bodhgaya3.jpeg",
        packagePrice: 6000,
        packageDescription: "Visit multiple Buddhist monasteries including Tergar, Karma, and Thai Monastery. Learn about Buddhist culture, meditation, and enjoy peaceful surroundings.",
        packageRating: 4.6
    },
    {
        packageName: "Sasaram Historical Tour",
        packageImage: "/images/sasaram2.jpeg",
        packagePrice: 4000,
        packageDescription: "Explore the tomb of Sher Shah Suri, an architectural marvel. Visit the ancient Ashokan inscriptions and enjoy the scenic beauty of the region.",
        packageRating: 4.2
    }
];

const seed = async () => {
    try {
        await connectDb();
        
        // Check if packages already exist
        const existing = await Package.countDocuments();
        if (existing > 0) {
            console.log(`Packages already exist (${existing}). Skipping seed.`);
            process.exit(0);
        }

        await Package.insertMany(seedPackages);
        console.log(`${seedPackages.length} packages seeded successfully!`);
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seed();