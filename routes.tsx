import { createBrowserRouter } from "react-router";
import HomePage from './pages/HomePage';
import CommunePage from './pages/CommunePage';
import OPJPage from './pages/OPJPage';
import MediaPage from './pages/MediaPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SuccessPage from './pages/SuccessPage';
import { AccidentReportProvider } from './context/AccidentReportContext';
import { ChatbotAssistant } from './components/ChatbotAssistant';
import { Toaster } from './components/ui/sonner';

function Layout({ children, currentStep }: { children: React.ReactNode; currentStep: string }) {
  return (
    <AccidentReportProvider>
      {children}
      <ChatbotAssistant currentStep={currentStep} />
      <Toaster />
    </AccidentReportProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout currentStep="home"><HomePage /></Layout>,
  },
  {
    path: "/commune",
    element: <Layout currentStep="commune"><CommunePage /></Layout>,
  },
  {
    path: "/opj",
    element: <Layout currentStep="opj"><OPJPage /></Layout>,
  },
  {
    path: "/media",
    element: <Layout currentStep="media"><MediaPage /></Layout>,
  },
  {
    path: "/confirmation",
    element: <Layout currentStep="confirmation"><ConfirmationPage /></Layout>,
  },
  {
    path: "/success",
    element: <Layout currentStep="success"><SuccessPage /></Layout>,
  },
]);
