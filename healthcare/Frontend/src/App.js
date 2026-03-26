

//2nd part 

import "./App.css"; // Valid because it's inside src/

import Homepage from "./Components/Homepage/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import About from "./Components/About/About";
import Product from "./Components/Product/Product";
import Contact from "./Components/Contact/Contact";
import Adminlogin from "./Components/Admin/loginadmin";
import Adminregister from "./Components/Admin/registeradmin";
import AdminDashboard from "./Components/AdminDashboard/Adminpage";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import SetPassword from "./Components/SetPassword/SetPassword";
import Chat from "./Components/Chat/Chat";
import Service from "./Components/Service/Service";
import DiseasePrediction from "./Components/Deseas_Pred/DiseasePrediction";
import Checkout from "./Components/Checkout/Checkout";
import Payment from "./Components/Payment/Payment";
import PrescriptionUpload from "./Components/PrescriptionUpload/PrescriptionUpload";
import Ambulance from "./Components/Ambulance/Ambulance";

// For doctor login
import Doctorlogin from "./Components/Doctorlogin/Doctorlogin";
import Doctorhomepage from "./Components/Doctorlogin/Doctorhomepage";

// New added for payment
import PaymentHomepage from "./Components/PaymentHomepage/PaymentHomepage";
import PaymentPage from "./Components/PaymentHomepage/PaymentPage";
import SuccessPage from "./Components/PaymentHomepage/SuccessPage";
import FailurePage from "./Components/PaymentHomepage/FailurePage";

import HealthChatbot from "./Components/Healthchatbot/Healthchatbot";
import DoctorList from "./Components/DoctorList/DoctorList";

import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownProvider } from "./context/DropdownContext";

// User profile
import UserProfile from "./Components/UserProfile/UserProfile";

// Doctor profile
import DoctorProfile from "./Components/DoctorProfile/DoctorProfile";

// Video call + appointments
import VideoCall from "./Components/Videocall/VideoCall";
import MyAppointments from "./Components/Videocall/MyAppointments";
import DoctorAppointments from "./Components/Videocall/DoctorAppointments";

// ✅ Records (default import)
import Records from "./Components/Records/Records";

function App() {
  return (
    <DropdownProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/forget_password" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/setpassword" element={<SetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/service" element={<Service />} />
          <Route path="/predictdisease" element={<DiseasePrediction />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/upload-prescription" element={<PrescriptionUpload />} />
          <Route path="/healthchatbot" element={<HealthChatbot />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/doctor" element={<DoctorList />} />

          {/* Doctor Routes */}
          <Route path="/doctorlogin" element={<Doctorlogin />} />
          <Route path="/doctorhomepage" element={<Doctorhomepage />} />

          {/* Payment Routes */}
          <Route path="/paymenthomepage" element={<PaymentHomepage />} />
          <Route path="/paymentforstripe" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />

          {/* Profile Routes */}
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

          {/* Admin Routes */}
          <Route path="/loginadmin" element={<Adminlogin />} />
          <Route path="/registeradmin" element={<Adminregister />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

          {/* Appointments + Video */}
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/video-call/:roomName" element={<VideoCall />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />

          {/* ✅ Records Route */}
          <Route path="/records" element={<Records />} />
        </Routes>
      </Router>
    </DropdownProvider>
  );
}

export default App;
