import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import lifestyleImg from "../assets/lifestyleFinal.jpg";
import academicsImg from "../assets/academics1.jpg";

function MainPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/lifestyle");
  };

  const goToAcademics = () => {
    navigate("/academics");
  };

  const goToLifestyle = () => {
    navigate("/lifestyle");
  };

  return (
    <div className="main-container">
      <section className="hero-section">
        <h2 className="animate-heading">Welcome to the Blog Platform!</h2>
        <p>Explore insightful articles, share your ideas, and connect with others.</p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </section>

      <section className="explore-section">
        <h3 className="explore-title">Explore Categories</h3>
        <div className="categories">
          <div className="category-card" onClick={goToAcademics}>
            <img src={academicsImg} alt="Academics" />
            <h4>Academics</h4>
          </div>
          <div className="category-card" onClick={goToLifestyle}>
            <img src={lifestyleImg} alt="Lifestyle" />
            <h4>Lifestyle</h4>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
