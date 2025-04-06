import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Activity, PlusCircle, List, Menu, X, TrendingUp, Calendar } from 'lucide-react';
import useGoalActivityStore from '../store/userGoalsandActivities.js';
import useUserAuthStore from '../store/userAuth';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { goals, activities, fetchGoals, fetchAllActivities, loading, error } = useGoalActivityStore();
  const { logout, user } = useUserAuthStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchGoals(), fetchAllActivities()]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
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

  // Calculate weekly statistics for the progress overview
  const calculateWeeklyStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyActivities = activities.filter(activity => 
      new Date(activity.date) >= oneWeekAgo
    );

    const totalCalories = weeklyActivities.reduce((sum, activity) => 
      sum + (activity.calories || 0), 0
    );

    const totalDistance = weeklyActivities.reduce((sum, activity) => 
      sum + (activity.distance || 0), 0
    );

    // Sum all durations (assuming they're in HH:MM:SS format)
    const totalDurationMinutes = weeklyActivities.reduce((sum, activity) => {
      if (!activity.duration) return sum;
      
      // Parse the duration string (HH:MM:SS)
      const [hours, minutes] = activity.duration.split(':').map(Number);
      
      // Convert to total minutes
      return sum + (hours * 60) + minutes;
    }, 0);
    
    // Convert total minutes to hours and minutes
    const hours = Math.floor(totalDurationMinutes / 60);
    const minutes = totalDurationMinutes % 60;
    
    // Format duration string
    const durationString = hours > 0 
      ? `${hours}h ${minutes}m` 
      : `${minutes}m`;

    return {
      totalActivities: weeklyActivities.length,
      totalCalories,
      totalDistance,
      totalDuration: totalDurationMinutes,
      durationString
    };
  };

  const weeklyStats = calculateWeeklyStats();

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
          <Link 
            to="/profile"
            className="flex items-center hover:bg-gray-800 p-2 rounded-md transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">{user?.username || 'User Profile'}</p>
              <p className="text-gray-400 text-sm">View Profile</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        {/* Content header */}
        <header className="bg-gray-900 p-4 h-16 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold ml-12 lg:ml-0">Dashboard</h2>
          
          <div className="flex items-center">
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
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

              {/* Progress overview with weekly report */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 text-purple-500" />
                  Weekly Progress Report
                </h3>
                
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {/* Weekly stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Activity className="text-purple-500" size={16} />
                          <span className="text-gray-400 text-xs">Activities</span>
                        </div>
                        <p className="text-xl font-bold text-white">{weeklyStats.totalActivities}</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <TrendingUp className="text-purple-500" size={16} />
                          <span className="text-gray-400 text-xs">Calories</span>
                        </div>
                        <p className="text-xl font-bold text-white">{weeklyStats.totalCalories}</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Target className="text-purple-500" size={16} />
                          <span className="text-gray-400 text-xs">Distance</span>
                        </div>
                        <p className="text-xl font-bold text-white">{weeklyStats.totalDistance.toFixed(1)} km</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Activity className="text-purple-500" size={16} />
                          <span className="text-gray-400 text-xs">Duration</span>
                        </div>
                        <p className="text-xl font-bold text-white">{weeklyStats.durationString}</p>
                      </div>
                    </div>
                    
                    {/* Goal progress bars */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Goal Progress</h4>
                      {goals.map(goal => (
                        <div key={goal.goal_id} className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white text-sm">{goal.goal_type}</span>
                            <span className="text-gray-400 text-xs">
                              {goal.current_value} / {goal.target_value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No progress data available</p>
                )}
              </div>
            </div>
          )}
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