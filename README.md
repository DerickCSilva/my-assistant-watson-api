# My Watson Assistant
![Made By Derick](https://img.shields.io/badge/made%20by-DERICK-green.svg)

Projeto desenvolvido no intuito de construir um chatbot (front-end, back-end e fluxograma), no intuito de agregar em meu portifólio.

## Configuração Watson

É necessário configurar as variáveis de ambiente do seu assistente para que você consiga rodar seu projeto sem erro.

```js
// Exemplo de .env
ASSISTANT_ID = xxxxxxxxxxxxxxxxxxx
ASSISTANT_API_VERSION = 2018-11-08
ASSISTANT_API_KEY = zzzzzzzzzzzzzz
```

## Instalação / Iniciar

Uma breve introdução sobre a configuração mínima necessária para rodar o projeto.

```shell
npm install / npm i
npm start // Inicia o servidor
npm run start:dev // Inicia o ambiente de desenvolvimento 
```

## Desenvolvimento

### Desenvolvido com
- Node.js
- Express.js

### Configuração do Dev

Aqui está uma breve introdução sobre o que um desenvolvedor deve fazer para começar a desenvolver o projeto:

```shell
git clone repo
cd repo/
npm install / npm i
npm start / npm run start:dev
```

### Deploy
```shell
git add .
git commit -m "feat/fix: modificação"
git push
ibmcloud login
ibmcloud target --cf
ibmcloud cf push -b https://github.com/cloudfoundry/nodejs-buildpack.git
```

Usar o padrão de comentários:
```shell
git commit -m "feat: para alguma feature nova"
git commit -m "fix: para alguma correção"
```

### API Endpoints

Temos todos os endpoints documentos com swagger.
###### Clique aqui...
