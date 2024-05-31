import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DonationONG from "./components/DonationONG";
import ReturnPage from "./components/ReturnPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/return" element={<ReturnPage />} />
        <Route path="/" element={<DonationONG />} />
      </Routes>
    </Router>
  );
};

export default App;
