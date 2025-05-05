# Know Your Fan - FURIA Esports

## Sobre o Projeto

Know Your Fan é uma plataforma desenvolvida para a FURIA Esports, uma das maiores organizações de esports do Brasil. O sistema permite a verificação de identidade dos fãs, gerenciamento de perfis e interação com a comunidade FURIA através de uma interface web moderna e responsiva.

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Chakra UI
- Vite
- React Router
- Formik + Yup (validação de formulários)
- Chart.js + React-Chartjs-2
- Framer Motion (animações)

### Backend
- Node.js
- Express
- JWT (autenticação)
- Multer (upload de arquivos)
- OpenAI API (verificação de documentos e chatbot)

## Estrutura do Projeto

```
project/
├── public/              # Arquivos estáticos
├── server/              # Backend Node.js
│   ├── config.js        # Configurações do servidor
│   ├── index.js         # Ponto de entrada do servidor
│   └── uploads/         # Diretório para uploads de documentos
├── src/                 # Frontend React
│   ├── chatbotLLM/      # Serviços e APIs para o chatbot
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── layout/      # Layout (Navbar, Footer)
│   │   └── ui/          # Componentes de interface
│   ├── context/         # Contextos React (AuthContext)
│   ├── imgs/            # Imagens e recursos
│   └── pages/           # Páginas da aplicação
```

## Funcionalidades Principais

### 1. Autenticação e Gerenciamento de Usuários
- Registro e login de usuários
- Autenticação baseada em JWT
- Rotas protegidas

### 2. Gerenciamento de Perfil
- Edição de informações pessoais
- Upload e verificação de documentos de identidade
- Conexão com redes sociais

### 3. Verificação de Documentos com IA
- Upload de documentos de identidade e comprovantes de endereço
- Verificação automatizada usando OpenAI
- Validação de autenticidade de documentos

### 4. Integração com Redes Sociais
- Conexão com diferentes plataformas sociais
- Gerenciamento de contas conectadas
- Adição e remoção de perfis de esports

### 5. Chatbot Inteligente
- Assistente virtual da FURIA alimentado por IA
- Respostas contextualizadas sobre a FURIA Esports
- Integração com informações atualizadas da organização

### 6. Dashboard
- Visualização de dados e estatísticas
- Gráficos interativos com Chart.js
- Monitoramento de atividades

## Instalação e Execução

### Pré-requisitos
- Node.js (v16 ou superior)
- NPM ou Yarn

### Configuração do Ambiente
1. Clone o repositório
2. Instale as dependências do frontend:
   ```
   cd project
   npm install
   ```
3. Instale as dependências do backend:
   ```
   cd project/server
   npm install
   ```
4. Configure o arquivo `server/config.js` com suas chaves de API

### Rodando o Projeto
- Para desenvolvimento:
  ```
  npm run dev:all
  ```
  Isso iniciará tanto o frontend (porta 5173) quanto o backend (porta 5000).

- Para rodar apenas o frontend:
  ```
  npm run dev
  ```

- Para rodar apenas o backend:
  ```
  npm run server
  ```

- Para build de produção:
  ```
  npm run build
  ```

## Rotas da API

### Autenticação
- `POST /api/auth/register` - Registro de novos usuários
- `POST /api/auth/login` - Login de usuários
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Perfil
- `POST /api/profile` - Criar/atualizar perfil
- `GET /api/profile` - Obter perfil do usuário

### Documentos
- `POST /api/documents/upload` - Upload de documento
- `POST /api/documents/verify/:type` - Verificar documento por tipo

### Redes Sociais
- `POST /api/social-accounts` - Conectar conta social
- `GET /api/social-accounts` - Listar contas sociais conectadas
- `DELETE /api/social-accounts/:platform` - Desconectar conta social

### Perfis de Esports
- `POST /api/esports-profiles` - Adicionar perfil de esports
- `GET /api/esports-profiles` - Listar perfis de esports
- `DELETE /api/esports-profiles/:index` - Remover perfil de esports

### Chatbot
- `POST /api/chat` - Enviar mensagem para o chatbot

## Arquitetura do Sistema

O sistema utiliza uma arquitetura cliente-servidor:

- **Frontend**: Aplicação SPA desenvolvida com React e Vite, responsável pela interface do usuário e experiência de interação.
  
- **Backend**: API RESTful em Node.js que gerencia autenticação, armazenamento de dados e integração com serviços externos como OpenAI.

A comunicação entre frontend e backend é feita via API RESTful, utilizando JSON para troca de dados.

## Segurança

- Autenticação baseada em JWT
- Validação de formulários com Formik e Yup
- Uploads seguros de documentos com Multer
- Verificação de documentos com IA

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

FURIA Esports - [Website](https://furia.gg) - [@furia](https://twitter.com/furia)