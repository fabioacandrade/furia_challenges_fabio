import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  BarChart3, Users, Eye, Star, Activity, Calendar, Gamepad2, 
  ShoppingBag, TrendingUp, Award, Medal, Target, X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import ChatbotModal from '../components/chatbotLLM/ChatbotModal';
import jerseyImage from '../imgs/qwq5w-1500x1500.jpg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface Profile {
  fullName: string;
  interests: string[];
  favoriteGames: string[];
  favoritePlayers: string[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [workshopRegistration, setWorkshopRegistration] = useState<{
    date: string;
    time: string;
    registered: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Game interest distribution data based on user's favorite games
  const gameInterestData = {
    labels: profile?.favoriteGames || [],
    datasets: [
      {
        label: 'Engagement Level',
        data: profile?.favoriteGames?.map(() => Math.floor(Math.random() * 50) + 50) || [],
        backgroundColor: [
          'rgba(255, 107, 0, 0.8)',
          'rgba(255, 107, 0, 0.6)',
          'rgba(255, 107, 0, 0.4)',
          'rgba(255, 107, 0, 0.3)',
          'rgba(255, 107, 0, 0.2)',
        ],
        borderColor: Array(5).fill('rgb(255, 107, 0)'),
        borderWidth: 1,
      },
    ],
  };

  // Activity timeline data
  const monthlyActivityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Social Media Activity',
        data: [12, 19, 15, 22, 30, 25],
        backgroundColor: 'rgba(0, 163, 255, 0.2)',
        borderColor: 'rgb(0, 163, 255)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Website Visits',
        data: [8, 15, 12, 17, 22, 18],
        backgroundColor: 'rgba(255, 107, 0, 0.2)',
        borderColor: 'rgb(255, 107, 0)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Fan engagement by platform
  const platformEngagementData = {
    labels: profile?.interests || [],
    datasets: [
      {
        label: 'Engagement Score',
        data: profile?.interests?.map(() => Math.floor(Math.random() * 30) + 50) || [],
        backgroundColor: 'rgba(0, 163, 255, 0.6)',
        borderColor: 'rgb(0, 163, 255)',
        borderWidth: 1,
      },
    ],
  };

  // Fan persona data based on user's profile
  const fanPersonaData = {
    labels: ['Game Knowledge', 'Social Activity', 'Merchandise', 'Event Attendance', 'Content Consumption', 'Team Loyalty'],
    datasets: [
      {
        label: 'Your Fan Profile',
        data: [
          profile?.favoriteGames?.length ? (profile.favoriteGames.length / 10) * 100 : 0,
          75,
          60,
          40,
          profile?.interests?.length ? (profile.interests.length / 10) * 100 : 0,
          profile?.favoritePlayers?.length ? (profile.favoritePlayers.length / 10) * 100 : 0,
        ],
        backgroundColor: 'rgba(255, 107, 0, 0.2)',
        borderColor: 'rgb(255, 107, 0)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(255, 107, 0)',
      },
      {
        label: 'Average Fan',
        data: [65, 60, 50, 35, 70, 75],
        backgroundColor: 'rgba(0, 163, 255, 0.2)',
        borderColor: 'rgb(0, 163, 255)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(0, 163, 255)',
      },
    ],
  };

  // Stat cards data based on profile
  const statCards = [
    { 
      title: 'Fan Persona', 
      value: profile?.favoritePlayers?.length ? 'Super Fan' : 'New Fan',
      description: profile?.favoritePlayers?.length ? 'Top 5% of all FURIA fans' : 'Welcome to FURIA!',
      icon: <Award size={24} className="text-furia-accent" />,
      color: 'bg-gradient-to-br from-furia-accent to-amber-500',
    },
    { 
      title: 'Engagement Score', 
      value: `${profile?.interests?.length ? profile.interests.length * 10 : 0}/100`,
      description: profile?.interests?.length ? '15% above average' : 'Start engaging!',
      icon: <Activity size={24} className="text-blue-500" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    { 
      title: 'Games Followed', 
      value: profile?.favoriteGames?.length || 0,
      description: 'Active games',
      icon: <Gamepad2 size={24} className="text-green-500" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    { 
      title: 'Favorite Players', 
      value: profile?.favoritePlayers?.length || 0,
      description: 'FURIA players followed',
      icon: <Users size={24} className="text-purple-500" />,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    },
  ];

  const handleWorkshopRegistration = () => {
    const now = new Date();
    const registrationDate = now.toLocaleDateString('pt-BR');
    const registrationTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setWorkshopRegistration({
      date: registrationDate,
      time: registrationTime,
      registered: true
    });
    setIsWorkshopModalOpen(false);
  };

  // Recommendation cards based on user interests
  const recommendationCards = [
    {
      title: 'OFICIAL FURIA JERSEY',
      type: 'Merchandise',
      description: 'JERSEY',
      icon: <ShoppingBag size={20} />,
      cta: 'Shop Now',
      image: jerseyImage,
    },
    {
      title: profile?.favoriteGames?.[0] ? `${profile.favoriteGames[0]} Pro Workshop` : 'CS2 Pro Workshop',
      type: 'Event',
      description: 'Training session with FURIA pros',
      icon: <Target size={20} />,
      cta: 'Register',
      image: 'https://images.pexels.com/photos/7915559/pexels-photo-7915559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: profile?.favoritePlayers?.[0] ? `Q&A with ${profile.favoritePlayers[0]}` : 'FURIA Player Q&A Session',
      type: 'Content',
      description: 'Exclusive Q&A with your favorite players',
      icon: <Users size={20} />,
      cta: 'Watch',
      image: 'https://images.pexels.com/photos/7915575/pexels-photo-7915575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-furia-accent"></div>
        <p className="ml-3 text-xl font-medium text-furia-accent">Loading your fan insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Fan Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile?.fullName || user?.name}! Here's your personalized FURIA fan insights.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`h-2 ${stat.color}`}></div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="rounded-full p-2 bg-gray-50">{stat.icon}</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Game Interest Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Game Interests</h2>
            <Gamepad2 size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Pie 
              data={gameInterestData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Fan Persona Radar */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Fan Persona</h2>
            <Users size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Radar 
              data={fanPersonaData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                    pointLabels: {
                      font: {
                        size: 10,
                      },
                    },
                    ticks: {
                      display: false,
                      maxTicksLimit: 5,
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Platform Engagement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Platform Engagement</h2>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Bar 
              data={platformEngagementData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Activity Timeline</h2>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Line 
              data={monthlyActivityData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Workshop Modal */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Pro Workshop Details</h3>
              <button
                onClick={() => setIsWorkshopModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Join our exclusive workshop with FURIA's professional players. Learn advanced strategies, 
                get personalized tips, and improve your gameplay.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Workshop Details:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Duration: 2 hours</li>
                  <li>• Platform: Discord</li>
                  <li>• Max Participants: 20</li>
                  <li>• Requirements: Basic game knowledge</li>
                </ul>
              </div>
              <button
                onClick={handleWorkshopRegistration}
                className="w-full py-2 px-4 bg-furia-accent text-white rounded-md hover:bg-furia-accent/90 transition-colors duration-200"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Registration Status */}
      {workshopRegistration && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workshop Registration</h3>
              <p className="text-gray-600">
                You are registered for the workshop on {workshopRegistration.date} at {workshopRegistration.time}
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Registered
            </div>
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
          <span className="text-sm text-gray-500">Based on your interests</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendationCards.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-2">
                  <div className="rounded-full p-1.5 bg-furia-accent bg-opacity-10 text-furia-accent">
                    {item.icon}
                  </div>
                  <span className="ml-2 text-xs font-medium text-furia-accent">{item.type}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <button 
                  className="w-full py-2 px-4 bg-furia-accent text-white rounded-md hover:bg-furia-accent/90 transition-colors duration-200"
                  onClick={() => {
                    if (item.cta === 'Shop Now') {
                      window.open('https://www.furia.gg/produto/camiseta-furia-adidas-preta-150263', '_blank');
                    } else if (item.cta === 'Register') {
                      setIsWorkshopModalOpen(true);
                    } else if (item.cta === 'Watch') {
                      window.open('https://www.instagram.com/reel/DJPykAip1A6/', '_blank');
                    }
                  }}
                >
                  {item.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fan Badges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Fan Badges</h2>
          <span className="text-sm text-gray-500">
            {profile?.interests?.length ? `${Math.min(profile.interests.length, 4)} of 8 badges earned` : '0 of 8 badges earned'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Super Fan', icon: <Star className="text-yellow-500" />, earned: (profile?.favoritePlayers?.length ?? 0) > 3 },
            { name: 'Social Butterfly', icon: <Users className="text-blue-500" />, earned: (profile?.interests?.length ?? 0) > 3 },
            { name: 'Content Creator', icon: <Eye className="text-purple-500" />, earned: false },
            { name: 'Event Attendee', icon: <Calendar className="text-green-500" />, earned: (profile?.interests?.length ?? 0) > 0 },
            { name: 'Merchandise Collector', icon: <ShoppingBag className="text-red-500" />, earned: false },
            { name: 'Community Leader', icon: <Award className="text-furia-accent" />, earned: (profile?.favoriteGames?.length ?? 0) > 3 },
            { name: 'Game Expert', icon: <Gamepad2 className="text-indigo-500" />, earned: (profile?.favoriteGames?.length ?? 0) > 2 },
            { name: 'Team Historian', icon: <Medal className="text-amber-500" />, earned: (profile?.favoritePlayers?.length ?? 0) > 5 },
          ].map((badge, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                badge.earned 
                  ? 'bg-gray-50 border border-gray-200' 
                  : 'bg-gray-100 border border-gray-200 opacity-50'
              }`}
            >
              <div className={`rounded-full p-3 ${badge.earned ? 'bg-white' : 'bg-gray-200'} mb-2`}>
                {badge.icon}
              </div>
              <p className="text-sm font-medium text-center">{badge.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {badge.earned ? 'Earned' : 'Locked'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ChatbotModal />
    </div>
  );
};

export default DashboardPage;