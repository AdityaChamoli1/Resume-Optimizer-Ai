import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";

// Lazy load all pages
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const OptimizerPage = lazy(() => import("./pages/OptimizerPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ResumeBuilderPage = lazy(() => import("./pages/ResumeBuilderPage"));
const LinkedInGeneratorPage = lazy(() => import("./pages/LinkedInGeneratorPage"));
const CoverLetterPage = lazy(() => import("./pages/CoverLetterPage"));
const InterviewPrepPage = lazy(() => import("./pages/InterviewPrepPage"));
const ATSCheckerPage = lazy(() => import("./pages/ATSCheckerPage"));
const JobMatchPage = lazy(() => import("./pages/JobMatchPage"));
const PortfolioBuilderPage = lazy(() => import("./pages/PortfolioBuilderPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const ResumeExamplesPage = lazy(() => import("./pages/ResumeExamplesPage"));
const CareerToolsPage = lazy(() => import("./pages/CareerToolsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ATSGuidePage = lazy(() => import("./pages/ATSGuidePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              {/* Protected tool pages */}
              <Route path="/optimizer" element={<ProtectedRoute><OptimizerPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
              <Route path="/linkedin-generator" element={<ProtectedRoute><LinkedInGeneratorPage /></ProtectedRoute>} />
              <Route path="/cover-letter" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
              <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>} />
              <Route path="/ats-checker" element={<ProtectedRoute><ATSCheckerPage /></ProtectedRoute>} />
              <Route path="/job-match" element={<ProtectedRoute><JobMatchPage /></ProtectedRoute>} />
              <Route path="/portfolio-builder" element={<ProtectedRoute><PortfolioBuilderPage /></ProtectedRoute>} />
              {/* Public pages */}
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/resume-examples" element={<ResumeExamplesPage />} />
              <Route path="/career-tools" element={<CareerToolsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/changelog" element={<ChangelogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/ats-guide" element={<ATSGuidePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
