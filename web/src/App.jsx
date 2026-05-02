import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import CutPage from "./pages/CutPage.jsx";
import MergePage from "./pages/MergePage.jsx";

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => "btn secondary"}
      style={({ isActive }) => ({
        borderColor: isActive ? "rgba(109,123,255,1)" : "rgba(255,255,255,.2)",
        color: isActive ? "#b9c6ff" : "#e9ecff",
      })}
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="header">
          <div className="brand">
            <h1>Media Cutter & Merger</h1>
          </div>
          <div className="row">
            <Tab to="/cut">✂️ Cắt</Tab>
            <Tab to="/merge">🧩 Nối</Tab>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/cut" replace />} />
          <Route path="/cut" element={<CutPage />} />
          <Route path="/merge" element={<MergePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
