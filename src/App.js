import { Navigate, Route, Routes } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import MainLayout from './components/MainLayout';
import AllToolsPage from './pages/AllToolsPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PdfEditorPage from './pages/PdfEditorPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import StaticPage from './pages/StaticPage';
import TermsPage from './pages/TermsPage';
import ToolPage from './pages/ToolPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-tools" element={<AllToolsPage />} />
        <Route path="/tools/:toolSlug" element={<ToolPage />} />
        <Route path="/editor" element={<PdfEditorPage />} />
        <Route
          path="/pricing"
          element={<PricingPage />}
        />
        <Route
          path="/about"
          element={<AboutPage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage />}
        />
        <Route
          path="/terms"
          element={<TermsPage />}
        />
        <Route
          path="/login"
          element={
            <StaticPage
              title="Sign In"
              description="Access your dashboard, usage history, and automation tools."
              canonicalPath="/login"
            />
          }
        />
        <Route
          path="/register"
          element={
            <StaticPage
              title="Create Account"
              description="Create your account to unlock saved workflows, cloud storage sync, and faster batch processing."
              canonicalPath="/register"
            />
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
