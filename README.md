- Next.js + Tailwind
- ORM Prisma + PostgreSQL
- Nodemailer
- Next-Auth


- Como acessar caixa de entrada

# SETUP

## Passo 1 - Banco de dados

Primeiro é necessário configurar banco de dados PostgreSQL. Alguns casos simplificados:

- 1. Usar o docker, executar `$ docker compose -f "compose.yaml" up -d --build ` iniciando um container postgres;
- 2. Usar outro banco de dados, sendo necessário alterar o envfile com a string de conexão.

De toda forma, garanta que a string de conexão está configurada no arquivo .env como "DATABASE_URL"

## Passo 2 - Servidor SMTP

Para simplificar foi configurado um servidor de SMTP de testes chamado Etheral. Todos os emails ficam retidos na mesma caixa de entrada, para acessar:

- Fazer login: (https://ethereal.email/login)[https://ethereal.email/login]
    - login: else.heidenreich65@ethereal.email
    - senha: UbrahbE1zr6YrQtEn9
- Acessar os emails em: (https://ethereal.email/messages)[https://ethereal.email/messages]

## Passo 3 - Iniciando a aplicação

Na pasta raiz do projeto:

1. rode `npm i` para instalar as dependências
2. rode `npx prisma migrate deploy` para executar a migration e criar as tabelas no banco de dados
3. rode `npx prisma migrate reset --force` se quiser instalar o seed inicial com dados de demonstração
4. rode `npm run dev` para iniciar a aplicação no modo dev


## Extras

Se rodar o seed (passo 3) serão criados 100 usuários aleatórios, 20 postagens aleatórias com comentários e curtidas também randomizadas.
Os usuários criados por seed tem o login serializados de 1 a 100 e podem ser acessados usando o email `user1@mail.co`, `user2@mail.co` até `user100@mail.co`, todos coma  mesma senha `1234`.