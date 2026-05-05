import { AuthProvider } from "./context/AuthContext";
import Router from "./routes/Router";
import { Toaster } from "react-hot-toast";

function AppContent() {
  return <Router />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppContent />
    </AuthProvider>
  );
}