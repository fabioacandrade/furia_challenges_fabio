import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, Check, ChevronRight, AlertTriangle, FileText, X } from 'lucide-react';

type FileWithPreview = File & {
  preview?: string;
  status?: 'pending' | 'verifying' | 'verified' | 'failed';
  message?: string;
};

// Interface para armazenar os dados do documento no localStorage
interface StoredDocumentState {
  name: string;
  size: number;
  type?: string;
  status: 'pending' | 'verifying' | 'verified' | 'failed';
  message?: string;
  verifiedAt?: string;
}

// Interface para o documento verificado sem ser um File real
interface VerifiedDocument {
  name: string;
  size: number;
  type?: string;
  status: 'verified';
  message?: string;
  preview?: string;
}

const DocumentsPage: React.FC = () => {
  const [identityDoc, setIdentityDoc] = useState<FileWithPreview | VerifiedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Recuperar o estado salvo ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Extrair o userId do token JWT para usar como chave única para cada usuário
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const storedState = localStorage.getItem(`document_verification_${userId}`);

      if (storedState) {
        const docState: StoredDocumentState = JSON.parse(storedState);

        // Verificar se o estado salvo tem status 'verified'
        if (docState.status === 'verified') {
          // Em vez de tentar criar um File/Blob, usamos um objeto simples
          const verifiedDoc: VerifiedDocument = {
            name: docState.name,
            size: docState.size,
            type: docState.type,
            status: 'verified',
            message: docState.message || 'Identity document verified successfully with AI'
          };

          setIdentityDoc(verifiedDoc);
        }
      }
    } catch (e) {
      console.error("Erro ao recuperar estado de verificação:", e);
    }
  }, []);

  // Função auxiliar para salvar o estado no localStorage
  const saveDocumentState = (doc: FileWithPreview | VerifiedDocument) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const stateToSave: StoredDocumentState = {
        name: doc.name,
        size: doc.size,
        type: doc.type,
        status: doc.status || 'pending',
        message: doc.message,
        verifiedAt: new Date().toISOString()
      };

      // Se o documento for verificado, salvar estado
      if (doc.status === 'verified') {
        localStorage.setItem(`document_verification_${userId}`, JSON.stringify(stateToSave));
      }
    } catch (e) {
      console.error("Erro ao salvar estado de verificação:", e);
    }
  };

  const onDropIdentity = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0] as FileWithPreview;
    file.preview = URL.createObjectURL(file);
    file.status = 'pending';
    setIdentityDoc(file);
  }, []);

  const { getRootProps: getIdentityRootProps, getInputProps: getIdentityInputProps } = useDropzone({
    onDrop: onDropIdentity,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const handleVerifyDocument = async () => {
    if (!identityDoc) {
      setError('Please upload an identity document');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Update status to verifying
      if (identityDoc) {
        setIdentityDoc({ ...identityDoc, status: 'verifying' });
      }

      // Create FormData and append the document
      const formData = new FormData();
      formData.append('document', identityDoc);
      formData.append('type', 'identity');

      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      // Upload the document to the server
      const uploadResponse = await axios.post(
        'http://localhost:5000/api/documents/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Now verify the document using LLM on the server
      const verifyResponse = await axios.post(
        'http://localhost:5000/api/documents/verify/identity',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Se a verificação for bem-sucedida
      const verifiedDoc = {
        ...identityDoc,
        status: 'verified',
        message: 'Identity document verified successfully with AI'
      };

      setIdentityDoc(verifiedDoc);

      // Salvar o estado da verificação no localStorage
      saveDocumentState(verifiedDoc);

    } catch (error) {
      console.error('Document verification failed:', error);

      if (identityDoc && identityDoc.status === 'verifying') {
        setIdentityDoc({
          ...identityDoc,
          status: 'failed',
          message: 'Verification failed, please try again'
        });
      }

      setError('Document verification failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeIdentityDoc = () => {
    // Só precisamos revogar a URL se for um objeto File real com preview
    if ('preview' in identityDoc && identityDoc.preview && typeof identityDoc.preview === 'string') {
      URL.revokeObjectURL(identityDoc.preview);
    }

    // Remover o estado do localStorage quando o documento for removido
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        localStorage.removeItem(`document_verification_${userId}`);
      }
    } catch (e) {
      console.error("Erro ao remover estado de verificação:", e);
    }

    setIdentityDoc(null);
  };

  const navigateToNextStep = () => {
    navigate('/social-media');
  };

  const getDocumentStatusColor = (status?: string) => {
    if (!status || status === 'pending') return 'bg-gray-200';
    if (status === 'verifying') return 'bg-warning bg-opacity-20 text-warning';
    if (status === 'verified') return 'bg-success bg-opacity-20 text-success';
    if (status === 'failed') return 'bg-error bg-opacity-20 text-error';
    return 'bg-gray-200';
  };

  const getDocumentStatusIcon = (status?: string) => {
    if (status === 'verifying') {
      return <div className="animate-spin h-5 w-5 border-2 border-warning border-t-transparent rounded-full"></div>;
    }
    if (status === 'verified') return <Check size={20} />;
    if (status === 'failed') return <AlertTriangle size={20} />;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Identity Verification</h1>
        <p className="mt-2 text-gray-600">
          Upload your ID document for AI verification to complete your fan profile.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Document Upload</h2>
          <p className="text-gray-600 mb-6">
            Please upload a clear, high-quality image or PDF of your ID document.
            Your document will be securely analyzed by our AI system.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-error bg-opacity-20 text-error text-sm">
              {error}
            </div>
          )}

          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Identity Document (ID/Passport)
            </label>
            {!identityDoc ? (
              <div 
                {...getIdentityRootProps()} 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <input {...getIdentityInputProps()} />
                <Upload size={36} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag & drop your ID or passport here, or click to select file
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Accepts JPG, PNG, PDF up to 10MB
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 relative">
                <button 
                  onClick={removeIdentityDoc}
                  className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                  <X size={16} />
                </button>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {identityDoc.type && identityDoc.type.includes('image') ? (
                      <img 
                        src={'preview' in identityDoc ? identityDoc.preview : undefined} 
                        alt="Identity document preview" 
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <FileText size={24} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {identityDoc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof identityDoc.size === 'number' && !isNaN(identityDoc.size) 
                        ? `${(identityDoc.size / 1024 / 1024).toFixed(2)} MB` 
                        : 'Tamanho desconhecido'}
                    </p>
                    
                    {identityDoc.status && (
                      <div className={`mt-2 px-2 py-1 rounded-md text-xs font-medium inline-flex items-center ${getDocumentStatusColor(identityDoc.status)}`}>
                        {getDocumentStatusIcon(identityDoc.status)}
                        <span className="ml-1">
                          {identityDoc.status === 'pending' && 'Ready to verify'}
                          {identityDoc.status === 'verifying' && 'Verifying with AI...'}
                          {identityDoc.status === 'verified' && 'Verified'}
                          {identityDoc.status === 'failed' && 'Verification failed'}
                        </span>
                      </div>
                    )}
                    
                    {identityDoc.message && (
                      <p className={`text-xs mt-1 ${
                        identityDoc.status === 'verified' ? 'text-success' : 
                        identityDoc.status === 'failed' ? 'text-error' : 'text-gray-500'
                      }`}>
                        {identityDoc.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">AI Document Verification Process</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ol className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                    <span className="text-xs font-bold">1</span>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Upload your identity document (ID card, passport, driver's license)
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                    <span className="text-xs font-bold">2</span>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Our AI system will analyze your document for authenticity
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-furia-accent text-white">
                    <span className="text-xs font-bold">3</span>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Once verified, you can proceed to connect your social media accounts
                </p>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleVerifyDocument}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-furia-blue hover:bg-furia-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-furia-blue transition-colors duration-200"
            disabled={isUploading || !identityDoc}
          >
            {isUploading ? (
              <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Verify with AI
          </button>

          <button
            onClick={navigateToNextStep}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-furia-accent hover:bg-furia-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-furia-accent transition-colors duration-200"
            disabled={!identityDoc || identityDoc.status !== 'verified'}
          >
            Continue to Social Media
            <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;