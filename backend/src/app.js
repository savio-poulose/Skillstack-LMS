const express = require('express');
const app = express();
const cors = require('cors');
const authRoute = require('./routes/auth.route')
const cookieParser = require("cookie-parser");
// const studentRoute = require('./routes/student.route')
const courseRoutes = require('./routes/course.route')
const enrollmentRoutes = require('./routes/enrollment.route')

const userRoutes = require('./routes/user.routes.js')

const lessonRoutes = require('./routes/lesson.route.js')

const paymentRoutes = require("./routes/payment.route")

const adminRoutes = require("./routes/admin.route.js")
const quizRoutes = require("./routes/quiz.route");
<<<<<<< HEAD
=======
const chatRoutes = require("./routes/chat.route");
>>>>>>> 46684f7 (the quiz is done working on chat)


console.log("app.js ");


//Middlewares
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json())
//Routes

app.use('/api/auth', authRoute);
app.use("/api/courses", courseRoutes);
// app.use('/student',studentRoute);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/users", userRoutes);

app.use("/api", lessonRoutes);

app.use("/api/payments", paymentRoutes);

//admin
app.use("/api/admin", adminRoutes);

//quiz


app.use("/api", quizRoutes);

<<<<<<< HEAD
=======
//chat routes
app.use("/api",chatRoutes);

>>>>>>> 46684f7 (the quiz is done working on chat)





//Test Routes

app.get("/", (req, res) => {
  res.send("LMS API is running");
});

module.exports = app;




