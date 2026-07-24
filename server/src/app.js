require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const errorHandler = require("./interfaces/http/middlewares/errorHandler");
const authenticateMiddleware = require("./interfaces/http/middlewares/authenticate");
const authorizeMiddleware = require("./interfaces/http/middlewares/authorize");
const createAuthRoutes = require("./interfaces/http/routes/authRoutes");

function createApp(container) {
  const app = express();

  // Parse CLIENT_URL and log for debugging
  const allowedOrigins =
    typeof config.clientUrl === "string"
      ? config.clientUrl.split(",").map((url) => url.trim())
      : config.clientUrl;

  console.log("[CORS] Allowed Origins:", JSON.stringify(allowedOrigins));
  console.log("[CORS] Environment:", config.env);

  // Middlewares - CORS MUST be before helmet to ensure headers are set
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Length", "Authorization"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );
  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));

  // Inject dependencies into auth middleware
  const authenticate = authenticateMiddleware(container.tokenService);
  const authorize = authorizeMiddleware;

  // Routes
  const authRoutes = createAuthRoutes(
    container.authController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/auth", authRoutes);

  // Courses
  const createCourseRoutes = require("./interfaces/http/routes/courseRoutes");
  const courseRoutes = createCourseRoutes(
    container.courseController,
    authenticate,
    authorize,
    container.lessonController,
  );
  app.use("/api/v1/courses", courseRoutes);

  const createLessonRoutes = require("./interfaces/http/routes/lessonRoutes");
  const lessonRoutes = createLessonRoutes(
    container.lessonController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/lessons", lessonRoutes);

  const createBlogRoutes = require("./interfaces/http/routes/blogRoutes");
  const blogRoutes = createBlogRoutes(
    container.blogController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/blog", blogRoutes);

  const createEnrollmentRoutes = require("./interfaces/http/routes/enrollmentRoutes");
  const enrollmentRoutes = createEnrollmentRoutes(
    container.enrollmentController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/enrollments", enrollmentRoutes);
  app.get(
    "/api/v1/users/me/courses",
    authenticate,
    container.enrollmentController.getUserEnrollments,
  );

  const createMeetingRoutes = require("./interfaces/http/routes/meetingRoutes");
  const meetingRoutes = createMeetingRoutes(
    container.meetingController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/meetings", meetingRoutes);

  const createChatRoutes = require("./interfaces/http/routes/chatRoutes");
  const chatRoutes = createChatRoutes(
    container.chatController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/chat", chatRoutes);

  const createNotificationRoutes = require("./interfaces/http/routes/notificationRoutes");
  const notificationRoutes = createNotificationRoutes(
    container.notificationController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/notifications", notificationRoutes);

  const createDashboardRoutes = require("./interfaces/http/routes/dashboardRoutes");
  const dashboardRoutes = createDashboardRoutes(
    container.dashboardController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/dashboard", dashboardRoutes);

  const createAnalyticsRoutes = require("./interfaces/http/routes/analyticsRoutes");
  const analyticsRoutes = createAnalyticsRoutes(
    container.analyticsController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/analytics", analyticsRoutes);

  const createReportRoutes = require("./interfaces/http/routes/reportRoutes");
  const reportRoutes = createReportRoutes(
    container.reportController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/reports", reportRoutes);

  const createPaymentRoutes = require("./interfaces/http/routes/paymentRoutes");
  const paymentRoutes = createPaymentRoutes(
    container.paymentController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/payments", paymentRoutes);

  const createCertificateRoutes = require("./interfaces/http/routes/certificateRoutes");
  const certificateRoutes = createCertificateRoutes(
    container.certificateController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/certificates", certificateRoutes);

  const createProfileRoutes = require("./interfaces/http/routes/profileRoutes");
  const profileRoutes = createProfileRoutes(
    container.profileController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/profile", profileRoutes);

  const createSettingsRoutes = require("./interfaces/http/routes/settingsRoutes");
  const settingsRoutes = createSettingsRoutes(
    container.settingsController,
    authenticate,
    authorize,
  );
  app.use("/api/v1/settings", settingsRoutes);

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  // Global Error Handler (must be last)
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
