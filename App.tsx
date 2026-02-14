


import React, { useState, useContext, createContext, PropsWithChildren, useEffect } from 'react';
// FIX: Corrected import path for react-router-dom.
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase, type User, type Session } from './supabase';
import { ThemeProvider } from './components/ThemeProvider';
import { CartProvider } from './components/CartContext';
import GoogleAnalyticsTracker from './components/GoogleAnalyticsTracker';

// Import UserProfile type
import { UserProfile, School } from './db';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import SettingsPage from './pages/SettingsPage';
import CRMPage from './pages/CRMPage';
import IntegrationsPage from './pages/IntegrationsPage';
import HRMPage from './pages/HRMPage';
import AccountingPage from './pages/AccountingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PricingPage from './pages/PricingPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import ModulesPage from './pages/ModulesPage';
import VersionsPage from './pages/VersionsPage';
import WhyAcadeemiaPage from './pages/WhyAcadeemiaPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import CareersPage from './pages/CareersPage';
import AffiliatePicksPage from './pages/AffiliatePicksPage';
import HelpCenterPage from './pages/HelpCenterPage';
import CurrencyManagementPage from './pages/CurrencyManagementPage';
import DemoPage from './pages/DemoPage';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import StoreAuthPage from './pages/StoreAuthPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import FAQsPage from './pages/FAQsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import SuperAdminLandingPage from './pages/SuperAdminLandingPage';
import PesaPalCheckoutPage from './pages/PesaPalCheckoutPage';
import PolarCheckoutPage from './pages/PolarCheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import MailboxPage from './pages/MailboxPage';

// Inventory Pages
import ProductPage from './pages/inventory/ProductPage';
import CategoryPageInv from './pages/inventory/CategoryPage';
import StorePageInv from './pages/inventory/StorePage';
import SupplierPage from './pages/inventory/SupplierPage';
import UnitPage from './pages/inventory/UnitPage';
import PurchasePage from './pages/inventory/PurchasePage';
import SalesPage from './pages/inventory/SalesPage';
import IssuePage from './pages/inventory/IssuePage';
import SchoolPage from './pages/SchoolPage';

// Subscription Pages
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import PendingRequestPage from './pages/subscription/PendingRequestPage';
import CustomDomainPage from './pages/subscription/CustomDomainPage';
import PlanPage from './pages/subscription/PlanPage';
import SubscriptionSettingsPage from './pages/subscription/SubscriptionSettingsPage';
import TransactionsPage from './pages/subscription/TransactionsPage';
import OfflinePaymentsPage from './pages/subscription/OfflinePaymentsPage';
import AddonManagerPage from './pages/AddonManagerPage';

// System Settings Pages
import GlobalSettingsPage from './pages/system-settings/GlobalSettingsPage';
import SchoolSettingsPage from './pages/system-settings/SchoolSettingsPage';
import SchoolConfigurationPage from './pages/system-settings/SchoolConfigurationPage';
import RolePermissionPage from './pages/system-settings/RolePermissionPage';
import RolePermissionsAssignmentPage from './pages/system-settings/RolePermissionsAssignmentPage';
import SessionSettingsPage from './pages/system-settings/SessionSettingsPage';
import ModulesSettingsPage from './pages/system-settings/ModulesSettingsPage';
import SystemStudentFieldPage from './pages/system-settings/SystemStudentFieldPage';
import CustomFieldPage from './pages/system-settings/CustomFieldPage';
import DatabaseBackupPage from './pages/system-settings/DatabaseBackupPage';
import SystemUpdatePage from './pages/system-settings/SystemUpdatePage';
import UserLoginLogPage from './pages/system-settings/UserLoginLogPage';

// Forms Manager Pages
import ContactUsSubmissionsPage from './pages/forms-manager/ContactUsSubmissionsPage';
import DemoRequestsPage from './pages/forms-manager/DemoRequestsPage';
import NewsletterSubscribersPage from './pages/forms-manager/NewsletterSubscribersPage';

// 2FA Security Pages
import My2FASetupPage from './pages/security/My2FASetupPage';
import TwoFASettingsPage from './pages/security/SettingsPage';

// Frontend CMS Pages
import FrontendSettingPage from './pages/frontend/SettingPage';
import FrontendMenuPage from './pages/frontend/MenuPage';
import FrontendPageSectionPage from './pages/frontend/PageSectionPage';
import FrontendManagePagePage from './pages/frontend/ManagePagePage';
import FrontendSliderPage from './pages/frontend/SliderPage';
import FrontendFeaturesPage from './pages/frontend/FeaturesPage';
import FrontendTestimonialPage from './pages/frontend/TestimonialPage';
import FrontendServicePage from './pages/frontend/ServicePage';
import FrontendFaqPage from './pages/frontend/FaqPage';
import FrontendGalleryCategoryPage from './pages/frontend/GalleryCategoryPage';
import FrontendGalleryPage from './pages/frontend/GalleryPage';
import MSPPage from './pages/MSPPage';

// Reception Pages
import AdmissionEnquiryPage from './pages/reception/AdmissionEnquiryPage';
import AdmissionEnquiryDetailsPage from './pages/reception/AdmissionEnquiryDetailsPage';
import PostalRecordPage from './pages/reception/PostalRecordPage';
import CallLogPage from './pages/reception/CallLogPage';
import VisitorLogPage from './pages/reception/VisitorLogPage';
import ComplaintPage from './pages/reception/ComplaintPage';
import ConfigReceptionPage from './pages/reception/ConfigReceptionPage';

// Admission Pages
import CreateAdmissionPage from './pages/admission/CreateAdmissionPage';
import OnlineAdmissionPage from './pages/admission/OnlineAdmissionPage';
import MultiClassStudentPage from './pages/admission/MultiClassStudentPage';
import MultipleImportPage from './pages/admission/MultipleImportPage';
import CategoryPage from './pages/admission/CategoryPage';

// Alumni Pages
import ManageAlumniPage from './pages/alumni/ManageAlumniPage';
import AlumniEventsPage from './pages/alumni/AlumniEventsPage';

// New Student Detail Pages (repurposed)
import LoginDeactivatePage from './pages/system-settings/TranslationsPage';
import DeactivateReasonPage from './pages/system-settings/CronJobPage';

// New Parent Pages
import ParentsListPage from './pages/parents/ParentsListPage';
import AddParentPage from './pages/parents/AddParentPage';
import ParentLoginDeactivatePage from './pages/parents/LoginDeactivatePage';
import ParentProfilePage from './pages/parents/ParentProfilePage';

// Fees Page
import InvoiceHistoryPage from './pages/fees/InvoiceHistoryPage';

// Employee Pages
import EmployeeListPage from './pages/employee/EmployeeListPage';
import DepartmentPage from './pages/employee/DepartmentPage';
import DesignationPage from './pages/employee/DesignationPage';
import AddEmployeePage from './pages/employee/AddEmployeePage';
import EmployeeLoginDeactivatePage from './pages/employee/LoginDeactivatePage';

// Card Management Pages
import IDCardTemplatePage from './pages/card-management/IDCardTemplatePage';
import StudentIDCardPage from './pages/card-management/StudentIDCardPage';
import EmployeeIDCardPage from './pages/card-management/EmployeeIDCardPage';
import AdmitCardTemplatePage from './pages/card-management/AdmitCardTemplatePage';
import GenerateAdmitCardPage from './pages/card-management/GenerateAdmitCardPage';

// Certificate Pages
import CertificateTemplatePage from './pages/certificate/CertificateTemplatePage';
import GenerateStudentCertificatePage from './pages/certificate/GenerateStudentCertificatePage';
import GenerateEmployeeCertificatePage from './pages/certificate/GenerateEmployeeCertificatePage';

// Live Class Pages
import LiveClassPage from './pages/live-class/LiveClassPage';
import LiveClassReportsPage from './pages/live-class/LiveClassReportsPage';

// Attachment Pages
import UploadContentPage from './pages/attachments/UploadContentPage';
import AttachmentTypePage from './pages/attachments/AttachmentTypePage';

// Homework Pages
import HomeworkPage from './pages/homework/HomeworkPage';
import EvaluationReportPage from './pages/homework/EvaluationReportPage';

// Exam Master Pages
import ExamPage from './pages/exam-master/ExamPage';
import ExamSchedulePage from './pages/exam-master/ExamSchedulePage';
import MarksPage from './pages/exam-master/MarksPage';

// Online Exam Pages
import OnlineExamPage from './pages/online-exam/OnlineExamPage';
import QuestionBankPage from './pages/online-exam/QuestionBankPage';
import QuestionGroupPage from './pages/online-exam/QuestionGroupPage';
import PositionGeneratePage from './pages/online-exam/PositionGeneratePage';
import ExamResultPage from './pages/online-exam/ExamResultPage';

// Supervision Pages
import HostelSupervisionPage from './pages/supervision/HostelPage';
import TransportSupervisionPage from './pages/supervision/TransportPage';

// Payroll Pages
import SalaryTemplatePage from './pages/payroll/SalaryTemplatePage';
import SalaryAssignPage from './pages/payroll/SalaryAssignPage';
import SalaryPaymentPage from './pages/payroll/SalaryPaymentPage';

// Advance Salary Pages
import AdvanceSalaryApplyPage from './pages/advance-salary/ApplyPage';
import AdvanceSalaryManagePage from './pages/advance-salary/ManagePage';
import AdvanceSalaryRequestPage from './pages/advance-salary/RequestPage';

// Leave Pages
import LeaveCategoryPage from './pages/leave/CategoryPage';
import LeaveMyApplyPage from './pages/leave/MyApplyPage';
import LeaveRequestPage from './pages/leave/RequestPage';
import LeaveManagePage from './pages/leave/ManagePage';

// Award Pages
import AwardPage from './pages/award/AwardPage';

// Attendance Pages
import StudentAttendancePage from './pages/attendance/StudentAttendancePage';
import SubjectWiseAttendancePage from './pages/attendance/SubjectWiseAttendancePage';
import EmployeeAttendancePage from './pages/attendance/EmployeeAttendancePage';
import ExamAttendancePage from './pages/attendance/ExamAttendancePage';

// QR Code Attendance Pages
import QrCodeAttendancePage from './pages/qr-code-attendance/AttendancePage';
import QrCodeSettingsPage from './pages/qr-code-attendance/SettingsPage';
import QrCodeStudentReportsPage from './pages/qr-code-attendance/reports/StudentReportsByDatePage';
import QrCodeEmployeeReportsPage from './pages/qr-code-attendance/reports/EmployeeReportsByDatePage';

// Library Pages
import BooksPage from './pages/library/BooksPage';
import BooksCategoryPage from './pages/library/BooksCategoryPage';
import MyIssuedBookPage from './pages/library/MyIssuedBookPage';
import BookIssueReturnPage from './pages/library/BookIssueReturnPage';

// Events Pages
import EventTypePage from './pages/events/EventTypePage';
import EventsPage from './pages/events/EventsPage';

// Bulk SMS and Email Pages
import SendSmsEmailPage from './pages/bulk-sms-email/SendSmsEmailPage';
import SmsEmailReportPage from './pages/bulk-sms-email/SmsEmailReportPage';
import SmsTemplatePage from './pages/bulk-sms-email/SmsTemplatePage';
import EmailTemplatePage from './pages/bulk-sms-email/EmailTemplatePage';
import StudentBirthdayWishesPage from './pages/bulk-sms-email/StudentBirthdayWishesPage';
import StaffBirthdayWishesPage from './pages/bulk-sms-email/StaffBirthdayWishesPage';

// Student Accounting Pages
import PaymentsTypePage from './pages/student-accounting/offline-payments/PaymentsTypePage';
import OfflinePaymentsAccPage from './pages/student-accounting/offline-payments/OfflinePaymentsPage';
import FeesTypePage from './pages/student-accounting/FeesTypePage';
import FeesGroupPage from './pages/student-accounting/FeesGroupPage';
import FineSetupPage from './pages/student-accounting/FineSetupPage';
import FeesAllocationPage from './pages/student-accounting/FeesAllocationPage';
import FeesPayInvoicePage from './pages/student-accounting/FeesPayInvoicePage';
import DueFeesInvoicePage from './pages/student-accounting/DueFeesInvoicePage';
import FeesReminderPage from './pages/student-accounting/FeesReminderPage';

// Office Accounting Pages
import AccountPageOA from './pages/office-accounting/AccountPage';
import NewDepositPage from './pages/office-accounting/NewDepositPage';
import NewExpensePage from './pages/office-accounting/NewExpensePage';
import AllTransactionsPage from './pages/office-accounting/AllTransactionsPage';
import VoucherHeadPage from './pages/office-accounting/VoucherHeadPage';

// Reports Pages
import StudentReportsMainPage from './pages/reports/student-reports/StudentReportsPage';
import LoginCredentialPage from './pages/reports/student-reports/LoginCredentialPage';
import AdmissionReportPage from './pages/reports/student-reports/AdmissionReportPage';
import ClassSectionReportPage from './pages/reports/student-reports/ClassSectionReportPage';
import SiblingReportPage from './pages/reports/student-reports/SiblingReportPage';
import FeesReportPage from './pages/reports/fees-reports/FeesReportPage';
import ReceiptsReportPage from './pages/reports/fees-reports/ReceiptsReportPage';
import DueFeesReportPage from './pages/reports/fees-reports/DueFeesReportPage';
import FineReportPage from './pages/reports/fees-reports/FineReportPage';
import AccountStatementPage from './pages/reports/financial-reports/AccountStatementPage';
import IncomeReportsPage from './pages/reports/financial-reports/IncomeReportsPage';
import ExpenseReportsPage from './pages/reports/financial-reports/ExpenseReportsPage';
import TransactionsReportsPage from './pages/reports/financial-reports/TransactionsReportsPage';
import BalanceSheetPage from './pages/reports/financial-reports/BalanceSheetPage';
import IncomeVsExpensePage from './pages/reports/financial-reports/IncomeVsExpensePage';
import AttendanceStudentReportsPage from './pages/reports/attendance-reports/StudentReportsPage';
import StudentDailyReportsPage from './pages/reports/attendance-reports/StudentDailyReportsPage';
import StudentOverviewReportsPage from './pages/reports/attendance-reports/StudentOverviewReportsPage';
import SubjectWiseReportsPage from './pages/reports/attendance-reports/SubjectWiseReportsPage';
import SubjectWiseByDayPage from './pages/reports/attendance-reports/SubjectWiseByDayPage';
import SubjectWiseByMonthPage from './pages/reports/attendance-reports/SubjectWiseByMonthPage';
import AttendanceEmployeeReportsPage from './pages/reports/attendance-reports/EmployeeReportsPage';
import AttendanceExamReportsPage from './pages/reports/attendance-reports/ExamReportsPage';
import PayrollSummaryPage from './pages/reports/hr-reports/PayrollSummaryPage';
import LeaveReportsPage from './pages/reports/hr-reports/LeaveReportsPage';
import ReportCardPage from './pages/reports/examination-reports/ReportCardPage';
import TabulationSheetPage from './pages/reports/examination-reports/TabulationSheetPage';
import ProgressReportsPage from './pages/reports/examination-reports/ProgressReportsPage';
import StockReportPage from './pages/reports/inventory-reports/StockReportPage';
import PurchaseReportPage from './pages/reports/inventory-reports/PurchaseReportPage';
import SalesReportPage from './pages/reports/inventory-reports/SalesReportPage';
import IssuesReportPage from './pages/reports/inventory-reports/IssuesReportPage';

// Academic Pages
import ControlClassesPage from './pages/academic/ControlClassesPage';
import AssignClassTeacherPage from './pages/academic/AssignClassTeacherPage';
import SubjectPage from './pages/academic/SubjectPage';
import ClassAssignPage from './pages/academic/ClassAssignPage';
import ClassSchedulePage from './pages/academic/ClassSchedulePage';
import TeacherSchedulePage from './pages/academic/TeacherSchedulePage';
import PromotionPage from './pages/academic/PromotionPage';

// Careers/ATS Pages
import CareersManagementPage from './pages/company/CareersManagementPage';
import JobPostingFormPage from './pages/company/JobPostingFormPage';
import ApplicationsManagementPage from './pages/company/ApplicationsManagementPage';
import InterviewSchedulingPage from './pages/company/InterviewSchedulingPage';
import CareersAnalyticsDashboardPage from './pages/company/CareersAnalyticsDashboardPage';
import AffiliateToolsPage from './pages/company/AffiliateToolsPage';
import CMSManagementPage from './pages/company/CMSManagementPage';

// Blog Manager Pages
import BlogManagerDashboardPage from './pages/company/BlogManagerDashboardPage';
import BlogPostsPage from './pages/company/BlogPostsPage';
import BlogPostEditorPage from './pages/company/BlogPostEditorPage';
import BlogCategoriesTagsPage from './pages/company/BlogCategoriesTagsPage';
import BlogCommentsPage from './pages/company/BlogCommentsPage';


// 1. Authentication Context with Profile
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  school: School | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionData = async (session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            let { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            // Handle profile creation if it doesn't exist.
            if (profileError && profileError.code === 'PGRST116') {
                const { data: newProfile, error: upsertError } = await supabase
                    .from('user_profiles')
                    .upsert({ 
                        id: currentUser.id, 
                        role: 'Super Admin', 
                        full_name: currentUser.user_metadata?.full_name || currentUser.email,
                        school_id: null 
                    }, { onConflict: 'id' })
                    .select().single();
                if (upsertError) {
                    console.error("Error creating default user profile:", upsertError.message);
                    profileData = null;
                } else {
                    profileData = newProfile;
                }
            } else if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
                profileData = null;
            }
    
            const currentProfile = profileData as UserProfile | null;
            setProfile(currentProfile);

            if (currentProfile?.role === 'Super Admin') {
                sessionStorage.setItem('adminView', 'company');
            } else {
                sessionStorage.removeItem('adminView');
            }
    
            // Fetch school if school_id exists on profile
            if (currentProfile && currentProfile.school_id) {
              let { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('id', currentProfile.school_id)
                .single();
              
              if (schoolError) {
                console.error("Error fetching school details:", schoolError.message);
                setSchool(null);
              } else {
                setSchool(schoolData as School);
              }
            } else {
              setSchool(null);
            }
    
        } else {
            // Clear profile and school on logout
            setProfile(null);
            setSchool(null);
            sessionStorage.removeItem('adminView');
        }
    };

    // Listen for auth state changes. This is the single source of truth.
    // It fires once on initial load and again on any auth event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
            await getSessionData(session);
            setLoading(false); // Set loading to false after the first check completes.
        }
    );

    return () => {
        subscription?.unsubscribe();
    };
  }, []);

  const value = { user, profile, school, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 2. Protected Route Component with Role-Based Access Control
const ProtectedRoute: React.FC<PropsWithChildren<{ allowedRoles: string[] }>> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background dark:bg-gray-900">
        <div className="text-xl font-semibold text-text-primary dark:text-gray-100">Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    // User is logged in but doesn't have permission for this route
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Component
function App() {
  // Define roles for better management
  const SUPER_ADMIN = ['Super Admin'];
  const SCHOOL_ADMIN = ['Super Admin', 'School Admin'];
  const SCHOOL_STAFF_BASE = ['Teacher', 'Accountant', 'Librarian', 'Receptionist'];
  const SCHOOL_STAFF = ['Super Admin', 'School Admin', ...SCHOOL_STAFF_BASE];
  const ALL_AUTHENTICATED = [...new Set(['Super Admin', ...SCHOOL_STAFF])];

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <GoogleAnalyticsTracker />
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/versions" element={<VersionsPage />} />
              <Route path="/why-acadeemia" element={<WhyAcadeemiaPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/affiliate-picks" element={<AffiliatePicksPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/msp" element={<MSPPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
              <Route path="/pesapal-checkout" element={<PesaPalCheckoutPage />} />
              <Route path="/polar-checkout" element={<PolarCheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/store-auth" element={<StoreAuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Store Checkout Flow */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />


              {/* Protected Routes with RBAC */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><DashboardPage /></ProtectedRoute>} />
              <Route path="/school/:schoolId/dashboard" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><DashboardPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><SettingsPage /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentsPage /></ProtectedRoute>} />
              <Route path="/student/profile/:studentId" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentProfilePage /></ProtectedRoute>} />
              
              {/* Attendance Routes */}
              <Route path="/attendance/student" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentAttendancePage /></ProtectedRoute>} />
              <Route path="/attendance/subject-wise" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SubjectWiseAttendancePage /></ProtectedRoute>} />
              <Route path="/attendance/employee" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EmployeeAttendancePage /></ProtectedRoute>} />
              <Route path="/attendance/exam" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ExamAttendancePage /></ProtectedRoute>} />
              
              {/* QR Code Attendance Routes */}
              <Route path="/qr-code-attendance/attendance" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QrCodeAttendancePage /></ProtectedRoute>} />
              <Route path="/qr-code-attendance/settings" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QrCodeSettingsPage /></ProtectedRoute>} />
              <Route path="/qr-code-attendance/reports/student" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QrCodeStudentReportsPage /></ProtectedRoute>} />
              <Route path="/qr-code-attendance/reports/employee" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QrCodeEmployeeReportsPage /></ProtectedRoute>} />

              {/* Library Routes */}
              <Route path="/library/books" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><BooksPage /></ProtectedRoute>} />
              <Route path="/library/books-category" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><BooksCategoryPage /></ProtectedRoute>} />
              <Route path="/library/my-issued-book" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><MyIssuedBookPage /></ProtectedRoute>} />
              <Route path="/library/book-issue-return" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><BookIssueReturnPage /></ProtectedRoute>} />
              
              {/* Events Routes */}
              <Route path="/events/type" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EventTypePage /></ProtectedRoute>} />
              <Route path="/events/main" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EventsPage /></ProtectedRoute>} />

              {/* Bulk SMS and Email Routes */}
              <Route path="/bulk-sms-email/send" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SendSmsEmailPage /></ProtectedRoute>} />
              <Route path="/bulk-sms-email/report" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SmsEmailReportPage /></ProtectedRoute>} />
              <Route path="/bulk-sms-email/sms-template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SmsTemplatePage /></ProtectedRoute>} />
              <Route path="/bulk-sms-email/email-template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EmailTemplatePage /></ProtectedRoute>} />
              <Route path="/bulk-sms-email/student-birthday" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentBirthdayWishesPage /></ProtectedRoute>} />
              <Route path="/bulk-sms-email/staff-birthday" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StaffBirthdayWishesPage /></ProtectedRoute>} />
              
              {/* Student Accounting Routes */}
              <Route path="/student-accounting/offline-payments/type" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PaymentsTypePage /></ProtectedRoute>} />
              <Route path="/student-accounting/offline-payments/main" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><OfflinePaymentsAccPage /></ProtectedRoute>} />
              <Route path="/student-accounting/fees-type" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesTypePage /></ProtectedRoute>} />
              <Route path="/student-accounting/fees-group" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesGroupPage /></ProtectedRoute>} />
              <Route path="/student-accounting/fine-setup" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FineSetupPage /></ProtectedRoute>} />
              <Route path="/student-accounting/fees-allocation" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesAllocationPage /></ProtectedRoute>} />
              <Route path="/student-accounting/pay-invoice" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesPayInvoicePage /></ProtectedRoute>} />
              <Route path="/student-accounting/due-invoice" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><DueFeesInvoicePage /></ProtectedRoute>} />
              <Route path="/student-accounting/fees-reminder" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesReminderPage /></ProtectedRoute>} />

              {/* Office Accounting Routes */}
              <Route path="/office-accounting/account" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AccountPageOA /></ProtectedRoute>} />
              <Route path="/office-accounting/new-deposit" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><NewDepositPage /></ProtectedRoute>} />
              <Route path="/office-accounting/new-expense" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><NewExpensePage /></ProtectedRoute>} />
              <Route path="/office-accounting/all-transactions" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AllTransactionsPage /></ProtectedRoute>} />
              <Route path="/office-accounting/voucher-head" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><VoucherHeadPage /></ProtectedRoute>} />

              {/* Reports Routes */}
              <Route path="/reports/student-reports/student" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentReportsMainPage /></ProtectedRoute>} />
              <Route path="/reports/student-reports/login-credential" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LoginCredentialPage /></ProtectedRoute>} />
              <Route path="/reports/student-reports/admission" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdmissionReportPage /></ProtectedRoute>} />
              <Route path="/reports/student-reports/class-section" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ClassSectionReportPage /></ProtectedRoute>} />
              <Route path="/reports/student-reports/sibling" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SiblingReportPage /></ProtectedRoute>} />
              <Route path="/reports/fees-reports/fees" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FeesReportPage /></ProtectedRoute>} />
              <Route path="/reports/fees-reports/receipts" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ReceiptsReportPage /></ProtectedRoute>} />
              <Route path="/reports/fees-reports/due-fees" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><DueFeesReportPage /></ProtectedRoute>} />
              <Route path="/reports/fees-reports/fine" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><FineReportPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/account-statement" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AccountStatementPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/income" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><IncomeReportsPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/expense" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ExpenseReportsPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/transactions" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><TransactionsReportsPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/balance-sheet" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><BalanceSheetPage /></ProtectedRoute>} />
              <Route path="/reports/financial-reports/income-vs-expense" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><IncomeVsExpensePage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/student" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AttendanceStudentReportsPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/student-daily" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentDailyReportsPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/student-overview" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentOverviewReportsPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/subject-wise" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SubjectWiseReportsPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/subject-wise-day" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SubjectWiseByDayPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/subject-wise-month" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SubjectWiseByMonthPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/employee" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AttendanceEmployeeReportsPage /></ProtectedRoute>} />
              <Route path="/reports/attendance-reports/exam" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AttendanceExamReportsPage /></ProtectedRoute>} />
              <Route path="/reports/hr-reports/payroll-summary" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PayrollSummaryPage /></ProtectedRoute>} />
              <Route path="/reports/hr-reports/leave" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LeaveReportsPage /></ProtectedRoute>} />
              <Route path="/reports/examination-reports/report-card" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ReportCardPage /></ProtectedRoute>} />
              <Route path="/reports/examination-reports/tabulation-sheet" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><TabulationSheetPage /></ProtectedRoute>} />
              <Route path="/reports/examination-reports/progress" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ProgressReportsPage /></ProtectedRoute>} />
              <Route path="/reports/inventory-reports/stock" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StockReportPage /></ProtectedRoute>} />
              <Route path="/reports/inventory-reports/purchase" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PurchaseReportPage /></ProtectedRoute>} />
              <Route path="/reports/inventory-reports/sales" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SalesReportPage /></ProtectedRoute>} />
              <Route path="/reports/inventory-reports/issues" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><IssuesReportPage /></ProtectedRoute>} />
              
              {/* Super Admin Only Routes */}
              <Route path="/admin-home" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SuperAdminLandingPage /></ProtectedRoute>} />
              <Route path="/company-dashboard" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CompanyDashboardPage /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CRMPage /></ProtectedRoute>} />
              <Route path="/integrations" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><IntegrationsPage /></ProtectedRoute>} />
              <Route path="/accounting" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><AccountingPage /></ProtectedRoute>} />
              <Route path="/currency-management" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CurrencyManagementPage /></ProtectedRoute>} />
              <Route path="/forms-manager/contact-us" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><ContactUsSubmissionsPage /></ProtectedRoute>} />
              <Route path="/forms-manager/demo-requests" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><DemoRequestsPage /></ProtectedRoute>} />
              <Route path="/forms-manager/newsletter" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><NewsletterSubscribersPage /></ProtectedRoute>} />

              {/* Careers/ATS Routes (Super Admin Only) */}
              <Route path="/company/careers" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CareersManagementPage /></ProtectedRoute>} />
              <Route path="/company/careers/new" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><JobPostingFormPage /></ProtectedRoute>} />
              <Route path="/company/careers/jobs/:jobId/edit" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><JobPostingFormPage /></ProtectedRoute>} />
              <Route path="/company/careers/jobs/:jobId/applications" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><ApplicationsManagementPage /></ProtectedRoute>} />
              <Route path="/company/careers/applications/:applicationId/interview" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><InterviewSchedulingPage /></ProtectedRoute>} />
              <Route path="/company/careers/analytics" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CareersAnalyticsDashboardPage /></ProtectedRoute>} />
              <Route path="/company/affiliate-tools" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><AffiliateToolsPage /></ProtectedRoute>} />
              <Route path="/company/cms" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CMSManagementPage /></ProtectedRoute>} />

              {/* School System Routes (Accessible to both Super Admins and School Staff) */}
              <Route path="/school" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><SchoolPage /></ProtectedRoute>} />
              <Route path="/addon-manager" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><AddonManagerPage /></ProtectedRoute>} />

              {/* Admission Routes */}
              <Route path="/admission/create" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><CreateAdmissionPage /></ProtectedRoute>} />
              <Route path="/admission/online" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><OnlineAdmissionPage /></ProtectedRoute>} />
              <Route path="/admission/multi-class" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><MultiClassStudentPage /></ProtectedRoute>} />
              <Route path="/admission/multiple-import" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><MultipleImportPage /></ProtectedRoute>} />
              <Route path="/admission/category" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><CategoryPage /></ProtectedRoute>} />

              {/* Student Details Routes */}
              <Route path="/student/login-deactivate" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LoginDeactivatePage /></ProtectedRoute>} />
              <Route path="/student/deactivate-reason" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><DeactivateReasonPage /></ProtectedRoute>} />

              {/* Parent Routes */}
              <Route path="/parents/list" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ParentsListPage /></ProtectedRoute>} />
              <Route path="/parents/add" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AddParentPage /></ProtectedRoute>} />
              <Route path="/parents/profile/:parentId" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ParentProfilePage /></ProtectedRoute>} />
              <Route path="/parents/login-deactivate" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ParentLoginDeactivatePage /></ProtectedRoute>} />
              
              {/* Employee Routes */}
              <Route path="/employee/list" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EmployeeListPage /></ProtectedRoute>} />
              <Route path="/employee/department" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><DepartmentPage /></ProtectedRoute>} />
              <Route path="/employee/designation" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><DesignationPage /></ProtectedRoute>} />
              <Route path="/employee/add" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AddEmployeePage /></ProtectedRoute>} />
              <Route path="/employee/login-deactivate" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EmployeeLoginDeactivatePage /></ProtectedRoute>} />
              
              {/* Card Management Routes */}
              <Route path="/card-management/id-card-template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><IDCardTemplatePage /></ProtectedRoute>} />
              <Route path="/card-management/student-id-card" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StudentIDCardPage /></ProtectedRoute>} />
              <Route path="/card-management/employee-id-card" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EmployeeIDCardPage /></ProtectedRoute>} />
              <Route path="/card-management/admit-card-template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdmitCardTemplatePage /></ProtectedRoute>} />
              <Route path="/card-management/generate-admit-card" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><GenerateAdmitCardPage /></ProtectedRoute>} />

              {/* Certificate Management Routes */}
              <Route path="/certificate/template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><CertificateTemplatePage /></ProtectedRoute>} />
              <Route path="/certificate/generate-student" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><GenerateStudentCertificatePage /></ProtectedRoute>} />
              <Route path="/certificate/generate-employee" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><GenerateEmployeeCertificatePage /></ProtectedRoute>} />

              {/* Live Class Routes */}
              <Route path="/live-class/main" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LiveClassPage /></ProtectedRoute>} />
              <Route path="/live-class/reports" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LiveClassReportsPage /></ProtectedRoute>} />

              {/* Attachment Routes */}
              <Route path="/attachments/upload" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><UploadContentPage /></ProtectedRoute>} />
              <Route path="/attachments/type" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AttachmentTypePage /></ProtectedRoute>} />
              
              {/* Homework Routes */}
              <Route path="/homework/main" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><HomeworkPage /></ProtectedRoute>} />
              <Route path="/homework/evaluation-report" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><EvaluationReportPage /></ProtectedRoute>} />

              {/* Exam Master Routes */}
              <Route path="/exam-master/exam" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ExamPage /></ProtectedRoute>} />
              <Route path="/exam-master/exam-schedule" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ExamSchedulePage /></ProtectedRoute>} />
              <Route path="/exam-master/marks" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><MarksPage /></ProtectedRoute>} />

              {/* Online Exam Routes */}
              <Route path="/online-exam/main" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><OnlineExamPage /></ProtectedRoute>} />
              <Route path="/online-exam/question-bank" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QuestionBankPage /></ProtectedRoute>} />
              <Route path="/online-exam/question-group" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><QuestionGroupPage /></ProtectedRoute>} />
              <Route path="/online-exam/position-generate" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PositionGeneratePage /></ProtectedRoute>} />
              <Route path="/online-exam/exam-result" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ExamResultPage /></ProtectedRoute>} />

              {/* Supervision Routes */}
              <Route path="/supervision/hostel" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><HostelSupervisionPage /></ProtectedRoute>} />
              <Route path="/supervision/transport" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><TransportSupervisionPage /></ProtectedRoute>} />

              {/* Academic Routes */}
              <Route path="/academic/control-classes" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ControlClassesPage /></ProtectedRoute>} />
              <Route path="/academic/assign-class-teacher" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AssignClassTeacherPage /></ProtectedRoute>} />
              <Route path="/academic/subject" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SubjectPage /></ProtectedRoute>} />
              <Route path="/academic/class-assign" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ClassAssignPage /></ProtectedRoute>} />
              <Route path="/academic/class-schedule" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ClassSchedulePage /></ProtectedRoute>} />
              <Route path="/academic/teacher-schedule" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><TeacherSchedulePage /></ProtectedRoute>} />
              <Route path="/academic/promotion" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PromotionPage /></ProtectedRoute>} />

              {/* Payroll Routes */}
              <Route path="/payroll/salary-template" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SalaryTemplatePage /></ProtectedRoute>} />
              <Route path="/payroll/salary-assign" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SalaryAssignPage /></ProtectedRoute>} />
              <Route path="/payroll/salary-payment" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SalaryPaymentPage /></ProtectedRoute>} />

              {/* Advance Salary Routes */}
              <Route path="/advance-salary/apply" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdvanceSalaryApplyPage /></ProtectedRoute>} />
              <Route path="/advance-salary/manage" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdvanceSalaryManagePage /></ProtectedRoute>} />
              <Route path="/advance-salary/request" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdvanceSalaryRequestPage /></ProtectedRoute>} />

              {/* Leave Routes */}
              <Route path="/leave/category" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LeaveCategoryPage /></ProtectedRoute>} />
              <Route path="/leave/my-apply" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LeaveMyApplyPage /></ProtectedRoute>} />
              <Route path="/leave/request" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LeaveRequestPage /></ProtectedRoute>} />
              <Route path="/leave/manage" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><LeaveManagePage /></ProtectedRoute>} />

              {/* Award Routes */}
              <Route path="/award" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AwardPage /></ProtectedRoute>} />

              {/* Mailbox Route */}
              <Route path="/mailbox" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><MailboxPage /></ProtectedRoute>} />

              {/* Fees Route */}
              <Route path="/fees/invoice/:studentId" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><InvoiceHistoryPage /></ProtectedRoute>} />


              {/* Alumni Routes */}
              <Route path="/alumni/manage" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><ManageAlumniPage /></ProtectedRoute>} />
              <Route path="/alumni/events" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><AlumniEventsPage /></ProtectedRoute>} />

              {/* Frontend CMS Routes */}
              <Route path="/frontend/setting" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendSettingPage /></ProtectedRoute>} />
              <Route path="/frontend/menu" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendMenuPage /></ProtectedRoute>} />
              <Route path="/frontend/page-section" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendPageSectionPage /></ProtectedRoute>} />
              <Route path="/frontend/manage-page" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendManagePagePage /></ProtectedRoute>} />
              <Route path="/frontend/slider" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendSliderPage /></ProtectedRoute>} />
              <Route path="/frontend/features" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendFeaturesPage /></ProtectedRoute>} />
              <Route path="/frontend/testimonial" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendTestimonialPage /></ProtectedRoute>} />
              <Route path="/frontend/service" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendServicePage /></ProtectedRoute>} />
              <Route path="/frontend/faq" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendFaqPage /></ProtectedRoute>} />
              <Route path="/frontend/gallery-category" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendGalleryCategoryPage /></ProtectedRoute>} />
              <Route path="/frontend/gallery" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><FrontendGalleryPage /></ProtectedRoute>} />

              {/* Reception Routes */}
              <Route path="/reception/admission-enquiry" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdmissionEnquiryPage /></ProtectedRoute>} />
              <Route path="/reception/admission-enquiry/:enquiryId" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><AdmissionEnquiryDetailsPage /></ProtectedRoute>} />
              <Route path="/reception/postal-record" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PostalRecordPage /></ProtectedRoute>} />
              <Route path="/reception/call-log" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><CallLogPage /></ProtectedRoute>} />
              <Route path="/reception/visitor-log" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><VisitorLogPage /></ProtectedRoute>} />
              <Route path="/reception/complaint" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ComplaintPage /></ProtectedRoute>} />
              <Route path="/reception/config-reception" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ConfigReceptionPage /></ProtectedRoute>} />

              {/* Inventory Routes */}
              <Route path="/inventory/products" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><ProductPage /></ProtectedRoute>} />
              <Route path="/inventory/categories" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><CategoryPageInv /></ProtectedRoute>} />
              <Route path="/inventory/stores" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><StorePageInv /></ProtectedRoute>} />
              <Route path="/inventory/suppliers" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SupplierPage /></ProtectedRoute>} />
              <Route path="/inventory/units" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><UnitPage /></ProtectedRoute>} />
              <Route path="/inventory/purchases" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><PurchasePage /></ProtectedRoute>} />
              <Route path="/inventory/sales" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><SalesPage /></ProtectedRoute>} />
              <Route path="/inventory/issues" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><IssuePage /></ProtectedRoute>} />
              <Route path="/hrm" element={<ProtectedRoute allowedRoles={SCHOOL_STAFF}><HRMPage /></ProtectedRoute>} />

              {/* Subscription Routes (Super Admin) */}
              <Route path="/subscription/list" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SubscriptionPage /></ProtectedRoute>} />
              <Route path="/subscription/pending" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><PendingRequestPage /></ProtectedRoute>} />
              <Route path="/subscription/domain" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><CustomDomainPage /></ProtectedRoute>} />
              <Route path="/subscription/plan" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><PlanPage /></ProtectedRoute>} />
              <Route path="/subscription/settings" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SubscriptionSettingsPage /></ProtectedRoute>} />
              <Route path="/subscription/transactions" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><TransactionsPage /></ProtectedRoute>} />
              <Route path="/subscription/offline-payments" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><OfflinePaymentsPage /></ProtectedRoute>} />

              {/* 2FA Security Routes */}
              <Route path="/security/my-2fa-setup" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><My2FASetupPage /></ProtectedRoute>} />
              <Route path="/security/settings" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><TwoFASettingsPage /></ProtectedRoute>} />
              
              {/* System Settings Routes */}
              <Route path="/system-settings/global" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><GlobalSettingsPage /></ProtectedRoute>} />
              <Route path="/system-settings/school" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SchoolSettingsPage /></ProtectedRoute>} />
              <Route path="/system-settings/school-config/:schoolId" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SchoolConfigurationPage /></ProtectedRoute>} />
              <Route path="/system-settings/role-permission" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><RolePermissionPage /></ProtectedRoute>} />
              <Route path="/system-settings/role-permission/:roleId" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><RolePermissionsAssignmentPage /></ProtectedRoute>} />
              <Route path="/system-settings/session" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><SessionSettingsPage /></ProtectedRoute>} />
              <Route path="/system-settings/modules" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><ModulesSettingsPage /></ProtectedRoute>} />
              <Route path="/system-settings/student-field" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><SystemStudentFieldPage /></ProtectedRoute>} />
              <Route path="/system-settings/custom-field" element={<ProtectedRoute allowedRoles={SCHOOL_ADMIN}><CustomFieldPage /></ProtectedRoute>} />
              <Route path="/system-settings/database-backup" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><DatabaseBackupPage /></ProtectedRoute>} />
              <Route path="/system-settings/system-update" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><SystemUpdatePage /></ProtectedRoute>} />
              <Route path="/system-settings/user-login-log" element={<ProtectedRoute allowedRoles={ALL_AUTHENTICATED}><UserLoginLogPage /></ProtectedRoute>} />

              {/* Blog Manager Routes (Super Admin) */}
              <Route path="/company/blog-manager" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogManagerDashboardPage /></ProtectedRoute>} />
              <Route path="/company/blog-manager/posts" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogPostsPage /></ProtectedRoute>} />
              <Route path="/company/blog-manager/posts/new" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogPostEditorPage /></ProtectedRoute>} />
              <Route path="/company/blog-manager/posts/edit/:id" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogPostEditorPage /></ProtectedRoute>} />
              <Route path="/company/blog-manager/categories" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogCategoriesTagsPage /></ProtectedRoute>} />
              <Route path="/company/blog-manager/comments" element={<ProtectedRoute allowedRoles={SUPER_ADMIN}><BlogCommentsPage /></ProtectedRoute>} />

            </Routes>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Utility to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default App;