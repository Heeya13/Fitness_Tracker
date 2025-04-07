import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/gym-background.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signIn');
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Login/Signup buttons in top right */}
      <div className="fixed top-4 right-4 flex space-x-4 z-50">
        <button 
          className="bg-transparent hover:text-purple-300 px-6 py-2 border border-purple-300 rounded cursor-pointer"
          onClick={handleLogin}
          type="button"
        >
          Log In
        </button>
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded cursor-pointer"
          onClick={handleSignUp}
          type="button"
        >
          Sign Up
        </button>
      </div>

      {/* Main content positioned on the left */}
      <div className="pt-60 pl-8 relative z-10">
        <h2 className="text-2xl mb-2 text-left">Body Sync - Functional Fitness Studio</h2>
        <h1 className="text-7xl font-bold mb-12 leading-tight text-left">
          Where Fitness<br />
          Becomes Your Lifestyle
        </h1>
      </div>
    </div>
  );
};

export default Home;

