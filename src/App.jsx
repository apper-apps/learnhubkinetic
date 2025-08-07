import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import Membership from "@/components/pages/Membership";
import Master from "@/components/pages/Master";
import Insights from "@/components/pages/Insights";
import Reviews from "@/components/pages/Reviews";
import VideoPlayer from "@/components/pages/VideoPlayer";
import BlogPost from "@/components/pages/BlogPost";
import Admin from "@/components/pages/Admin";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership/video/:videoId" element={<VideoPlayer />} />
            <Route path="/master" element={<Master />} />
            <Route path="/master/video/:videoId" element={<VideoPlayer />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/post/:postId" element={<BlogPost />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;