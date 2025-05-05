import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Gamepad2, Users, BarChart3 } from 'lucide-react';
import furiaImage from '../imgs/furia.png';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield size={48} className="text-furia-accent" />,
      title: 'Secure Profile',
      description: 'Create your secure fan profile with basic information and interests'
    },
    {
      icon: <Gamepad2 size={48} className="text-furia-accent" />,
      title: 'Gaming Preferences',
      description: 'Share your gaming preferences and FURIA team favorites'
    },
    {
      icon: <Users size={48} className="text-furia-accent" />,
      title: 'Social Integration',
      description: 'Connect your social media accounts to enhance your fan profile'
    },
    {
      icon: <BarChart3 size={48} className="text-furia-accent" />,
      title: 'Fan Insights',
      description: 'Get personalized insights about your fandom and engagement'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="relative bg-furia-black text-white py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-furia-black to-transparent opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7915547/pexels-photo-7915547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-furia-accent">Know</span> Your Fan
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join the FURIA fan community and help us understand what makes you the ultimate fan. Share your preferences, connect your social profiles, and get personalized content.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="rounded-full bg-furia-accent p-1">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-200">Create your secure fan profile</span>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-furia-accent p-1">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-200">Connect your social media accounts</span>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-furia-accent p-1">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-200">Get personalized FURIA content</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 bg-furia-gray bg-opacity-90 p-8 rounded-lg shadow-2xl">
            <div className="flex mb-6 border-b border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'login'
                    ? 'text-furia-accent border-b-2 border-furia-accent'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'register'
                    ? 'text-furia-accent border-b-2 border-furia-accent'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 rounded-md bg-error bg-opacity-20 text-white text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {activeTab === 'register' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 bg-furia-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 bg-furia-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 bg-furia-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-furia-accent hover:bg-furia-accent/90 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : null}
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Build Your Ultimate Fan Profile</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform helps FURIA understand their fans better through a comprehensive profile system that analyzes your preferences and engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
              src={furiaImage} 
              alt="FURIA esports fan" 
              className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-display font-bold mb-6">
                Why We Want to <span className="text-furia-accent">Know Our Fans</span>
              </h2>
              <p className="text-gray-600 mb-6">
                At FURIA, our fans are the heart of everything we do. By understanding who you are, what you love, and how you engage with us, we can create more personalized experiences, better content, and stronger connections.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                      <span className="text-xs font-bold">1</span>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">Personalized content curated to your interests</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                      <span className="text-xs font-bold">2</span>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">Special access to events and experiences</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                      <span className="text-xs font-bold">3</span>
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">Exclusive merchandise offers tailored to your preferences</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;