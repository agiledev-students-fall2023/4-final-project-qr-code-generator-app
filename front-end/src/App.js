// app.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";
import ScanCode from "./ScanCode";
import ConnectionDetails from "./ConnectionDetails";
import PrivacyPolicy from "./PrivacyPolicy";
import ContactUs from "./ContactUs";
import TermOfServices from "./TermOfServices";
import SelectInformation from "./SelectInformation"
import SavedConnections from "./SavedConnections"
import EditInformation from "./EditInformation"
import GenerateQRCode from "./GenerateQRCode";
import './App.css';

const App = () => {
	return (
		<Router>
			<Header />
			<div className="main-content"> {/* Main content area */}
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomeScreen />} />
				<Route path="/home" element={<HomeScreen />} />
				<Route path="/ContactUs" element={<ContactUs />} />
				<Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
				<Route path="/TermOfServices" element={<TermOfServices />} />
				<Route path="/ScanCode" element={<ScanCode />} />
				<Route path="/ConnectionDetails/:friend_id" element={<ConnectionDetails />} />
				<Route path="/ContactUs" element={<ContactUs />} />
				<Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
				<Route path="/scan-code" element={<ScanCode />} />
				<Route path="/select-information" element={<SelectInformation/>} />
				<Route path="/saved-connections" element={<SavedConnections />} />
				<Route path="/edit-information" element={<EditInformation />} />
				<Route path="/GenerateQRCode" element={<GenerateQRCode />} />
			</Routes>
			</div>
			<Footer />
		</Router>
	);
};

export default App;
