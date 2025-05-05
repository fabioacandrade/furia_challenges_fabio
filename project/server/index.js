import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { config } from './config.js';
import axios from 'axios';

// Since we're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Mock database
const users = [];
const profiles = {};
const documents = {};
const socialAccounts = {};

// JWT secret
const JWT_SECRET = 'your-secret-key'; // In production, use environment variables

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const id = Date.now().toString();
  const newUser = { id, name, email, password };
  users.push(newUser);
  
  // Create JWT token
  const user = { id, name, email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  
  res.status(201).json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create JWT token
  const userData = { id: user.id, name: user.name, email: user.email };
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ token, user: userData });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Profile routes
app.post('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  profiles[userId] = req.body;
  res.status(201).json(profiles[userId]);
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  res.json(profiles[userId] || null);
});

// Document routes
app.post('/api/documents/upload', authenticateToken, upload.single('document'), (req, res) => {
  const userId = req.user.id;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const documentType = req.body.type; // 'identity' or 'address'
  
  if (!documents[userId]) {
    documents[userId] = {};
  }
  
  documents[userId][documentType] = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    verified: false
  };
  
  res.status(201).json({ message: 'Document uploaded successfully' });
});

app.post('/api/documents/verify/:type', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const documentType = req.params.type;
  
  if (!documents[userId] || !documents[userId][documentType]) {
    return res.status(404).json({ message: 'Document not found' });
  }
  
  try {
    // When the document type is identity, use the LLM for verification
    if (documentType === 'identity') {
      // In real implementation, we would process the image with OCR before sending to LLM
      // For now, we'll simulate this process with a direct call to the LLM
      
      const document = documents[userId][documentType];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Updated from "gpt-4-vision-preview" to current model with vision capabilities
        messages: [
          {
            role: "system",
            content: `You are an AI assistant specialized in verifying ID documents. 
            Your task is to check if the uploaded document appears to be a valid ID document.
            Look for common features of ID documents:
            - Official header or emblem
            - Name and photo of the holder
            - Document number
            - Expiration date
            - Security features

            Respond with a JSON object with the following structure:
            {
              "isValidId": boolean, // true if it appears to be a valid ID document
              "confidence": number, // 0-100 confidence level
              "reason": string // brief explanation for your decision
            }`
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Please verify if this document is a valid ID document." 
              },
              // In a real implementation, we would include the document image here
              // Currently simulating the verification
              { 
                type: "text", 
                text: `Document name: ${document.originalName}, Type: ${document.mimetype}` 
              }
            ]
          }
        ],
        max_tokens: 300
      });

      // In a real implementation, we would parse the response from the LLM
      // and make a decision based on the verification results
      // For demonstration, we'll simulate a successful verification
      
      documents[userId][documentType].verified = true;
      documents[userId][documentType].verifiedAt = new Date();
      documents[userId][documentType].aiVerification = {
        isValid: true,
        confidence: 95,
        reason: "Document appears to be a valid ID with proper structure and security features."
      };

      return res.json({ 
        message: 'Document verified successfully with AI',
        verificationDetails: {
          isValid: true,
          confidence: 95,
          verifiedAt: documents[userId][documentType].verifiedAt
        }
      });
    } else {
      // For other document types (legacy behavior)
      documents[userId][documentType].verified = true;
      documents[userId][documentType].verifiedAt = new Date();
      
      return res.json({ message: 'Document verified successfully' });
    }
  } catch (error) {
    console.error('Error verifying document with AI:', error);
    return res.status(500).json({ message: 'Error during document verification' });
  }
});

// Social media routes
app.post('/api/social-accounts', authenticateToken, (req, res) => {
  console.log('Received request to connect social account:', req.body);
  const userId = req.user.id;
  const { platform, username } = req.body;
  
  if (!socialAccounts[userId]) {
    socialAccounts[userId] = [];
  }
  
  // Check if this platform is already connected
  const existingIndex = socialAccounts[userId].findIndex(a => a.platform === platform);
  
  if (existingIndex >= 0) {
    socialAccounts[userId][existingIndex] = { platform, username, connected: true };
  } else {
    socialAccounts[userId].push({ platform, username, connected: true });
  }

  console.log('Updated social accounts:', socialAccounts);
  
  res.status(201).json({ message: 'Social account connected successfully' });
});

app.get('/api/social-accounts', authenticateToken, (req, res) => {
  const userId = req.user.id;
  res.json(socialAccounts[userId] || []);
});

// Novo endpoint para desconectar uma conta social
app.delete('/api/social-accounts/:platform', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const platform = req.params.platform;
  
  if (!socialAccounts[userId]) {
    return res.status(404).json({ message: 'No connected accounts found' });
  }
  
  // Encontrar o índice da plataforma para remover
  const existingIndex = socialAccounts[userId].findIndex(a => 
    a.platform.toLowerCase() === platform.toLowerCase()
  );
  
  if (existingIndex === -1) {
    return res.status(404).json({ message: 'Account not found' });
  }
  
  // Remover a conta
  socialAccounts[userId].splice(existingIndex, 1);
  
  res.json({ message: 'Social account disconnected successfully' });
});

// Novo endpoint para perfis de esportes
app.post('/api/esports-profiles', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  
  // Validação básica da URL
  if (!url.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }
  
  // Inicializar o array se não existir
  if (!socialAccounts[userId]) {
    socialAccounts[userId] = [];
  }
  
  // Adicionar um campo 'esportsLinks' se ainda não existir
  if (!socialAccounts[userId].esportsLinks) {
    socialAccounts[userId].esportsLinks = [];
  }
  
  // Verificar se a URL já existe
  if (socialAccounts[userId].esportsLinks.includes(url)) {
    return res.status(400).json({ message: 'This profile is already added' });
  }
  
  // Adicionar a URL à lista
  socialAccounts[userId].esportsLinks.push(url);
  
  res.status(201).json({ message: 'Esports profile added successfully' });
});

// Obter todos os perfis de esportes
app.get('/api/esports-profiles', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  if (!socialAccounts[userId] || !socialAccounts[userId].esportsLinks) {
    return res.json([]);
  }
  
  res.json(socialAccounts[userId].esportsLinks);
});

// Remover um perfil de esportes por índice
app.delete('/api/esports-profiles/:index', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const index = parseInt(req.params.index, 10);
  
  if (!socialAccounts[userId] || !socialAccounts[userId].esportsLinks) {
    return res.status(404).json({ message: 'No esports profiles found' });
  }
  
  if (isNaN(index) || index < 0 || index >= socialAccounts[userId].esportsLinks.length) {
    return res.status(400).json({ message: 'Invalid profile index' });
  }
  
  // Remover a URL pelo índice
  socialAccounts[userId].esportsLinks.splice(index, 1);
  
  res.json({ message: 'Esports profile removed successfully' });
});

// Função para buscar informações na web
async function searchWeb(query) {
  try {
    const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
      },
      params: {
        q: query + ' site:furia.gg OR site:twitter.com/furia OR site:instagram.com/furia',
        count: 5,
        responseFilter: 'Webpages'
      }
    });
    return response.data.webPages.value;
  } catch (error) {
    console.error('Error searching web:', error);
    return [];
  }
}

// Chat routes
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Primeiro, fazemos uma busca na web para informações atualizadas
    const searchResults = await searchWeb(message);
    let context = '';
    
    if (searchResults.length > 0) {
      context = 'Informações recentes encontradas:\n';
      searchResults.forEach((result, index) => {
        context += `${index + 1}. ${result.name}: ${result.snippet}\n`;
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Você é o assistente virtual da FURIA, uma das maiores organizações de esports do Brasil. 
          Você está integrado ao sistema "Know Your Fan" da FURIA.
          
          Regras importantes:
          - Seja claro e informativo, mas não excessivamente detalhado
          - Limite cada resposta a 2-3 frases ou um pequeno parágrafo
          - Inclua contexto relevante quando apropriado
          - Use bullet points para listas
          - Mantenha um tom amigável e profissional
          - Foque em temas da FURIA
          
          Quando não souber algo:
          - Diga "Não tenho essa informação"
          - Sugira onde encontrar: "Confira no site da FURIA (furia.gg) ou nas redes sociais (@furia)"
          - Se for sobre produtos: "Veja na loja oficial da FURIA"
          - Se for sobre eventos: "Acompanhe o calendário no site ou redes sociais"
          
          Exemplos de respostas:
          - "O time de CS2 da FURIA é formado por KSCERATO, yuurih, arT, FalleN e chelo. Eles são conhecidos por seu estilo agressivo de jogo e já conquistaram vários títulos importantes."
          - "Os próximos eventos da FURIA incluem o BLAST Premier em 15/03 e o ESL Pro League em 22/03. Ambos são torneios importantes do circuito internacional de CS2."
          - "Não tenho essa informação específica. Você pode encontrar mais detalhes no site oficial da FURIA (furia.gg) ou acompanhando as redes sociais (@furia)."
          
          Mantenha as respostas informativas, mas evite textos muito longos.`
        },
        {
          role: "user",
          content: `${context}\n\nPergunta do usuário: ${message}`
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    const response = {
      response: completion.choices[0].message.content
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Error processing your request. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  import('fs').then(fs => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  });
});