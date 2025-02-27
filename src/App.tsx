import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from '@/pages/Landing';
import KYCForm from '@/pages/KYCForm';
import KYBForm from '@/pages/KYBForm';
import Verifying from '@/pages/Verifying';
import Success from '@/pages/Success';
import Failed from '@/pages/Failed';
import ContactTeam from '@/pages/ContactTeam';
import Pending from '@/pages/Pending';
import NotifyStatus from '@/pages/NotifyStatus';

function App() {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/verify" element={<KYCForm />} />
            <Route path="/verify-business" element={<KYBForm />} />
            <Route path="/verifying" element={<Verifying />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/contact-team" element={<ContactTeam />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/notify-status" element={<NotifyStatus />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default App