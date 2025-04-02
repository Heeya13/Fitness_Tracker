import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Activity, PlusCircle, List, Menu, X } from 'lucide-react';
import useGoalActivityStore from '../store/userGoalsandActivities.js';
import useUserAuthStore from '../store/userAuth';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { goals, activities, fetchGoals, fetchAllActivities } = useGoalActivityStore();
  const { logout } = useUserAuthStore();

  useEffect(() => {
    fetchGoals();
    fetchAllActivities();
  }, [fetchGoals, fetchAllActivities]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewActivities = () => {
    navigate('/view-activities');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { title: 'Home', path: '/dashboard', icon: <Home size={20} /> },
    { title: 'Create Goal', path: '/createGoal', icon: <PlusCircle size={20} /> },
    { title: 'View Goals', path: '/viewGoals', icon: <Target size={20} /> },
    { 
      title: 'View Activities', 
      path: '/view-activities', 
      icon: <List size={20} />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - desktop always visible, mobile conditionally visible */}
      <div
        className={`fixed lg:relative z-20 h-full bg-gray-900 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64 left-0' : 'w-64 -left-64 lg:left-0'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 bg-purple-700">
          <h1 className="text-xl font-bold flex items-center">
            <Activity className="mr-2" /> Body Sync
          </h1>
        </div>

        {/* Navigation links */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">User Profile</p>
              <p className="text-gray-400 text-sm">View Profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        {/* Content header */}
        <header className="bg-gray-900 p-4 h-16 flex items-center justify-between">
          <h2 className="text-xl font-semibold ml-12 lg:ml-0">Dashboard</h2>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-800 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Total Goals</p>
                  <p className="text-2xl font-bold">{goals?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Active Goals</p>
                  <p className="text-2xl font-bold">{goals?.filter(goal => goal.current_value < goal.target_value).length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400">Completed Goals</p>
                  <p className="text-2xl font-bold">{goals?.filter(goal => goal.current_value >= goal.target_value).length || 0}</p>
                </div>
              </div>
            </div>

            {/* Recent activities */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              {activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.activity_id} className="border-t border-gray-700 pt-4">
                      <p className="text-white font-medium">{activity.activity_type}</p>
                      <p className="text-gray-400 text-sm">{formatDate(activity.date)}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-400">Calories: {activity.calories_burnt}</span>
                        <span className="text-sm text-gray-400">Distance: {activity.distance}km</span>
                        <span className="text-sm text-gray-400">Duration: {activity.duration}min</span>
                      </div>
                    </div>
                  ))}
                  {activities.length > 3 && (
                    <Link 
                      to="/view-activities" 
                      className="text-purple-400 hover:text-purple-300 text-sm mt-4 block"
                    >
                      View all activities →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No recent activities</p>
              )}
            </div>

            {/* Progress overview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
              <p className="text-gray-400">No progress data available</p>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;