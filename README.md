# Backend - Sistema de Quiz

## Tecnologias Utilizadas

- **NestJS**: Framework para construir aplicações backend escaláveis usando TypeScript. Baseado no Node.js com arquitetura modular e orientada a serviços.
- **Prisma**: ORM (Object-Relational Mapping) moderno para interagir com bancos de dados usando código TypeScript ao invés de SQL puro.
- **PostgreSQL (via Supabase)**: Banco de dados relacional robusto e open-source. O Supabase é uma plataforma que fornece uma interface amigável e API pronta sobre o PostgreSQL.

---

## Schema Prisma

O `schema.prisma` é onde definimos a estrutura do banco de dados, ou seja, as **tabelas** e seus **relacionamentos**.

Dentro dele, usamos **models**, que representam cada tabela do banco. Cada model contém os campos da tabela, com seus respectivos **tipos** (como `String`, `Int`, `DateTime`, etc.) e configurações (como `@id`, `@default`, `@relation`).

### 🧾 Exemplo das Tabelas

<pre><code class="language-prisma">
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  password String
  scores   Score[] @relation("UserScores")
}

model News {
  id          Int      @id @default(autoincrement())
  title       String
  content     String
  fullContent String?
  source      String
  url         String?
  createdAt   DateTime @default(now())
}

model Message {
  id        Int      @id @default(autoincrement())
  username  String
  content   String
  createdAt DateTime @default(now())
}

model Questao {
  id            Int      @id @default(autoincrement())
  text          String
  options       String[] 
  correctAnswer Int
}

model Score {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  score     Int
  createdAt DateTime @default(now())
  user      User     @relation("UserScores", fields: [userId], references: [id])
}
</code></pre>

---

## Estrutura em Módulos

O NestJS utiliza uma **arquitetura modular**, onde cada funcionalidade é separada por pastas chamadas **módulos**. Isso facilita a organização, manutenção e reutilização de código.

### Módulos criados no projeto:

- `auth` → Autenticação
- `user` → Usuário
- `quiz` → Questões e pontuações
- `news` → Notícias sobre golpes financeiros
- `chat` → Bate-papo

---

## Módulo `auth` (Exemplo de Estrutura)

A estrutura dos módulos segue sempre a mesma ideia. Usamos o módulo `auth` como exemplo:

| Arquivo/Função         | Descrição                                                                 |
|------------------------|---------------------------------------------------------------------------|
| `auth.controller.ts`   | Define os **endpoints da API** (`/login`, `/register`, etc.)              |
| `auth.service.ts`      | Lógica de negócio, como verificar senha, gerar token, etc.                |
| `jwt.guard.ts`         | Middleware que **protege rotas**, verificando se o token JWT é válido     |
| `dto` (Data Transfer Object) | Define o formato dos dados que entram ou saem (ex: body do login)         |

> **JWT (JSON Web Token)**: Serve para identificar o usuário logado. Usamos nos guards para proteger as rotas privadas.

---

## Integração com API de Notícias

No módulo `news`, usamos a [NewsAPI](https://newsapi.org/) para buscar automaticamente notícias sobre **golpes financeiros** e atualizamos os dados todos os dias com uma tarefa **cron** (agendamento automático).

---

## Representação Gráfica das Tabelas

> Para visualizar o grafo abaixo, é necessário que o seu README seja renderizado com suporte ao **Mermaid.js** (como no GitHub):

```mermaid
erDiagram
  User ||--o{ Score : has
  Score }o--|| User : belongs_to

  News {
    Int id
    String title
    String content
    String? fullContent
    String source
    String? url
    DateTime createdAt
  }

  Message {
    Int id
    String username
    String content
    DateTime createdAt
  }

  Questao {
    Int id
    String text
    String[] options
    Int correctAnswer
  }
```

---

## 📁 Estrutura de Pastas

src/
│
├── auth/       # Autenticação (login, register, JWT)
├── user/       # Dados e ações dos usuários
├── quiz/       # Questões e pontuação
├── news/       # Notícias (via API)
├── chat/       # Chat de mensagens
│
├── app.module.ts       # Registra os módulos principais
├── main.ts             # Arquivo principal (ponto de entrada da API)
├── prisma/
│   ├── schema.prisma   # Definição das tabelas do banco de dados
│   └── prisma.service.ts  # Conexão com o banco via Prisma

---

## RESUMO de conceitos
|Termo	        | O que é?
|---------------|-------------------------------------------------------|
|NestJS	        | Framework backend baseado em módulos                  |
|ORM	          | Ferramenta para mapear tabelas para objetos de código |
|Prisma	        | ORM moderno e tipado                                  |
|schema.prisma	| Arquivo onde criamos as "tabelas" do banco            |
|model	        | Cada tabela no banco                                  |
|service	      | Onde fica a lógica principal de um módulo             |
|controller	    | Define os endpoints que o usuário pode acessar        |
|guard	        | Protege rotas com autenticação                        | 
|DTO	          | Define o que pode entrar e sair das requisições       |
|module	        | Agrupador de controllers, services, DTOs, etc.        |