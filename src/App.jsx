import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { RideProvider } from './contexts/RideContext.jsx';
import { GlobalProvider } from './context/GlobalStore.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import useAuth from './hooks/useAuth';
import Navbar from './components/layout/Navbar.jsx';

// Customer pages
import HomePage from './pages/Customer/HomePage.jsx';
import RideBooking from './pages/Customer/RideBooking.jsx';
import RideTracking from './pages/Customer/RideTracking.jsx';
import RideHistory from './pages/Customer/RideHistory.jsx';
import Profile from './pages/Customer/Profile.jsx';
import RatingPage from './pages/Customer/RatingPage.jsx';
import HelpPage from './pages/Customer/HelpPage.jsx';
import About from './pages/About.jsx';

// Auth pages
import Login from './pages/Auth/Login.jsx';
import CustomerRegister from './pages/Auth/CustomerRegister.jsx';
import RiderRegister from './pages/Auth/RiderRegister.jsx';
import RiderVerification from './pages/Auth/RiderVerification.jsx';
import OTPVerification from './pages/Auth/OTPVerification.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';

// Rider pages
import RiderDashboard from './pages/Rider/Dashboard.jsx';
import AcceptRide from './pages/Rider/AcceptRide.jsx';
import RideInProgress from './pages/Rider/RideInProgress.jsx';
import RideToDestination from './pages/Rider/RideToDestination.jsx';
import RiderRideHistory from './pages/Rider/RideHistory.jsx';
import RiderProfile from './pages/Rider/RiderProfile.jsx';
import RiderHelpPage from './pages/Rider/HelpPage.jsx';
import Wallet from './pages/Rider/Wallet.jsx';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import RideManagement from './pages/Admin/RideManagement.jsx';
import Reports from './pages/Admin/Reports.jsx';
import RatingsReview from './pages/Admin/RatingsReview.jsx';
import HelpManagement from './pages/Admin/HelpManagement.jsx';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';



import NotFound from './pages/NotFound.jsx';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <Router> {/* Move Router to the top */}
      <AuthProvider>
        <RideProvider>
          <GlobalProvider>
            <AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </GlobalProvider>
        </RideProvider>
      </AuthProvider>
    </Router>
  );
}

function AppLayout({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      <Navbar showHelp={!!user} />
      <div className="flex flex-1">
        {/* Sidebar only if logged in */}
        {user && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen && user ? 'md:ml-64' : ''}`}>
          <Routes>
            {/* Customer routes - restrict to CUSTOMER role */}
            <Route path="/" element={<RequireCustomerAuth><HomePage /></RequireCustomerAuth>} />
            <Route path="/ride-booking" element={<RequireCustomerAuth><RideBooking /></RequireCustomerAuth>} />
            <Route path="/ride-tracking" element={<RequireCustomerAuth><RideTracking /></RequireCustomerAuth>} />
            <Route path="/ride-history" element={<RequireCustomerAuth><RideHistory /></RequireCustomerAuth>} />
            <Route path="/profile" element={<RequireCustomerAuth><Profile /></RequireCustomerAuth>} />
            <Route path="/rating" element={<RequireCustomerAuth><RatingPage /></RequireCustomerAuth>} />
            <Route path="/help" element={<RequireCustomerAuth><HelpPage /></RequireCustomerAuth>} />
            <Route path="/about" element={<About />} />
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            {/* Registration routes */}
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/rider-register" element={<RiderRegister />} />
            <Route path="/rider-verification" element={<RiderVerification />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Rider routes */}
            <Route path="/rider/dashboard" element={<RequireAuth><RiderDashboard /></RequireAuth>} />
            <Route path="/rider/accept-ride" element={<RequireAuth><AcceptRide /></RequireAuth>} />
            <Route path="/rider/ride-in-progress/:rideId" element={<RequireAuth><RideInProgress /></RequireAuth>} />
            <Route path="/rider/ride-to-destination" element={<RequireAuth><RideToDestination /></RequireAuth>} />
            <Route path="/rider/ride-history" element={<RequireAuth><RiderRideHistory /></RequireAuth>} />
            <Route path="/rider/profile" element={<RequireAuth><RiderProfile /></RequireAuth>} />
            <Route path="/rider/help" element={<RequireAuth><RiderHelpPage /></RequireAuth>} />
            <Route path="/rider/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/user-management" element={<RequireAuth><UserManagement /></RequireAuth>} />
            <Route path="/admin/ride-management" element={<RequireAuth><RideManagement /></RequireAuth>} />
            <Route path="/admin/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/admin/ratings-review" element={<RequireAuth><RatingsReview /></RequireAuth>} />
            <Route path="/admin/help-management" element={<RequireAuth><HelpManagement /></RequireAuth>} />
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}
// Restrict customer pages to CUSTOMER role only
function RequireCustomerAuth({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user && user.role !== 'CUSTOMER') {
      // Redirect riders to their dashboard, admins to admin dashboard
      if (user.role === 'RIDER') {
        navigate('/rider/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);
  if (!user || user.role !== 'CUSTOMER') return null;
  return children;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user && window.location.pathname.startsWith('/ride-booking') && user.role !== 'CUSTOMER') {
      navigate('/'); // Redirect non-customers to home
    }
  }, [user, loading, navigate]);
  if (!user) return null;
  if (window.location.pathname.startsWith('/ride-booking') && user.role !== 'CUSTOMER') return null;
  return children;
}

export default App;