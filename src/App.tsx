import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WizardProvider } from './contexts/CreateWizardContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { CreateWizard } from './pages/CreateWizard';
import { ExperiencePage } from './pages/ExperiencePage';
import { VictoryPage } from './pages/VictoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ScrollToTop } from './components/layout/ScrollToTop';

import { PWAProvider } from './contexts/PWAContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Layout for pages that need Navbar and Footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-[#0a0a1a]">
    <Navbar />
    <main className="flex-grow pt-[72px]">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <PWAProvider>
      <AuthProvider>
        <WizardProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/templates" element={<MainLayout><TemplateGalleryPage /></MainLayout>} />
            <Route path="/login" element={<MainLayout><AuthPage mode="login" /></MainLayout>} />
            <Route path="/signup" element={<MainLayout><AuthPage mode="signup" /></MainLayout>} />
            <Route path="/privacy" element={<MainLayout><PrivacyPolicyPage /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
            <Route path="/cookies" element={<MainLayout><CookiePolicyPage /></MainLayout>} />
            <Route path="/verify" element={<MainLayout><VerifyEmailPage /></MainLayout>} />

            {/* Protected Routes with Navbar */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} 
            />
            <Route 
              path="/create" 
              element={<ProtectedRoute><MainLayout><CreateWizard /></MainLayout></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} 
            />
            <Route 
              path="/settings" 
              element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} 
            />

            {/* Experience Routes (NO Navbar, full immersion) */}
            <Route path="/p/:slug" element={<ExperiencePage />} />
            <Route path="/p/:slug/accepted" element={<VictoryPage />} />
          </Routes>
        </BrowserRouter>
        </WizardProvider>
      </AuthProvider>
    </PWAProvider>
  );
}

export default App;
