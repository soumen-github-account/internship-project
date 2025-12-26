import 'dotenv/config'
import express from "express"
import session from "express-session";
import passport from "passport";
import './config/passport.js'
import { connectDb } from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import userRouter from './routes/userRoutes.js';
import companyRouter from './routes/companyRoute.js';
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "Lax",
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
connectDb();
app.use("/uploads", express.static("uploads"));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/company", companyRouter);

app.get('/login', (req, res) => {
  res.render('auth/UserLogin'); 
});

app.get('/sign-up', (req, res) => {
  res.render('auth/UserSignUp'); 
});

app.get('/company/login', (req, res) => {
  res.render('companyView/companyLogin'); 
});

app.get('/company/sign-up', (req, res) => {
  res.render('companyView/companySignUp'); 
});

app.use("/auth", authRoutes);
app.use("/api/user", userRouter);
app.listen(4000, () => console.log("Server running"));
