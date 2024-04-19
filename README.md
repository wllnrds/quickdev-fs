## Arquitetura
O teste foi enviado pra mim dia 16 de abril as 18h, isso me deu cerca de 72h para executar o teste, então eu escolhi stacks que eu dominasse bem e que me ajudassem a entregar a demanda completa no prazo. Dito isso escolhi usar o framework **Next.js 14** já que eu poderia fazer tanto o frontend usando **React.js 18** como o backend usando **Node.js 20** em uma única aplicação.  O frontend foi feito usando recursos do **React.js 18** junto com framework css **Tailwind**. 

No backend foi usado **Node.js 20** junto com o **ORM Prisma 5** + banco de dados **PostgreSQL**. A decisão de usar o PostgreSQL foi mais relacionada a faciliade mesmo, já a escolha do ORM foi para agilizar o processo de desenvolvimento,  já que o recurso permite um desenvolvimento muito mais ágil.

Para o envio de e-mails foi utilizada a lib **nodemailer**, sem nenhum motivo específico para a escolha.

Para a autenticação foi usado uma solução *build-in* chamada **Auth.js 5** ainda em beta. Essa solução foi escolhida porque permitiria eu utilizar a estrutura do banco de dados exigida e o trabalho da solução seria apenas gerenciar os dados da seção do usuário entre o cliente e o servidor.

Para o editor de posts do sistema foi usado o **CKEditor**, que na versão gratuítua exige que a dependência fique hospedada junto ao projeto. A decisão de usar o **CKEditor** foi por ele ser a alternativa mais sólida para esse tipo de tarefa.

-----

## SETUP  
### Passo 1 - Banco de dados
Primeiro é necessário configurar banco de dados PostgreSQL. Alguns casos simplificados:
-  1. Usar o docker, executar `$ docker compose -f "compose.yaml" up -d --build ` iniciando um container postgres;
-  2. Usar outro banco de dados, sendo necessário alterar o envfile com a string de conexão.

De toda forma, garanta que a string de conexão está configurada no arquivo .env como "DATABASE_URL"

### Passo 2 - Servidor SMTP
Para simplificar foi configurado um servidor de SMTP de testes chamado Etheral. Todos os emails ficam retidos na mesma caixa de entrada, para acessar:

- Fazer login: [https://ethereal.email/login](https://ethereal.email/login)
- login: `else.heidenreich65@ethereal.email`
- senha: `UbrahbE1zr6YrQtEn9`
- Acessar os emails em: [https://ethereal.email/messages](https://ethereal.email/messages)
  

### Passo 3 - Iniciando a aplicação
Na pasta raiz do projeto:
1. rode `npm i` para instalar as dependências
2. rode `npx prisma migrate deploy` para executar a migration e criar as tabelas no banco de dados
3. rode `npx prisma migrate reset --force` se quiser instalar o seed inicial com dados de demonstração
4. rode `npm run dev` para iniciar a aplicação no modo dev

## Extras
Se rodar o seed (passo 3) serão criados 100 usuários aleatórios, 20 postagens aleatórias com comentários e curtidas também randomizadas.
Os usuários criados por seed tem o login serializados de 1 a 100 e podem ser acessados usando o email `user1@mail.co`, `user2@mail.co` até `user100@mail.co`, todos coma mesma senha `1234`.

-----

## Testes remotos
A aplicação também foi hospedada na Vercel e pode ser testada por lá usando um dos 100 usuários gerados ou então criando um novo usuário.

[Acessar](https://blog-quik.vercel.app/)