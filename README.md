# CoopSeg Backend

API NestJS para uma aplicação educativa sobre golpes financeiros. O repositório implementa cadastro e login, quiz e ranking, notícias agendadas e um mural de mensagens persistido com Prisma/PostgreSQL.

**Estado:** protótipo em desenvolvimento. Os módulos e migrations existem, mas a autenticação possui inconsistências conhecidas, a cobertura automatizada é apenas o teste e2e padrão e não há configuração de ambiente de exemplo.

## Arquitetura

```mermaid
flowchart LR
    CLIENT["cliente web"] --> API["NestJS · porta 5005"]
    API --> PRISMA["Prisma"]
    PRISMA --> PG["PostgreSQL/Supabase"]
    NEWS["NewsAPI"] --> CRON["cron diário"]
    CRON --> API
```

## Endpoints observados

| Método e rota | Função | Proteção atual |
| --- | --- | --- |
| `POST /auth/register` | cadastra usuário com hash bcrypt | pública |
| `POST /auth/login` | retorna access e refresh tokens | pública |
| `POST /auth/logout` | tenta invalidar token em memória | pública e incompleta |
| `GET /user/:id` | nome e ID do usuário | pública |
| `GET /news` | notícias persistidas | pública |
| `POST /chat/send` | cria mensagem | pública |
| `GET /chat/messages` | lista mensagens | pública |
| `GET /quiz/questions` | lista questões | pública |
| `POST /quiz/score` | salva pontuação | JWT |
| `GET /quiz/ranking` | top 3 | pública |

## Configuração

Crie um `.env` local:

```dotenv
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET_KEY=troque_por_um_segredo_forte
JWT_REFRESH_TOKEN_KEY=troque_por_outro_segredo_forte
API_KEY_NEWS=sua_chave
```

O código atualmente mistura `JWT_SECRET_KEY` com `jwtSecretKey` e `jwtRefreshTokenKey`. Essa inconsistência precisa ser corrigida antes de considerar login e proteção de rotas funcionais.

## Executar

Pré-requisitos: Node.js, npm e PostgreSQL acessível.

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

A API escuta `http://localhost:5005` e aceita CORS somente de `http://localhost:3000`.

## Verificações disponíveis

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

A auditoria atual verificou apenas a sintaxe dos arquivos Python inexistentes/não aplicáveis e inspecionou o TypeScript; Node.js não estava instalado no ambiente, portanto build, lint e Jest não foram executados.

## Limitações e riscos

- o logout lê headers a partir do body, mantém uma lista somente em memória e o guard não consulta essa lista;
- refresh token é emitido, mas não há endpoint de renovação;
- apenas `POST /quiz/score` usa `JwtGuard`;
- o teste e2e cobre apenas `GET /` com “Hello World”;
- mensagens e notícias não têm paginação nem limites de conteúdo defensivos completos;
- a entidade `Score` permite apenas uma pontuação por usuário;
- faltam rate limiting, documentação OpenAPI, healthcheck e CI;
- usar PostgreSQL hospedado no Supabase via Prisma não equivale a usar Supabase Auth ou RLS.

Antes de um deploy, priorize corrigir a configuração JWT, definir autorização por rota, testar autenticação e adicionar uma política explícita de retenção para mensagens e usuários.
