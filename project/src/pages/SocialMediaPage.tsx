import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Twitter, Twitch, Instagram, Youtube, Link as LinkIcon, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

interface SocialAccount {
  platform: string;
  username: string;
  connected: boolean;
  profileUrl?: string;
  status?: 'connecting' | 'connected' | 'failed';
  error?: string;
  stats?: {
    followers: number;
    posts: number;
    engagement: string;
    furiaRelated: number;
  };
}

const SocialMediaPage: React.FC = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'Twitter', username: '', connected: false },
    { platform: 'Instagram', username: '', connected: false },
    { platform: 'Twitch', username: '', connected: false },
    { platform: 'YouTube', username: '', connected: false }
  ]);
  
  const [esportsLinks, setEsportsLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [linkVerified, setLinkVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const navigate = useNavigate();

  // Buscar contas conectadas ao carregar a página
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/social-accounts');
        
        if (response.data && response.data.length > 0) {
          // Cria uma cópia do estado atual
          const updatedAccounts = [...socialAccounts];
          
          // Atualiza as contas já conectadas
          response.data.forEach((connectedAccount: any) => {
            const index = updatedAccounts.findIndex(
              account => account.platform.toLowerCase() === connectedAccount.platform.toLowerCase()
            );
            
            if (index !== -1) {
              updatedAccounts[index] = {
                ...updatedAccounts[index],
                username: connectedAccount.username,
                connected: true,
                profileUrl: `https://${connectedAccount.platform.toLowerCase()}.com/${connectedAccount.username}`,
                status: 'connected',
                stats: {
                  followers: Math.floor(Math.random() * 5000) + 100,
                  posts: Math.floor(Math.random() * 300) + 10,
                  engagement: `${(Math.random() * 5 + 1).toFixed(1)}%`,
                  furiaRelated: Math.floor(Math.random() * 30) + 1
                }
              };
            }
          });
          
          setSocialAccounts(updatedAccounts);
        }
      } catch (error) {
        console.error('Failed to fetch connected accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isConnecting) {
      fetchConnectedAccounts();
    }
  }, [isConnecting]);

  // Função para carregar os links de perfis de esportes ao inicializar a página
  useEffect(() => {
    const fetchEsportsLinks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/esports-profiles');
        if (response.data && Array.isArray(response.data)) {
          setEsportsLinks(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch esports profiles:', error);
      }
    };
    
    fetchEsportsLinks();
  }, []);

  const handleUsernameChange = (index: number, value: string) => {
    const updated = [...socialAccounts];
    updated[index].username = value;
    setSocialAccounts(updated);
  };

  const connectAccount = async (index: number) => {
    const account = socialAccounts[index];
    
    if (!account.username) return;
    
    const updated = [...socialAccounts];
    updated[index].status = 'connecting';
    updated[index].error = undefined;
    setSocialAccounts(updated);
    setIsConnecting(true);
    
    try {
      // Fazer requisição para a API
      const response = await axios.post('http://localhost:5000/api/social-accounts', {
        platform: account.platform,
        username: account.username
      });
      
      // Verificar se a conexão foi bem sucedida
      if (response.status === 201) {
        // Após conectar, buscar dados da conta
        const profileUrl = `https://${account.platform.toLowerCase()}.com/${account.username}`;
        
        // Em uma aplicação real, esses dados seriam retornados pela API
        // Por ora, ainda usaremos alguns dados simulados para estatísticas
        updated[index].connected = true;
        updated[index].status = 'connected';
        updated[index].profileUrl = profileUrl;
        updated[index].stats = {
          followers: Math.floor(Math.random() * 5000) + 100,
          posts: Math.floor(Math.random() * 300) + 10,
          engagement: `${(Math.random() * 5 + 1).toFixed(1)}%`,
          furiaRelated: Math.floor(Math.random() * 30) + 1
        };
        
        setSocialAccounts(updated);
      } else {
        throw new Error('Falha ao conectar conta');
      }
    } catch (error) {
      console.error(`Failed to connect ${account.platform}:`, error);
      
      updated[index].status = 'failed';
      updated[index].error = 'Falha ao conectar conta. Tente novamente.';
      setSocialAccounts(updated);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectAccount = async (index: number) => {
    const account = socialAccounts[index];
    const updated = [...socialAccounts];
    setIsConnecting(true);
    
    try {
      // Atualizar UI para mostrar que está desconectando
      updated[index].status = 'connecting';
      setSocialAccounts(updated);
      
      // Fazer requisição para a API usando o novo endpoint DELETE
      await axios.delete(`http://localhost:5000/api/social-accounts/${account.platform}`);
      
      // Resetar os dados da conta após a desconexão bem-sucedida
      updated[index] = {
        ...updated[index],
        username: '',
        connected: false,
        status: undefined,
        stats: undefined,
        profileUrl: undefined
      };
      
      setSocialAccounts(updated);
    } catch (error) {
      console.error(`Failed to disconnect ${account.platform}:`, error);
      
      // Reverter para estado conectado em caso de erro
      updated[index].status = 'connected';
      setSocialAccounts(updated);
      
      // Mostrar mensagem de erro
      updated[index].error = 'Falha ao desconectar conta. Tente novamente.';
      setSocialAccounts([...updated]);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink) return;
    
    // Validação básica da URL
    if (!newLink.startsWith('http')) {
      setLinkError('Por favor, insira uma URL válida começando com http:// ou https://');
      return;
    }
    
    setLinkError(null);
    setIsVerifyingLink(true);
    
    try {
      // Fazer requisição para a API
      const response = await axios.post('http://localhost:5000/api/esports-profiles', {
        url: newLink
      });
      
      // Verificar se a adição foi bem-sucedida
      if (response.status === 201) {
        // Adicionar o link à lista local
        setEsportsLinks([...esportsLinks, newLink]);
        setNewLink('');
        setLinkVerified(true);
        
        // Resetar o status de verificado após um tempo
        setTimeout(() => {
          setLinkVerified(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Failed to add esports profile:', error);
      setLinkError(error.response?.data?.message || 'Não foi possível verificar este link como um perfil de esportes');
    } finally {
      setIsVerifyingLink(false);
    }
  };

  const removeLink = async (index: number) => {
    try {
      // Fazer requisição para a API
      await axios.delete(`http://localhost:5000/api/esports-profiles/${index}`);
      
      // Se a remoção for bem-sucedida, atualizar o estado local
      const updated = [...esportsLinks];
      updated.splice(index, 1);
      setEsportsLinks(updated);
    } catch (error) {
      console.error('Failed to remove esports profile:', error);
      // Opcionalmente, mostrar uma mensagem de erro para o usuário
    }
  };

  const navigateToNextStep = () => {
    navigate('/dashboard');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return <Twitter size={20} />;
      case 'Instagram':
        return <Instagram size={20} />;
      case 'Twitch':
        return <Twitch size={20} />;
      case 'YouTube':
        return <Youtube size={20} />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return 'text-[#1DA1F2]';
      case 'Instagram':
        return 'text-[#E1306C]';
      case 'Twitch':
        return 'text-[#9146FF]';
      case 'YouTube':
        return 'text-[#FF0000]';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Connect Your Accounts</h1>
        <p className="mt-2 text-gray-600">
          Link your social media and esports profiles to enhance your FURIA fan experience.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-10 mb-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-furia-accent"></div>
          <span className="ml-3 text-furia-accent font-medium">Carregando suas contas...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media Accounts</h2>
            <p className="text-gray-600 mb-6">
              Connect your social media accounts to share your gaming interests and activity.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {socialAccounts.map((account, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                      <div className={`${getPlatformColor(account.platform)}`}>
                        {getPlatformIcon(account.platform)}
                      </div>
                      <span className="ml-2 font-medium">{account.platform}</span>
                      
                      {account.connected && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success bg-opacity-20 text-success">
                          <CheckCircle size={12} className="mr-1" />
                          Connected
                        </span>
                      )}
                    </div>

                    {!account.connected ? (
                      <div className="flex items-center w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder={`${account.platform} username`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent mr-2"
                          value={account.username}
                          onChange={(e) => handleUsernameChange(index, e.target.value)}
                        />
                        <button
                          onClick={() => connectAccount(index)}
                          disabled={!account.username || account.status === 'connecting'}
                          className="px-3 py-2 bg-furia-blue text-white rounded-md hover:bg-furia-blue/90 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                        >
                          {account.status === 'connecting' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          ) : null}
                          Connect
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <a 
                          href={account.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-furia-blue hover:underline mr-4"
                        >
                          @{account.username}
                        </a>
                        <button
                          onClick={() => disconnectAccount(index)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>

                  {account.error && (
                    <div className="mt-2 text-sm text-error flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {account.error}
                    </div>
                  )}

                  {account.connected && account.stats && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Account Analytics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Followers</p>
                          <p className="text-lg font-semibold">{account.stats.followers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Posts</p>
                          <p className="text-lg font-semibold">{account.stats.posts.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Engagement</p>
                          <p className="text-lg font-semibold">{account.stats.engagement}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">FURIA mentions</p>
                          <p className="text-lg font-semibold">{account.stats.furiaRelated}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Esports Profiles</h2>
            <p className="text-gray-600 mb-6">
              Add links to your profiles on esports platforms (FACEIT, ESEA, Gamersclub, etc.)
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Esports Profile Link
              </label>
              <div className="flex">
                <div className="flex-1 flex items-center relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-accent"
                    placeholder="https://faceit.com/en/players/yourusername"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                  {linkVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CheckCircle size={16} className="text-success" />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddLink}
                  disabled={!newLink || isVerifyingLink}
                  className="ml-2 px-4 py-2 bg-furia-blue text-white rounded-md hover:bg-furia-blue/90 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {isVerifyingLink ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : null}
                  Add Link
                </button>
              </div>
              {linkError && (
                <p className="mt-1 text-sm text-error">
                  {linkError}
                </p>
              )}
            </div>

            {esportsLinks.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {esportsLinks.map((link, index) => (
                    <li key={index} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-furia-accent bg-opacity-10">
                            <LinkIcon size={16} className="text-furia-accent" />
                          </div>
                        </div>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-3 text-sm font-medium text-furia-blue hover:underline truncate max-w-xs sm:max-w-md"
                        >
                          {link}
                        </a>
                      </div>
                      <button
                        onClick={() => removeLink(index)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border rounded-lg p-6 text-center">
                <div className="flex justify-center mb-3">
                  <LinkIcon size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No esports profiles added yet</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {socialAccounts.filter(a => a.connected).length} of {socialAccounts.length} accounts connected
            </p>

            <button
              onClick={navigateToNextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-furia-accent hover:bg-furia-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-furia-accent transition-colors duration-200"
            >
              Continue to Dashboard
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPage;