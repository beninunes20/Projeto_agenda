# Usa a imagem oficial do Node.js para rodar a aplicação
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências para otimizar cache do Docker
COPY package*.json ./

# Instala as dependências do projeto
# O projeto usa nodemon e webpack no script de desenvolvimento, então a instalação completa é necessária.
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta em que o Express escuta
EXPOSE 3000

# Inicia a aplicação com o script definido no package.json
CMD ["npm", "start"]
