import "dotenv/config.js";
import express from "express";
import path from "path";
import connectDb from "./config/dbConfig.js";
import session from "express-session";

// routes config;
import authRoutes from "./routes/authRoutes.js";
import indexRoute from "./routes/indexRoute.js";

// server config.
const PORT = process.env.PORT;
const server = express();
server.use(express.urlencoded({extended:true}));
server.use(express.json());
connectDb();

// public config.
const __dirname = process.cwd();
server.use(express.static(path.join(__dirname , "public")));

// ejs config
server.set("view engine" , "ejs");
server.set("views", path.join(__dirname, "views"));

// session config.
server.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave:false,
    cookie:{maxAge:24*60*60*1000}
}))


//  routes config.
server.use("/" , indexRoute);
server.use("/auth", authRoutes);

// server start
server.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}\n URL: http://localhost:${PORT}`)
})


