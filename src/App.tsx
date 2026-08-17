import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DataProvider, useData } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { AuthModal } from './components/AuthModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AboutSchoolModal } from './components/AboutSchoolModal';

// School & Community Views
import { HomeView } from './components/school/HomeView';
import { AboutSchoolView } from './components/school/AboutSchoolView';
import { PrincipalDeskView } from './components/school/PrincipalDeskView';
import { AcademicsView } from './components/school/AcademicsView';
import { FacultyView } from './components/school/FacultyView';
import { AdmissionsView } from './components/school/AdmissionsView';
import { NoticesView } from './components/school/NoticesView';
import { SchoolEventsView } from './components/school/SchoolEventsView';
import { GalleryView } from './components/school/GalleryView';
import { ContactView } from './components/school/ContactView';
import { FinancialTransparencyView } from './components/school/FinancialTransparencyView';
import { AlumniSectionView } from './components/alumni/AlumniSectionView';
import { DonationPortalView } from './components/donations/DonationPortalView';
import { BloodDonationView } from './components/blood/BloodDonationView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DonationReceiptModal } from './components/DonationReceiptModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useData();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-900 flex flex-col justify-between">
      <div>
        {/* Sticky Universal Dual-Identity Navigation Header */}
        <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

        {/* Dynamic View Router with Smooth Transitions */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'about' && <AboutSchoolView />}
              {activeTab === 'principal' && <PrincipalDeskView />}
              {activeTab === 'academics' && <AcademicsView />}
              {activeTab === 'faculty' && <FacultyView />}
              {activeTab === 'admissions' && <AdmissionsView />}
              {activeTab === 'notices' && <NoticesView />}
              {activeTab === 'events' && <SchoolEventsView />}
              {activeTab === 'gallery' && <GalleryView />}
              {activeTab === 'contact' && <ContactView />}
              {activeTab === 'financials' && <FinancialTransparencyView />}
              {activeTab === 'alumni' && <AlumniSectionView />}
              {activeTab === 'donations' && <DonationPortalView />}
              {activeTab === 'blood-donation' && <BloodDonationView />}
              {activeTab === 'admin' && <AdminDashboard onClose={() => setActiveTab('alumni')} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AboutSchoolModal />
      <RegistrationModal />
      <AuthModal />
      <DonationReceiptModal />
      <AIAssistantModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Institutional Multi-Column Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </LanguageProvider>
  );
}
