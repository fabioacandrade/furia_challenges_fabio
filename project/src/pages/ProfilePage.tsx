import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, ChevronRight } from 'lucide-react';

interface Profile {
  fullName: string;
  cpf: string;
  birthdate: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  interests: string[];
  favoriteGames: string[];
  favoritePlayers: string[];
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const interestOptions = [
    'CS2', 'Valorant', 'League of Legends', 'DOTA 2', 'Rainbow Six Siege',
    'Apex Legends', 'Overwatch', 'Fortnite', 'Call of Duty', 'FIFA'
  ];
  
  const playerOptions = [
    'KSCERATO', 'yuurih', 'arT', 'chelo', 'drop', 'saffee',
    'HEN1', 'VINI', 'guerri', 'honda'
  ];

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    cpf: Yup.string()
      .required('CPF is required')
      .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF must be in format 000.000.000-00'),
    birthdate: Yup.date().required('Birthdate is required'),
    address: Yup.object({
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('ZIP code is required'),
    }),
    interests: Yup.array().min(1, 'Select at least one interest'),
    favoriteGames: Yup.array().min(1, 'Select at least one game'),
    favoritePlayers: Yup.array(),
  });

  const formik = useFormik<Profile>({
    initialValues: {
      fullName: '',
      cpf: '',
      birthdate: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      interests: [],
      favoriteGames: [],
      favoritePlayers: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await axios.post('http://localhost:5000/api/profile', values);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to save profile:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile');
        if (response.data) {
          formik.setValues(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleToggleInterest = (interest: string) => {
    const currentInterests = [...formik.values.interests];
    if (currentInterests.includes(interest)) {
      formik.setFieldValue(
        'interests',
        currentInterests.filter(i => i !== interest)
      );
    } else {
      formik.setFieldValue('interests', [...currentInterests, interest]);
    }
  };

  const handleToggleGame = (game: string) => {
    const currentGames = [...formik.values.favoriteGames];
    if (currentGames.includes(game)) {
      formik.setFieldValue(
        'favoriteGames',
        currentGames.filter(g => g !== game)
      );
    } else {
      formik.setFieldValue('favoriteGames', [...currentGames, game]);
    }
  };

  const handleTogglePlayer = (player: string) => {
    const currentPlayers = [...formik.values.favoritePlayers];
    if (currentPlayers.includes(player)) {
      formik.setFieldValue(
        'favoritePlayers',
        currentPlayers.filter(p => p !== player)
      );
    } else {
      formik.setFieldValue('favoritePlayers', [...currentPlayers, player]);
    }
  };

  const navigateToNextStep = () => {
    navigate('/documents');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Fan Profile</h1>
        <p className="mt-2 text-gray-600">
          Tell us more about yourself so we can enhance your FURIA fan experience.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`w-full px-3 py-2 border ${
                  formik.touched.fullName && formik.errors.fullName
                    ? 'border-error'
                    : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="mt-1 text-sm text-error">{formik.errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cpf">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                className={`w-full px-3 py-2 border ${
                  formik.touched.cpf && formik.errors.cpf
                    ? 'border-error'
                    : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cpf}
              />
              {formik.touched.cpf && formik.errors.cpf && (
                <p className="mt-1 text-sm text-error">{formik.errors.cpf}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birthdate">
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                className={`w-full px-3 py-2 border ${
                  formik.touched.birthdate && formik.errors.birthdate
                    ? 'border-error'
                    : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthdate}
              />
              {formik.touched.birthdate && formik.errors.birthdate && (
                <p className="mt-1 text-sm text-error">{formik.errors.birthdate}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.street">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  className={`w-full px-3 py-2 border ${
                    formik.touched.address?.street && formik.errors.address?.street
                      ? 'border-error'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address.street}
                />
                {formik.touched.address?.street && formik.errors.address?.street && (
                  <p className="mt-1 text-sm text-error">{formik.errors.address.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.city">
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  className={`w-full px-3 py-2 border ${
                    formik.touched.address?.city && formik.errors.address?.city
                      ? 'border-error'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address.city}
                />
                {formik.touched.address?.city && formik.errors.address?.city && (
                  <p className="mt-1 text-sm text-error">{formik.errors.address.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.state">
                  State
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  className={`w-full px-3 py-2 border ${
                    formik.touched.address?.state && formik.errors.address?.state
                      ? 'border-error'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address.state}
                />
                {formik.touched.address?.state && formik.errors.address?.state && (
                  <p className="mt-1 text-sm text-error">{formik.errors.address.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address.zipCode">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  className={`w-full px-3 py-2 border ${
                    formik.touched.address?.zipCode && formik.errors.address?.zipCode
                      ? 'border-error'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address.zipCode}
                />
                {formik.touched.address?.zipCode && formik.errors.address?.zipCode && (
                  <p className="mt-1 text-sm text-error">{formik.errors.address.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Interests</h3>
            <p className="text-sm text-gray-600 mb-3">Select the esports games you're interested in.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    formik.values.interests.includes(interest)
                      ? 'bg-furia-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {formik.touched.interests && formik.errors.interests && (
              <p className="mt-1 text-sm text-error">{formik.errors.interests as string}</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Favorite Games</h3>
            <p className="text-sm text-gray-600 mb-3">Select the esports games you follow most closely.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {interestOptions.map((game) => (
                <button
                  key={game}
                  type="button"
                  onClick={() => handleToggleGame(game)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    formik.values.favoriteGames.includes(game)
                      ? 'bg-furia-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {game}
                </button>
              ))}
            </div>
            {formik.touched.favoriteGames && formik.errors.favoriteGames && (
              <p className="mt-1 text-sm text-error">{formik.errors.favoriteGames as string}</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Favorite FURIA Players</h3>
            <p className="text-sm text-gray-600 mb-3">Select your favorite FURIA players.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {playerOptions.map((player) => (
                <button
                  key={player}
                  type="button"
                  onClick={() => handleTogglePlayer(player)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    formik.values.favoritePlayers.includes(player)
                      ? 'bg-furia-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {player}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-furia-blue hover:bg-furia-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-furia-blue transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Save Profile
            </button>

            <button
              type="button"
              onClick={navigateToNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-furia-accent hover:bg-furia-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-furia-accent transition-colors duration-200"
            >
              Continue to Documents
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>

          {saveSuccess && (
            <div className="mt-4 p-3 rounded-md bg-success bg-opacity-20 text-success text-sm">
              Profile saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;