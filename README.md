# Desafio #2 - Daily Diet 

Este é um projeto do Desafio #2 proposto pela Rocketseat para testar os conhecimentos em Node.js. O objetivo é desenvolver uma API REST utilizando o framework Fastify e a biblioteca Knex. Além disso, o projeto utiliza o Dotenv para configuração de ambientes e o Zod para validação de dados.

[Instruções](https://efficient-sloth-d85.notion.site/Desafio-02-be7cdb37aaf74ba898bc6336427fa410)
## Tecnologias Utilizadas

- Node.js
- Fastify
- Knex
- Dotenv
- Zod

## Executando o Projeto

Siga as etapas abaixo para executar o projeto em sua máquina local:

1. Clone este repositório para o seu diretório local.
2. Navegue até o diretório clonado: `cd daily-diet-api`.
3. Instale as dependências do projeto: `npm install`.
4. Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente, se necessário.
5. Crie as tableas do banco de dados: `npm run knex -- migrate:latest`. 
6. Execute o projeto: `npm run dev`.
7. A API estará disponível no endereço `http://localhost:3333`. 
(a porta padrão é 3333, porem você pode mudar no arquivo .env)

