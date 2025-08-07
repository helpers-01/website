import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import HelperProfilePage from './pages/HelperProfilePage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import DashboardPage from './pages/DashboardPage';
import ReviewPage from './pages/ReviewPage';
import UserChatPage from './pages/UserChatPage';
import HelperChatPage from './pages/HelperChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthRedirect from './pages/AuthRedirect';
import HelperRegistrationPage from './pages/HelperRegistrationPage';
import EditProfilePage from './pages/EditProfilePage';
import HelperSummaryDashboard from './pages/HelperSummaryDashboard';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Header from './components/Layout/Header';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import ServicesPage from './pages/ServicesPage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentPage from './pages/PaymentPage'; // <-- Step 1: Add import

const App: React.FC = () => {
  return (
    <Router>
      <Header /> {/* Global Header */}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/register-helper" element={<HelperRegistrationPage />} />

        {/* Admin Route */}
        <Route path="/admin-categories" element={<AdminCategoriesPage />} />

        {/* Public Services Page */}
        <Route path="/services" element={<ServicesPage />} />

        {/* Protected User & Helper Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/helper/:id" element={<HelperProfilePage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/helper-dashboard" element={<HelperSummaryDashboard />} />
          <Route path="/leave-review/:bookingId" element={<ReviewPage />} />
          <Route path="/user-chat/:helperId" element={<UserChatPage />} />
          <Route path="/helper-chat/:userId" element={<HelperChatPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />

          {/* ✅ Step 2: Add payment route here */}
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;