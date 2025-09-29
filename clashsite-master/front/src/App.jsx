import ProtectedRoutes from "./ProtectedRoutes.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { LanguageProvider } from "./i18n/LanguageContext";
import Home from "../components/Home";
import Login from "../components/LoginMethod/Login";
import SignUp from "../components/LoginMethod/SignUp.jsx";
import Profile from "../components/profile/Profile.jsx";
import ForgetPassword from "../components/LoginMethod/ForgetPassword";
import VerifyEmail from "../components/LoginMethod/VerifyEmail.jsx";
import ResetPassword from "../components/LoginMethod/ResetPassword";
import Header from "../components/layouts/Header.jsx";
import Footer from "../components/layouts/Footer.jsx";
import AdminDashboard from "../components/admin/pages/AdminLayout.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import ClanByTag from "../components/headerPages/ClanByTag.jsx";
import PlayerByTag from "../components/headerPages/PlayerByTag.jsx";
import PlayersInClan from "../components/headerPages/PlayersInClan.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ClanDetails from "../components/ClanDetails.jsx";
import PlayerDetails from "../components/PlayerDetails.jsx";
import NotFound from "./NotFound.jsx";
import XpCalculator from "../components/XpCalculator.jsx";
import Clansdonatin from "../components/clansdonatin/Clansdonatin.jsx";
import Aboute from "../components/Aboute.jsx";
import RSSFeed from "./Rss.jsx";

const GOOGLE_CLIENT_ID =
  "171615105804-bbjsnv1sqh0i0q30jprdndjgi6c5oiu5.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* Auth pages without header/footer */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path={`/verify-email`} element={<VerifyEmail />} />

          {/* 404 page without header/footer */}
          <Route path="*" element={<NotFound />} />

          {/* All other pages with header/footer */}
          <Route
            path="/"
            element={
              <>
                <Header />

                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/xp-calculator"
            element={
              <>
                <Header />
                <XpCalculator />
                <Footer />
              </>
            }
          />
          <Route
            path="/donations"
            element={
              <>
                <Header />
                <Clansdonatin />
                <Footer />
              </>
            }
          />
          <Route
            path="/aboute"
            element={
              <>
                <Header />
                <Aboute />
                <Footer />
              </>
            }
          />
          <Route
            path="/rss"
            element={
              <>
                <Header />
                <RSSFeed />
                <Footer />
              </>
            }
          />

          <Route
            path="/clan/:tag"
            element={
              <>
                <Header />
                <ClanDetails />
                <Footer />
              </>
            }
          />

          <Route
            path="/player/:tag"
            element={
              <>
                <Header />
                <PlayerDetails />
                <Footer />
              </>
            }
          />

          <Route
            path="/clans/clan"
            element={
              <>
                <Header />
                <ClanByTag />
                <Footer />
              </>
            }
          />

          <Route
            path="/players/player"
            element={
              <>
                <Header />
                <PlayerByTag />
                <Footer />
              </>
            }
          />

          <Route
            path="/players/plsyersclan"
            element={
              <>
                <Header />
                <PlayersInClan />
                <Footer />
              </>
            }
          />

          {/* Protected routes with header/footer */}
          <Route element={<ProtectedRoutes />}>
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <Profile />
                  <Footer />
                </>
              }
            />
          </Route>

          {/* Admin routes with header/footer */}
          <Route element={<AdminRoutes />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <Header />
                  <AdminDashboard />
                  <Footer />
                </>
              }
            />
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
export default App;
