// @ts-nocheck
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

// Criação do server
const app = express();
// Extraindo o servidor http de dentro no express
const server = http.Server(app);

setupWebsocket(server);

// Conexão com o MongoDB
mongoose.connect('mongodb://allcantara:allcantara@omnistack-shard-00-00-w4pyr.mongodb.net:27017,omnistack-shard-00-01-w4pyr.mongodb.net:27017,omnistack-shard-00-02-w4pyr.mongodb.net:27017/week10?ssl=true&replicaSet=omnistack-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Permite a chamada da api através de outros endereços
app.use(cors());

// Para que o express entenda requisições em formato JSON
app.use(express.json());

// Utilizando as rotas na aplicação após das configurações
app.use(routes);

// Porta da aplicação
server.listen(3333);