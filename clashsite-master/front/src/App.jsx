import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Suspense, lazy } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageProvider } from "./i18n/LanguageContext";

const Header = lazy(() => import("../components/layouts/Header"));
const Footer = lazy(() => import("../components/layouts/Footer"));
const Home = lazy(() => import("../components/Home"));
const ClanDetails = lazy(() => import("../components/ClanDetails"));
const PlayerDetails = lazy(() => import("../components/PlayerDetails"));
const Profile = lazy(() => import("../components/Profile"));
const Clansdonatin = lazy(() => import("../components/clansdonatin/Clansdonatin.jsx"));
const ClanByTag = lazy(() => import("../components/headerPages/ClanByTag"));
const PlayerByTag = lazy(() => import("../components/headerPages/PlayerByTag"));
const PlayersInClan = lazy(() => import("../components/headerPages/PlayersInClan"));
const Login = lazy(() => import("../components/LoginMethod/Login"));
const SignUp = lazy(() => import("../components/LoginMethod/SignUp"));
const ForgetPassword = lazy(() => import("../components/LoginMethod/ForgetPassword"));
const ResetPassword = lazy(() => import("../components/LoginMethod/ResetPassword"));
const PlayerProfile = lazy(() => import("../components/LoginMethod/PlayerProfile"));
const XpCalculator = lazy(() => import("../components/XpCalculator"));

const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../components/admin/pages/AdminDashboard"));
const AdminContent = lazy(() => import("../components/admin/pages/AdminContent"));
const RequireAdmin = lazy(() => import("../components/admin/RequireAdmin"));
const GOOGLE_CLIENT_ID =
  "171615105804-bbjsnv1sqh0i0q30jprdndjgi6c5oiu5.apps.googleusercontent.com";

const suspenseFallback = (
  <div className="flex min-h-screen items-center justify-center bg-slate-950/90 text-slate-200">
    <div className="flex flex-col items-center gap-3">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-700 border-t-sky-400" />
      <span className="text-sm font-medium tracking-wide text-slate-400">
        Loading the ReqClans experience…
      </span>
    </div>
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <Router>
          <Suspense fallback={suspenseFallback}>
            <div className="app">
              <Header />

              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgetpassword" element={<ForgetPassword />} />
                  <Route path="/resetpassword" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/player/profile" element={<PlayerProfile />} />
                  <Route path="/clan/:tag" element={<ClanDetails />} />
                  <Route path="/player/:tag" element={<PlayerDetails />} />
                  <Route path="/youraccount" element={<Navigate to="/login" replace />} />
                  <Route path="/clans/clan" element={<ClanByTag />} />
                  <Route path="/clans/donations" element={<Clansdonatin />} />
                  <Route path="/donations" element={<Clansdonatin />} />
                  <Route path="/players/player" element={<PlayerByTag />} />
                  <Route path="/players/plsyersclan" element={<PlayersInClan />} />
                  <Route path="/xp-calculator" element={<XpCalculator />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>
                </Routes>
              </main>

              <Footer />
            </div>
          </Suspense>
        </Router>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

