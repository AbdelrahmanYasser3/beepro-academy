const { getPrismaClient } = require("./infrastructure/database/prismaClient");
const config = require("./config");

// Repositories
const PrismaUserRepository = require("./infrastructure/database/repositories/PrismaUserRepository");
const PrismaTokenRepository = require("./infrastructure/database/repositories/PrismaTokenRepository");
const SupabaseCourseRepository = require("./infrastructure/database/repositories/SupabaseCourseRepository");
const SupabaseMeetingRepository = require("./infrastructure/database/repositories/SupabaseMeetingRepository");
const SupabaseChatRepository = require("./infrastructure/database/repositories/SupabaseChatRepository");
const SupabaseNotificationRepository = require("./infrastructure/database/repositories/SupabaseNotificationRepository");
const SupabaseDashboardRepository = require("./infrastructure/database/repositories/SupabaseDashboardRepository");
const SupabaseAnalyticsRepository = require("./infrastructure/database/repositories/SupabaseAnalyticsRepository");
const SupabaseReportRepository = require("./infrastructure/database/repositories/SupabaseReportRepository");
const SupabasePaymentRepository = require("./infrastructure/database/repositories/SupabasePaymentRepository");
const SupabaseCertificateRepository = require("./infrastructure/database/repositories/SupabaseCertificateRepository");
const SupabaseProfileRepository = require("./infrastructure/database/repositories/SupabaseProfileRepository");
const SupabaseSettingsRepository = require("./infrastructure/database/repositories/SupabaseSettingsRepository");

// Services
const BcryptHashService = require("./infrastructure/security/BcryptHashService");
const JwtTokenService = require("./infrastructure/security/JwtTokenService");
const EmailService = require("./infrastructure/services/EmailService");
const GoogleOAuthService = require("./infrastructure/services/GoogleOAuthService");

// Use Cases
const RegisterUseCase = require("./application/use-cases/Authenticatioon/RegisterUseCase");
const LoginUseCase = require("./application/use-cases/Authenticatioon/LoginUseCase");
const LogoutUseCase = require("./application/use-cases/Authenticatioon/LogoutUseCase");
const RefreshTokenUseCase = require("./application/use-cases/Authenticatioon/RefreshTokenUseCase");
const ForgotPasswordUseCase = require("./application/use-cases/Authenticatioon/ForgotPasswordUseCase");
const ResetPasswordUseCase = require("./application/use-cases/Authenticatioon/ResetPasswordUseCase");
const GetProfileUseCase = require("./application/use-cases/Authenticatioon/GetProfileUseCase");
const UpdateProfileUseCase = require("./application/use-cases/Authenticatioon/UpdateProfileUseCase");
const GoogleOAuthUseCase = require("./application/use-cases/Authenticatioon/GoogleOAuthUseCase");

// Controllers
const AuthController = require("./interfaces/http/controllers/AuthController");

/**
 * Dependency Injection Container
 * Initializes and wires all application components together.
 */
function createContainer() {
  const prisma = getPrismaClient();

  // 1. Init Repositories
  const userRepository = new PrismaUserRepository({ prisma });
  const tokenRepository = new PrismaTokenRepository({ prisma });

  // 2. Init Services
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService({ config });
  const emailService = new EmailService({ config });
  const googleOAuthService = new GoogleOAuthService({ config });

  // 3. Init Use Cases
  const registerUseCase = new RegisterUseCase({
    userRepository,
    tokenRepository,
    hashService,
    tokenService,
  });
  const loginUseCase = new LoginUseCase({
    userRepository,
    tokenRepository,
    hashService,
    tokenService,
  });
  const logoutUseCase = new LogoutUseCase({ tokenRepository });
  const refreshTokenUseCase = new RefreshTokenUseCase({
    userRepository,
    tokenRepository,
    tokenService,
  });
  const forgotPasswordUseCase = new ForgotPasswordUseCase({
    userRepository,
    hashService,
    emailService,
    config,
  });
  const resetPasswordUseCase = new ResetPasswordUseCase({
    userRepository,
    tokenRepository,
    hashService,
  });
  const getProfileUseCase = new GetProfileUseCase({ userRepository });
  const updateProfileUseCase = new UpdateProfileUseCase({ userRepository });
  // Course repository/use-cases
  const courseRepository = new SupabaseCourseRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const listCoursesUseCase =
    new (require("./application/use-cases/Courses/ListCoursesUseCase"))({
      courseRepository,
    });
  const getCourseUseCase =
    new (require("./application/use-cases/Courses/GetCourseUseCase"))({
      courseRepository,
    });
  const createCourseUseCase =
    new (require("./application/use-cases/Courses/CreateCourseUseCase"))({
      courseRepository,
    });
  const updateCourseUseCase =
    new (require("./application/use-cases/Courses/UpdateCourseUseCase"))({
      courseRepository,
    });
  const deleteCourseUseCase =
    new (require("./application/use-cases/Courses/DeleteCourseUseCase"))({
      courseRepository,
    });

  // Blog repository/use-cases
  const SupabaseBlogRepository = require("./infrastructure/database/repositories/SupabaseBlogRepository");
  const blogRepository = new SupabaseBlogRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const listPublishedPostsUseCase =
    new (require("./application/use-cases/Blog/ListPublishedPostsUseCase"))({
      blogRepository,
    });
  const listAdminPostsUseCase =
    new (require("./application/use-cases/Blog/ListAdminPostsUseCase"))({
      blogRepository,
    });
  const createPostUseCase =
    new (require("./application/use-cases/Blog/CreatePostUseCase"))({
      blogRepository,
    });
  const updatePostUseCase =
    new (require("./application/use-cases/Blog/UpdatePostUseCase"))({
      blogRepository,
    });
  const deletePostUseCase =
    new (require("./application/use-cases/Blog/DeletePostUseCase"))({
      blogRepository,
    });

  // Enrollment repository/use-cases
  const SupabaseEnrollmentRepository = require("./infrastructure/database/repositories/SupabaseEnrollmentRepository");
  const enrollmentRepository = new SupabaseEnrollmentRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const enrollInCourseUseCase =
    new (require("./application/use-cases/Enrollments/EnrollInCourseUseCase"))({
      enrollmentRepository,
    });
  const getUserEnrollmentsUseCase =
    new (require("./application/use-cases/Enrollments/GetUserEnrollmentsUseCase"))(
      { enrollmentRepository },
    );
  const isEnrolledUseCase =
    new (require("./application/use-cases/Enrollments/IsEnrolledUseCase"))({
      enrollmentRepository,
    });
  const updateProgressUseCase =
    new (require("./application/use-cases/Enrollments/UpdateProgressUseCase"))({
      enrollmentRepository,
    });
  const deleteEnrollmentUseCase =
    new (require("./application/use-cases/Enrollments/DeleteEnrollmentUseCase"))(
      {
        enrollmentRepository,
      },
    );

  // Lesson repository/use-cases
  const SupabaseLessonRepository = require("./infrastructure/database/repositories/SupabaseLessonRepository");
  const lessonRepository = new SupabaseLessonRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const listLessonsUseCase =
    new (require("./application/use-cases/Lessons/ListLessonsByCourseUseCase"))(
      { lessonRepository },
    );
  const getLessonUseCase =
    new (require("./application/use-cases/Lessons/GetLessonUseCase"))({
      lessonRepository,
    });
  const createLessonUseCase =
    new (require("./application/use-cases/Lessons/CreateLessonUseCase"))({
      lessonRepository,
    });
  const updateLessonUseCase =
    new (require("./application/use-cases/Lessons/UpdateLessonUseCase"))({
      lessonRepository,
    });
  const deleteLessonUseCase =
    new (require("./application/use-cases/Lessons/DeleteLessonUseCase"))({
      lessonRepository,
    });
  const googleOAuthUseCase = new GoogleOAuthUseCase({
    userRepository,
    tokenRepository,
    tokenService,
    googleOAuthService,
  });

  const meetingRepository = new SupabaseMeetingRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const chatRepository = new SupabaseChatRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const notificationRepository = new SupabaseNotificationRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const dashboardRepository = new SupabaseDashboardRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const analyticsRepository = new SupabaseAnalyticsRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const reportRepository = new SupabaseReportRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const paymentRepository = new SupabasePaymentRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const certificateRepository = new SupabaseCertificateRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const profileRepository = new SupabaseProfileRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });
  const settingsRepository = new SupabaseSettingsRepository({
    supabase: require("./infrastructure/supabaseClient"),
  });

  const {
    ListMeetingsUseCase,
    GetMeetingUseCase,
    CreateMeetingUseCase,
    UpdateMeetingUseCase,
    DeleteMeetingUseCase,
  } = require("./application/use-cases/Meetings/MeetingUseCases");
  const {
    ListChatMessagesUseCase,
    GetChatMessageUseCase,
    CreateChatMessageUseCase,
    UpdateChatMessageUseCase,
    DeleteChatMessageUseCase,
  } = require("./application/use-cases/Chat/ChatUseCases");
  const {
    ListNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    DeleteNotificationUseCase,
  } = require("./application/use-cases/Notifications/NotificationUseCases");
  const {
    GetStudentDashboardUseCase,
    GetTeacherDashboardUseCase,
    GetAdminDashboardUseCase,
  } = require("./application/use-cases/Dashboard/DashboardUseCases");
  const {
    GetCourseAnalyticsUseCase,
    GetTeacherAnalyticsUseCase,
    GetAdminAnalyticsUseCase,
  } = require("./application/use-cases/Analytics/AnalyticsUseCases");
  const {
    ListReportsUseCase,
    GetReportUseCase,
    ExportReportUseCase,
  } = require("./application/use-cases/Reports/ReportUseCases");
  const {
    ListPaymentsUseCase,
    GetPaymentUseCase,
    GetPaymentHistoryUseCase,
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
  } = require("./application/use-cases/Payments/PaymentUseCases");
  const {
    ListCertificatesUseCase,
    GetCertificateUseCase,
    GenerateCertificateUseCase,
  } = require("./application/use-cases/Certificates/CertificateUseCases");
  const {
    GetProfileUseCase: GetModuleProfileUseCase,
    UpdateProfileUseCase: UpdateModuleProfileUseCase,
    UpdateAvatarUseCase,
    UpdatePasswordUseCase,
  } = require("./application/use-cases/Profile/ProfileUseCases");
  const {
    GetSettingsUseCase,
    UpdateSettingsUseCase,
  } = require("./application/use-cases/Settings/SettingsUseCases");

  const listMeetingsUseCase = new ListMeetingsUseCase({ meetingRepository });
  const getMeetingUseCase = new GetMeetingUseCase({ meetingRepository });
  const createMeetingUseCase = new CreateMeetingUseCase({ meetingRepository });
  const updateMeetingUseCase = new UpdateMeetingUseCase({ meetingRepository });
  const deleteMeetingUseCase = new DeleteMeetingUseCase({ meetingRepository });
  const listChatMessagesUseCase = new ListChatMessagesUseCase({
    chatRepository,
  });
  const getChatMessageUseCase = new GetChatMessageUseCase({ chatRepository });
  const createChatMessageUseCase = new CreateChatMessageUseCase({
    chatRepository,
  });
  const updateChatMessageUseCase = new UpdateChatMessageUseCase({
    chatRepository,
  });
  const deleteChatMessageUseCase = new DeleteChatMessageUseCase({
    chatRepository,
  });
  const listNotificationsUseCase = new ListNotificationsUseCase({
    notificationRepository,
  });
  const markNotificationReadUseCase = new MarkNotificationReadUseCase({
    notificationRepository,
  });
  const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase({
    notificationRepository,
  });
  const deleteNotificationUseCase = new DeleteNotificationUseCase({
    notificationRepository,
  });
  const getStudentDashboardUseCase = new GetStudentDashboardUseCase({
    dashboardRepository,
  });
  const getTeacherDashboardUseCase = new GetTeacherDashboardUseCase({
    dashboardRepository,
  });
  const getAdminDashboardUseCase = new GetAdminDashboardUseCase({
    dashboardRepository,
  });
  const getCourseAnalyticsUseCase = new GetCourseAnalyticsUseCase({
    analyticsRepository,
  });
  const getTeacherAnalyticsUseCase = new GetTeacherAnalyticsUseCase({
    analyticsRepository,
  });
  const getAdminAnalyticsUseCase = new GetAdminAnalyticsUseCase({
    analyticsRepository,
  });
  const listReportsUseCase = new ListReportsUseCase({ reportRepository });
  const getReportUseCase = new GetReportUseCase({ reportRepository });
  const exportReportUseCase = new ExportReportUseCase({ reportRepository });
  const listPaymentsUseCase = new ListPaymentsUseCase({ paymentRepository });
  const getPaymentUseCase = new GetPaymentUseCase({ paymentRepository });
  const getPaymentHistoryUseCase = new GetPaymentHistoryUseCase({
    paymentRepository,
  });
  const createPaymentUseCase = new CreatePaymentUseCase({ paymentRepository });
  const updatePaymentUseCase = new UpdatePaymentUseCase({ paymentRepository });
  const listCertificatesUseCase = new ListCertificatesUseCase({
    certificateRepository,
  });
  const getCertificateUseCase = new GetCertificateUseCase({
    certificateRepository,
  });
  const generateCertificateUseCase = new GenerateCertificateUseCase({
    certificateRepository,
  });
  const getProfileUseCaseForModule = new GetModuleProfileUseCase({
    profileRepository,
  });
  const updateProfileUseCaseForModule = new UpdateModuleProfileUseCase({
    profileRepository,
  });
  const updateAvatarUseCase = new UpdateAvatarUseCase({ profileRepository });
  const updatePasswordUseCase = new UpdatePasswordUseCase({
    profileRepository,
    hashService,
  });
  const getSettingsUseCase = new GetSettingsUseCase({ settingsRepository });
  const updateSettingsUseCase = new UpdateSettingsUseCase({
    settingsRepository,
  });

  // 4. Init Controllers
  const authController = new AuthController({
    registerUseCase,
    loginUseCase,
    logoutUseCase,
    refreshTokenUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    getProfileUseCase,
    updateProfileUseCase,
    googleOAuthUseCase,
  });
  const EnrollmentController = require("./interfaces/http/controllers/EnrollmentController");
  const enrollmentController = new EnrollmentController({
    enrollUseCase: enrollInCourseUseCase,
    getUseCase: getUserEnrollmentsUseCase,
    isEnrolledUseCase: isEnrolledUseCase,
    updateProgressUseCase: updateProgressUseCase,
    deleteUseCase: deleteEnrollmentUseCase,
  });

  const CourseController = require("./interfaces/http/controllers/CourseController");
  const courseController = new CourseController({
    listUseCase: listCoursesUseCase,
    getUseCase: getCourseUseCase,
    createUseCase: createCourseUseCase,
    updateUseCase: updateCourseUseCase,
    deleteUseCase: deleteCourseUseCase,
  });
  const LessonController = require("./interfaces/http/controllers/LessonController");
  const lessonController = new LessonController({
    listUseCase: listLessonsUseCase,
    getUseCase: getLessonUseCase,
    createUseCase: createLessonUseCase,
    updateUseCase: updateLessonUseCase,
    deleteUseCase: deleteLessonUseCase,
  });
  const BlogController = require("./interfaces/http/controllers/BlogController");
  const blogController = new BlogController({
    listPublishedUseCase: listPublishedPostsUseCase,
    listAdminUseCase: listAdminPostsUseCase,
    createUseCase: createPostUseCase,
    updateUseCase: updatePostUseCase,
    deleteUseCase: deletePostUseCase,
  });

  const MeetingController = require("./interfaces/http/controllers/MeetingController");
  const meetingController = new MeetingController({
    listUseCase: listMeetingsUseCase,
    getUseCase: getMeetingUseCase,
    createUseCase: createMeetingUseCase,
    updateUseCase: updateMeetingUseCase,
    deleteUseCase: deleteMeetingUseCase,
  });

  const ChatController = require("./interfaces/http/controllers/ChatController");
  const chatController = new ChatController({
    listUseCase: listChatMessagesUseCase,
    getUseCase: getChatMessageUseCase,
    createUseCase: createChatMessageUseCase,
    updateUseCase: updateChatMessageUseCase,
    deleteUseCase: deleteChatMessageUseCase,
  });

  const NotificationController = require("./interfaces/http/controllers/NotificationController");
  const notificationController = new NotificationController({
    listUseCase: listNotificationsUseCase,
    markReadUseCase: markNotificationReadUseCase,
    markAllReadUseCase: markAllNotificationsReadUseCase,
    deleteUseCase: deleteNotificationUseCase,
  });

  const DashboardController = require("./interfaces/http/controllers/DashboardController");
  const dashboardController = new DashboardController({
    studentUseCase: getStudentDashboardUseCase,
    teacherUseCase: getTeacherDashboardUseCase,
    adminUseCase: getAdminDashboardUseCase,
  });

  const AnalyticsController = require("./interfaces/http/controllers/AnalyticsController");
  const analyticsController = new AnalyticsController({
    courseUseCase: getCourseAnalyticsUseCase,
    teacherUseCase: getTeacherAnalyticsUseCase,
    adminUseCase: getAdminAnalyticsUseCase,
  });

  const ReportController = require("./interfaces/http/controllers/ReportController");
  const reportController = new ReportController({
    listUseCase: listReportsUseCase,
    getUseCase: getReportUseCase,
    exportUseCase: exportReportUseCase,
  });

  const PaymentController = require("./interfaces/http/controllers/PaymentController");
  const paymentController = new PaymentController({
    listUseCase: listPaymentsUseCase,
    getUseCase: getPaymentUseCase,
    historyUseCase: getPaymentHistoryUseCase,
    createUseCase: createPaymentUseCase,
    updateUseCase: updatePaymentUseCase,
  });

  const CertificateController = require("./interfaces/http/controllers/CertificateController");
  const certificateController = new CertificateController({
    listUseCase: listCertificatesUseCase,
    getUseCase: getCertificateUseCase,
    generateUseCase: generateCertificateUseCase,
  });

  const ProfileController = require("./interfaces/http/controllers/ProfileController");
  const profileController = new ProfileController({
    getUseCase: getProfileUseCaseForModule,
    updateUseCase: updateProfileUseCaseForModule,
    updateAvatarUseCase: updateAvatarUseCase,
    updatePasswordUseCase: updatePasswordUseCase,
  });

  const SettingsController = require("./interfaces/http/controllers/SettingsController");
  const settingsController = new SettingsController({
    getUseCase: getSettingsUseCase,
    updateUseCase: updateSettingsUseCase,
  });

  return {
    prisma,
    tokenService,
    authController,
    courseController,
    lessonController,
    blogController,
    enrollmentController,
    meetingController,
    chatController,
    notificationController,
    dashboardController,
    analyticsController,
    reportController,
    paymentController,
    certificateController,
    profileController,
    settingsController,
  };
}

module.exports = createContainer;
