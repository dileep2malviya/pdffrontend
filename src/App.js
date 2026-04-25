import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AllToolsPage from './pages/AllToolsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PdfEditorPage from './pages/PdfEditorPage';
import StaticPage from './pages/StaticPage';
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
          element={
            <StaticPage
              title="Pricing"
              description="Start free and upgrade for API access, high-volume usage, and team collaboration controls."
              canonicalPath="/pricing"
            />
          }
        />
        <Route
          path="/about"
          element={
            <StaticPage
              title="About ImageToPDFNow"
              description="ImageToPDFNow is designed for high-quality document workflows with reusable architecture and a modern user experience."
              canonicalPath="/about"
            />
          }
        />
        <Route
          path="/contact"
          element={
            <StaticPage
              title="Contact"
              description="Talk with our team about enterprise usage, integrations, and custom PDF pipelines."
              canonicalPath="/contact"
            />
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <StaticPage
              title="Privacy Policy"
              description="We explain what data we collect, how we use cookies and analytics, and how ad services like Google AdSense may process information when you use ImageToPDFNow."
              canonicalPath="/privacy-policy"
            />
          }
        />
        <Route
          path="/terms"
          element={
            <StaticPage
              title="Terms and Conditions"
              description="By using ImageToPDFNow, you agree to use our tools only with content you own or are authorized to process. We do not allow copyright infringement or unlawful use."
              canonicalPath="/terms"
            />
          }
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
