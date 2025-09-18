import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "../components/layouts/Header";
import Home from "../components/Home";
import Footer from "../components/layouts/Footer";
import ClanDetails from "../components/ClanDetails";
import PlayerDetails from "../components/PlayerDetails";
import Profile from "../components/Profile";
import Clansdonatin from "../components/clansdonatin/Clansdonatin.jsx";
import ClanByTag from "../components/headerPages/ClanByTag";
import PlayerByTag from "../components/headerPages/PlayerByTag";
import PlayersInClan from "../components/headerPages/PlayersInClan";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Discord from "../components/LoginMethod/Discord";
import Login from "../components/LoginMethod/Login";
import SignUp from "../components/LoginMethod/SignUp";
import ForgetPassword from "../components/LoginMethod/ForgetPassword";
import ResetPassword from "../components/LoginMethod/ResetPassword";
import PlayerProfile from "../components/LoginMethod/PlayerProfile";
import XpCalculator from "../components/XpCalculator";
import { LanguageProvider } from "./i18n/LanguageContext";

const GOOGLE_CLIENT_ID =
  "171615105804-bbjsnv1sqh0i0q30jprdndjgi6c5oiu5.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <Router>
          <div className="app">
            <Header />
            {/* <Google /> */}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/player/profile" element={<PlayerProfile />} />
              {/* <Route path="/discord" element={<Discord />} /> */}
              <Route path="/clan/:tag" element={<ClanDetails />} />
              <Route path="/player/:tag" element={<PlayerDetails />} />
              <Route path="/youraccount" element={<Navigate to="/login" replace />} />
              <Route path="/clans/clan" element={<ClanByTag />} />
              <Route path="/clans/donations" element={<Clansdonatin />} />
              <Route path="/donations" element={<Clansdonatin />} />

              <Route path="/players/player" element={<PlayerByTag />} />
              <Route path="/players/plsyersclan" element={<PlayersInClan />} />
              <Route path="/xp-calculator" element={<XpCalculator />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

