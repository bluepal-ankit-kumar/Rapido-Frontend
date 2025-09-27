// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { RideProvider } from './contexts/RideContext.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Navbar from './components/layout/Navbar.jsx';

// Customer pages
import HomePage from './pages/Customer/HomePage.jsx';
import RideBooking from './pages/Customer/RideBooking.jsx';
import RideTracking from './pages/Customer/RideTracking.jsx';
import RideHistory from './pages/Customer/RideHistory.jsx';
import Profile from './pages/Customer/Profile.jsx';
import RatingPage from './pages/Customer/RatingPage.jsx';
import HelpPage from './pages/Customer/HelpPage.jsx';

// Auth pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import OTPVerification from './pages/Auth/OTPVerification.jsx';

// Rider pages
import RiderDashboard from './pages/Rider/Dashboard.jsx';
import AcceptRide from './pages/Rider/AcceptRide.jsx';
import RideInProgress from './pages/Rider/RideInProgress.jsx';
import RiderRideHistory from './pages/Rider/RideHistory.jsx';
import RiderProfile from './pages/Rider/RiderProfile.jsx';
import RiderHelpPage from './pages/Rider/HelpPage.jsx';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import RideManagement from './pages/Admin/RideManagement.jsx';
import Reports from './pages/Admin/Reports.jsx';
import RatingsReview from './pages/Admin/RatingsReview.jsx';
import HelpManagement from './pages/Admin/HelpManagement.jsx';

import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <AuthProvider>
      <RideProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1">
                <Routes>
                  {/* Customer routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ride-booking" element={<RideBooking />} />
                  <Route path="/ride-tracking" element={<RideTracking />} />
                  <Route path="/ride-history" element={<RideHistory />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/rating" element={<RatingPage />} />
                  <Route path="/help" element={<HelpPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/otp-verification" element={<OTPVerification />} />

                  {/* Rider routes */}
                  <Route path="/rider/dashboard" element={<RiderDashboard />} />
                  <Route path="/rider/accept-ride" element={<AcceptRide />} />
                  <Route path="/rider/ride-in-progress" element={<RideInProgress />} />
                  <Route path="/rider/ride-history" element={<RiderRideHistory />} />
                  <Route path="/rider/profile" element={<RiderProfile />} />
                  <Route path="/rider/help" element={<RiderHelpPage />} />

                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/user-management" element={<UserManagement />} />
                  <Route path="/admin/ride-management" element={<RideManagement />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/ratings-review" element={<RatingsReview />} />
                  <Route path="/admin/help-management" element={<HelpManagement />} />

                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </RideProvider>
    </AuthProvider>
  );
}

export default App;