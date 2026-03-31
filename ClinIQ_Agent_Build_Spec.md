# ClinIQ — Agent Build Specification
**Version:** 1.0 | **Stack:** TypeScript Full-Stack | **Use:** Cursor / Windsurf Agent Prompt

---

## HOW TO USE THIS SPEC

You are a senior full-stack TypeScript engineer building ClinIQ — a structured digital academic community for nursing and midwifery students in Ghana. Work through each PILLAR in order. Each pillar is self-contained with its schema, backend module, API contract, and frontend interface. Do not skip ahead. Validate each pillar before proceeding.

---

## 0. PROJECT CONVENTIONS

### Monorepo Structure
```
cliniq/
├── apps/
│   ├── web/                  # Next.js 14 App Router (TypeScript)
│   └── api/                  # NestJS backend (TypeScript)
├── packages/
│   ├── shared-types/         # Zod schemas + shared TypeScript types
│   ├── ui/                   # Shared React component library (shadcn/ui base)
│   └── config/               # ESLint, Prettier, Tailwind config
├── .env.example
├── turbo.json
└── package.json              # Turborepo root
```

### Tech Stack — Non-Negotiable
| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js + TypeScript | 14 (App Router) |
| Backend | NestJS + TypeScript | 10 |
| Database | PostgreSQL + pgvector | 16 |
| Cache | Redis | 7 |
| ORM | Prisma | 5 |
| Auth | JWT + bcrypt | — |
| File Storage | Cloudflare R2 (S3-compatible) | — |
| Email | Postmark | — |
| AI | OpenAI GPT-4o | — |
| Deployment | Vercel (web) + Railway (api, db, redis) | — |
| UI Library | Tailwind CSS + shadcn/ui | — |
| Forms | React Hook Form + Zod | — |
| State | TanStack Query (React Query) | 5 |
| Error tracking | Sentry | — |

### Code Conventions
- All files: TypeScript strict mode (`"strict": true`)
- API responses: always wrap in `{ data, meta?, error? }`
- Dates: always ISO 8601 strings in API, `Date` objects in Prisma
- Validation: Zod schemas in `packages/shared-types`, imported by both apps
- Environment variables: validated with Zod at startup in both apps
- Errors: custom `AppException` class extending `HttpException`
- All database queries through Prisma — no raw SQL except full-text search
- Naming: `camelCase` for variables/functions, `PascalCase` for types/classes, `SCREAMING_SNAKE` for env vars

### Environment Variables (.env.example)
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/cliniq"
REDIS_URL="redis://host:6379"

# Auth
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"
OTP_SECRET="..."

# OpenAI
OPENAI_API_KEY="..."
OPENAI_MODEL="gpt-4o"

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="cliniq-files"
R2_PUBLIC_URL="https://files.cliniq.app"

# Email
POSTMARK_API_KEY="..."
POSTMARK_FROM_EMAIL="noreply@cliniq.app"

# App
NEXT_PUBLIC_API_URL="https://api.cliniq.app"
NEXT_PUBLIC_APP_URL="https://cliniq.app"
FRONTEND_URL="https://cliniq.app"

# Sentry
SENTRY_DSN="..."
NEXT_PUBLIC_SENTRY_DSN="..."
```

---

## 1. DATABASE SCHEMA (Prisma)

Create `apps/api/prisma/schema.prisma`. This is the complete schema — implement it in full before any pillar.

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector"), pg_trgm]
}

enum Role {
  STUDENT
  MENTOR
  MODERATOR
  ADMIN
}

enum Program {
  NURSING
  MIDWIFERY
  COMMUNITY_HEALTH
}

enum BadgeType {
  FIRST_ANSWER
  HELPFUL
  ACCEPTED
  MENTOR_STAR
  AMBASSADOR
}

enum FlagStatus {
  PENDING
  RESOLVED
  DISMISSED
}

enum FlagEntityType {
  QUESTION
  ANSWER
  RESOURCE
  GROUP_POST
}

enum NotificationType {
  ANSWER_POSTED
  ANSWER_ACCEPTED
  QUESTION_UPVOTED
  MENTION
  MENTOR_REPLY
  MENTOR_REQUEST
  BADGE_EARNED
  FLAG_RESOLVED
}

model User {
  id                String    @id @default(cuid())
  name              String
  email             String?   @unique
  phone             String?   @unique
  passwordHash      String
  institution       String
  year              Int
  program           Program
  role              Role      @default(STUDENT)
  bio               String?
  avatarUrl         String?
  verified          Boolean   @default(false)
  profilePublic     Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  questions         Question[]
  answers           Answer[]
  votes             Vote[]
  mentorProfile     MentorProfile?
  groupMemberships  GroupMember[]
  resources         Resource[]
  flags             Flag[]            @relation("FlagReporter")
  moderatedFlags    Flag[]            @relation("FlagModerator")
  badges            UserBadge[]
  notifications     Notification[]
  mentorRequests    MentorRequest[]   @relation("StudentRequests")
  mentorResponses   MentorRequest[]   @relation("MentorResponses")
  sentMessages      Message[]         @relation("SentMessages")
  receivedMessages  Message[]         @relation("ReceivedMessages")
  aiConversations   AIConversation[]

  @@index([email])
  @@index([phone])
  @@index([institution])
}

model Question {
  id          String    @id @default(cuid())
  userId      String
  categoryId  String
  title       String    @db.VarChar(120)
  body        String
  anonymous   Boolean   @default(false)
  views       Int       @default(0)
  upvotes     Int       @default(0)
  answered    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])
  category    Category  @relation(fields: [categoryId], references: [id])
  answers     Answer[]
  tags        QuestionTag[]
  flags       Flag[]
  embedding   QuestionEmbedding?

  @@index([categoryId])
  @@index([answered])
  @@index([createdAt(sort: Desc)])
}

model QuestionEmbedding {
  id          String                  @id @default(cuid())
  questionId  String                  @unique
  embedding   Unsupported("vector(1536)")?
  question    Question                @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model Answer {
  id          String    @id @default(cuid())
  questionId  String
  userId      String
  body        String
  isAccepted  Boolean   @default(false)
  upvotes     Int       @default(0)
  downvotes   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  question    Question  @relation(fields: [questionId], references: [id])
  user        User      @relation(fields: [userId], references: [id])
  votes       Vote[]
  flags       Flag[]
  attachments Attachment[]

  @@index([questionId])
}

model Vote {
  id        String   @id @default(cuid())
  userId    String
  answerId  String
  value     Int      // 1 or -1
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  answer    Answer   @relation(fields: [answerId], references: [id])

  @@unique([userId, answerId])
}

model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  parentId    String?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children    Category[] @relation("SubCategories")
  questions   Question[]
  groups      Group[]
  resources   Resource[]
}

model Tag {
  id        String        @id @default(cuid())
  name      String        @unique
  questions QuestionTag[]
}

model QuestionTag {
  questionId String
  tagId      String
  question   Question @relation(fields: [questionId], references: [id])
  tag        Tag      @relation(fields: [tagId], references: [id])

  @@id([questionId, tagId])
}

model Attachment {
  id        String   @id @default(cuid())
  answerId  String?
  url       String
  fileType  String
  fileName  String
  fileSize  Int
  createdAt DateTime @default(now())
  answer    Answer?  @relation(fields: [answerId], references: [id])
}

model MentorProfile {
  id               String   @id @default(cuid())
  userId           String   @unique
  expertise        String[]
  availability     String
  responseSLA      String   @default("48h")
  verifiedAt       DateTime?
  verifiedBy       String?
  acceptanceRate   Float    @default(0)
  totalAnswers     Int      @default(0)
  user             User     @relation(fields: [userId], references: [id])
  requests         MentorRequest[]
}

model MentorRequest {
  id         String   @id @default(cuid())
  studentId  String
  mentorId   String
  message    String
  status     String   @default("PENDING") // PENDING, ACCEPTED, DECLINED
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  student    User           @relation("StudentRequests", fields: [studentId], references: [id])
  mentor     User           @relation("MentorResponses", fields: [mentorId], references: [id])
  thread     Message[]
}

model Message {
  id         String        @id @default(cuid())
  requestId  String
  senderId   String
  receiverId String
  body       String
  read       Boolean       @default(false)
  createdAt  DateTime      @default(now())

  request    MentorRequest @relation(fields: [requestId], references: [id])
  sender     User          @relation("SentMessages", fields: [senderId], references: [id])
  receiver   User          @relation("ReceivedMessages", fields: [receiverId], references: [id])
}

model Resource {
  id             String   @id @default(cuid())
  userId         String
  categoryId     String?
  title          String
  description    String?
  url            String?
  fileRef        String?
  fileType       String?
  course         String?
  year           Int?
  copyrightAck   Boolean  @default(false)
  downloads      Int      @default(0)
  createdAt      DateTime @default(now())

  user           User      @relation(fields: [userId], references: [id])
  category       Category? @relation(fields: [categoryId], references: [id])
  flags          Flag[]
}

model Group {
  id          String        @id @default(cuid())
  ownerId     String
  name        String
  description String?
  categoryId  String?
  institution String?
  cadence     String?
  inviteCode  String        @unique @default(cuid())
  createdAt   DateTime      @default(now())

  category    Category?     @relation(fields: [categoryId], references: [id])
  members     GroupMember[]
  posts       GroupPost[]
}

model GroupMember {
  groupId   String
  userId    String
  role      String   @default("MEMBER") // MEMBER, ADMIN
  joinedAt  DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@id([groupId, userId])
}

model GroupPost {
  id        String   @id @default(cuid())
  groupId   String
  userId    String
  body      String
  pinned    Boolean  @default(false)
  createdAt DateTime @default(now())

  group     Group    @relation(fields: [groupId], references: [id])
  flags     Flag[]
}

model Flag {
  id           String         @id @default(cuid())
  entityType   FlagEntityType
  entityId     String
  reason       String
  reporterId   String
  moderatorId  String?
  status       FlagStatus     @default(PENDING)
  auditNote    String?
  createdAt    DateTime       @default(now())
  resolvedAt   DateTime?

  reporter     User           @relation("FlagReporter", fields: [reporterId], references: [id])
  moderator    User?          @relation("FlagModerator", fields: [moderatorId], references: [id])
  question     Question?      @relation(fields: [entityId], references: [id], map: "flag_question")
  answer       Answer?        @relation(fields: [entityId], references: [id], map: "flag_answer")
  resource     Resource?      @relation(fields: [entityId], references: [id], map: "flag_resource")
  groupPost    GroupPost?     @relation(fields: [entityId], references: [id], map: "flag_grouppost")

  @@index([status])
}

model UserBadge {
  id        String    @id @default(cuid())
  userId    String
  type      BadgeType
  awardedAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id])

  @@unique([userId, type])
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  body      String
  read      Boolean          @default(false)
  link      String?
  createdAt DateTime         @default(now())

  user      User             @relation(fields: [userId], references: [id])

  @@index([userId, read])
}

model AIConversation {
  id        String      @id @default(cuid())
  userId    String
  title     String?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user      User        @relation(fields: [userId], references: [id])
  messages  AIMessage[]
}

model AIMessage {
  id             String         @id @default(cuid())
  conversationId String
  role           String         // "user" | "assistant"
  content        String
  sources        Json?          // Array of source citations
  createdAt      DateTime       @default(now())

  conversation   AIConversation @relation(fields: [conversationId], references: [id])
}
```

---

## PILLAR 1 — AUTH & PROFILES

### Goal
Phone/email registration, JWT auth, role-based access, profile management, OTP verification.

### NestJS Module: `apps/api/src/auth/`
```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
└── dto/
    ├── register.dto.ts
    ├── login.dto.ts
    └── update-profile.dto.ts
```

### API Contracts
```
POST   /auth/register          → { data: { user, token } }
POST   /auth/login             → { data: { user, token } }
POST   /auth/verify-otp        → { data: { verified: true } }
POST   /auth/request-otp       → { data: { sent: true } }
POST   /auth/forgot-password   → { data: { sent: true } }
POST   /auth/reset-password    → { data: { reset: true } }
GET    /auth/me                → { data: User }
PATCH  /auth/me                → { data: User }
POST   /auth/me/avatar         → { data: { avatarUrl } }
```

### RegisterDto (shared Zod schema)
```typescript
export const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
  password: z.string().min(8),
  institution: z.string().min(2),
  year: z.number().int().min(1).max(6),
  program: z.enum(['NURSING', 'MIDWIFERY', 'COMMUNITY_HEALTH']),
}).refine(d => d.email || d.phone, {
  message: 'Either email or phone is required',
});
```

### JWT Strategy
- Access token: 7 days
- Payload: `{ sub: userId, role: Role, email?: string, phone?: string }`
- Guard all routes except `/auth/*` and public GET endpoints

### Frontend Interface: Auth Pages (`apps/web/app/(auth)/`)
```
(auth)/
├── layout.tsx          # Centered card layout, ClinIQ branding
├── register/page.tsx   # Multi-step: credentials → institution → program
├── login/page.tsx      # Email/phone + password
├── verify/page.tsx     # OTP input (6 digits)
└── forgot-password/
    └── page.tsx
```

**Register flow:** 3-step wizard using React Hook Form with Zod. Step 1: name + email/phone + password. Step 2: institution + year. Step 3: program selection with visual cards. Progress indicator at top.

**Key UX rules:**
- Phone input: show Ghana flag + `+233` prefix by default
- Password: show strength indicator
- Institution: searchable dropdown pre-seeded with Ghana nursing schools
- All forms: disable submit until valid, show inline Zod errors

---

## PILLAR 2 — Q&A ENGINE

### Goal
Post questions, answer them, vote, accept answers, search, filter. Core product loop.

### NestJS Module: `apps/api/src/qa/`
```
qa/
├── qa.module.ts
├── questions.controller.ts
├── answers.controller.ts
├── questions.service.ts
├── answers.service.ts
├── search.service.ts       # pg_trgm full-text search
├── embedding.service.ts    # Auto-embed questions on create via OpenAI
└── dto/
    ├── create-question.dto.ts
    ├── update-question.dto.ts
    ├── create-answer.dto.ts
    └── question-filter.dto.ts
```

### API Contracts
```
GET    /questions                     → { data: Question[], meta: PaginationMeta }
POST   /questions                     → { data: Question }
GET    /questions/:id                 → { data: QuestionDetail }
PATCH  /questions/:id                 → { data: Question }          [owner only]
DELETE /questions/:id                 → { data: { deleted: true } } [owner/mod]
GET    /questions/search?q=&filters   → { data: Question[], meta }
POST   /questions/:id/answers         → { data: Answer }
PATCH  /answers/:id                   → { data: Answer }            [owner only]
DELETE /answers/:id                   → { data: { deleted: true } }
POST   /answers/:id/accept            → { data: Answer }            [question owner]
POST   /answers/:id/vote              → { data: { upvotes, downvotes } }
GET    /questions/:id/similar         → { data: Question[] }        [AI-powered]
```

### Question Filter DTO
```typescript
export const QuestionFilterSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  answered: z.boolean().optional(),
  institution: z.string().optional(),
  year: z.number().optional(),
  sort: z.enum(['newest', 'votes', 'unanswered']).default('newest'),
  page: z.number().default(1),
  limit: z.number().max(50).default(20),
});
```

### Search Implementation (questions.service.ts)
```typescript
// Full-text search with pg_trgm — use raw query only here
async search(q: string, filters: QuestionFilterDto) {
  return this.prisma.$queryRaw`
    SELECT q.*, similarity(q.title, ${q}) as score
    FROM "Question" q
    WHERE q.title % ${q} OR q.body ILIKE ${'%' + q + '%'}
    ORDER BY score DESC, q."createdAt" DESC
    LIMIT ${filters.limit} OFFSET ${(filters.page - 1) * filters.limit}
  `;
}
```

### Embedding Service (auto-embed on question create)
```typescript
// On every new question, generate and store a 1536-dim vector
async embedQuestion(questionId: string, text: string) {
  const response = await this.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  const vector = response.data[0].embedding;
  await this.prisma.$executeRaw`
    UPDATE "QuestionEmbedding"
    SET embedding = ${vector}::vector
    WHERE "questionId" = ${questionId}
  `;
}

// Similar questions via cosine distance
async findSimilar(questionId: string, limit = 5) {
  return this.prisma.$queryRaw`
    SELECT q.* FROM "Question" q
    JOIN "QuestionEmbedding" qe ON qe."questionId" = q.id
    WHERE q.id != ${questionId}
    ORDER BY qe.embedding <=> (
      SELECT embedding FROM "QuestionEmbedding" WHERE "questionId" = ${questionId}
    )
    LIMIT ${limit}
  `;
}
```

### Anonymous Posting Logic
- `anonymous: true` → strip `userId` from GET responses (replace with `{ id: null, name: 'Anonymous', avatarUrl: null }`)
- Admin/Moderator JWT role → always receives real userId (for abuse handling)
- Store real userId regardless — anonymity is a display-layer concern only

### Frontend Interface: Questions (`apps/web/app/(app)/questions/`)
```
questions/
├── page.tsx              # Question feed with filters sidebar
├── ask/page.tsx          # Ask a question (rich editor)
└── [id]/page.tsx         # Question detail + answers
```

**Feed page:** Left sidebar with category filters, answered/unanswered toggle, institution filter, sort selector. Main column: question cards (title, category chip, answered badge, upvote count, timestamp, author or "Anonymous"). Infinite scroll via TanStack Query `useInfiniteQuery`.

**Ask page:** Rich text editor (use `@uiw/react-md-editor` — lightweight, works offline-first). Category required dropdown. Tag input (comma-separated). Anonymous toggle with tooltip: "Your name is hidden from other students. Admins can still see your identity for safety reasons." File/image upload via R2 presigned URL.

**Question detail:** Thread layout — question body at top, answer count, "Write an answer" button (collapses to editor inline). Answers sorted by accepted first, then votes. Accept button visible only to question author. Vote buttons. "Similar questions" sidebar powered by `/questions/:id/similar`.

**AI Assist (embedded):** Below the ask form, after the user finishes typing a question title, trigger `GET /ai/suggest?q={title}` after 800ms debounce. Show a collapsible panel: "GhanaHealth AI found relevant answers — check before posting." If the user proceeds, still let them post.

---

## PILLAR 3 — MENTOR DIRECTORY

### Goal
Verified mentors list expertise. Students discover and request mentorship. Async message thread per request.

### NestJS Module: `apps/api/src/mentors/`
```
mentors/
├── mentors.module.ts
├── mentors.controller.ts
├── mentors.service.ts
├── messages.controller.ts
├── messages.service.ts
└── dto/
    ├── mentor-filter.dto.ts
    ├── create-request.dto.ts
    └── send-message.dto.ts
```

### API Contracts
```
GET    /mentors                        → { data: MentorProfile[], meta }
GET    /mentors/:userId                → { data: MentorProfileDetail }
POST   /mentors/requests               → { data: MentorRequest }        [student]
GET    /mentors/requests               → { data: MentorRequest[] }       [own requests]
PATCH  /mentors/requests/:id/respond   → { data: MentorRequest }        [mentor: accept/decline]
GET    /mentors/requests/:id/messages  → { data: Message[] }
POST   /mentors/requests/:id/messages  → { data: Message }
PATCH  /mentors/profile                → { data: MentorProfile }        [mentor only]
```

### Mentor Filter DTO
```typescript
export const MentorFilterSchema = z.object({
  expertise: z.string().optional(),   // e.g. "Pharmacology"
  available: z.boolean().optional(),
  institution: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().max(30).default(12),
});
```

### Frontend Interface: Mentors (`apps/web/app/(app)/mentors/`)
```
mentors/
├── page.tsx                  # Mentor directory grid
├── [userId]/page.tsx         # Mentor profile
└── requests/
    ├── page.tsx              # Student: my requests list
    └── [id]/page.tsx         # Request detail + message thread
```

**Directory page:** Card grid (3 columns desktop, 1 mobile). Each card: avatar, name, institution, expertise chips, availability badge (green = available, amber = limited, gray = unavailable), response SLA. Filter bar: expertise search, availability toggle. "Request Mentorship" button opens a modal with a message textarea (min 50 chars — force context).

**Message thread page:** Simple chronological thread. Send bar at bottom. Real-time via polling (`refetchInterval: 5000`) — no WebSocket needed in MVP. Unread message count badge on nav.

---

## PILLAR 4 — RESOURCE LIBRARY

### Goal
Upload and discover study materials — PDFs, images, links. Search by course, year, type.

### NestJS Module: `apps/api/src/resources/`
```
resources/
├── resources.module.ts
├── resources.controller.ts
├── resources.service.ts
├── upload.service.ts          # R2 presigned URL generation
└── dto/
    ├── create-resource.dto.ts
    └── resource-filter.dto.ts
```

### API Contracts
```
GET    /resources                    → { data: Resource[], meta }
POST   /resources                    → { data: Resource }
GET    /resources/:id                → { data: Resource }
DELETE /resources/:id                → { data: { deleted: true } } [owner/mod]
GET    /resources/upload-url         → { data: { uploadUrl, fileRef } }
POST   /resources/:id/download       → { data: { url } }            [increment counter]
```

### Upload Flow
1. Client calls `GET /resources/upload-url?filename=x&contentType=application/pdf`
2. API generates R2 presigned PUT URL (expires 10 min) and returns `{ uploadUrl, fileRef }`
3. Client uploads directly to R2 — never through the API
4. Client creates resource record with the `fileRef`

### Frontend Interface: Resources (`apps/web/app/(app)/resources/`)
```
resources/
├── page.tsx            # Resource library with filters
└── upload/page.tsx     # Upload form
```

**Library page:** Masonry card grid. Filter sidebar: course, year, file type (PDF/image/link), category. Each card: file type icon, title, course tag, year badge, uploader name, download count. Preview button opens PDF in a modal (use `react-pdf`).

**Upload page:** Drag-and-drop zone for file (max 20MB). Fields: title, description, course, year, category, file type. Copyright acknowledgement checkbox (required). Progress bar during upload.

---

## PILLAR 5 — STUDY GROUPS

### Goal
Create and join async study groups. Group threads with pinned posts. Invite via link code.

### NestJS Module: `apps/api/src/groups/`
```
groups/
├── groups.module.ts
├── groups.controller.ts
├── groups.service.ts
├── posts.controller.ts
├── posts.service.ts
└── dto/
    ├── create-group.dto.ts
    └── create-post.dto.ts
```

### API Contracts
```
GET    /groups                      → { data: Group[], meta }
POST   /groups                      → { data: Group }
GET    /groups/:id                  → { data: GroupDetail }
PATCH  /groups/:id                  → { data: Group }             [group admin]
POST   /groups/join/:inviteCode     → { data: GroupMember }
DELETE /groups/:id/leave            → { data: { left: true } }
GET    /groups/:id/posts            → { data: GroupPost[], meta }
POST   /groups/:id/posts            → { data: GroupPost }
PATCH  /groups/:id/posts/:postId/pin → { data: GroupPost }       [group admin]
DELETE /groups/:id/posts/:postId    → { data: { deleted: true } }
```

### Frontend Interface: Study Groups (`apps/web/app/(app)/groups/`)
```
groups/
├── page.tsx              # Group discovery + my groups
├── create/page.tsx       # Create group form
└── [id]/page.tsx         # Group detail + thread
```

**Discovery page:** Two tabs — "Discover" (public groups filtered by institution/category) and "My Groups". Group cards: name, description, member count, cadence badge, category chip. "Join" button or "Joined" state.

**Group detail:** Pinned posts section at top (collapsible). Chronological thread below. Markdown-enabled post editor. Group info sidebar: members list (avatars), meeting cadence, invite link (copy button). Group admin controls: pin/unpin, remove members.

---

## PILLAR 6 — MODERATION & SAFETY

### Goal
Flag queue with moderator actions. Role-based access. Medical disclaimer. Audit log.

### NestJS Module: `apps/api/src/moderation/`
```
moderation/
├── moderation.module.ts
├── moderation.controller.ts
├── moderation.service.ts
└── dto/
    ├── create-flag.dto.ts
    └── resolve-flag.dto.ts
```

### API Contracts
```
POST   /flags                        → { data: Flag }              [any authenticated user]
GET    /moderation/queue             → { data: Flag[], meta }      [MODERATOR+]
PATCH  /moderation/flags/:id         → { data: Flag }              [MODERATOR+: resolve/dismiss]
POST   /moderation/users/:id/warn    → { data: { warned: true } }  [MODERATOR+]
POST   /moderation/users/:id/suspend → { data: { suspended: true } } [ADMIN]
GET    /moderation/audit-log         → { data: AuditEntry[], meta } [ADMIN]
```

### ResolveFlag Actions
```typescript
export enum FlagAction {
  DISMISS = 'DISMISS',       // No action, flag closed
  WARN_USER = 'WARN_USER',   // Send warning notification
  HIDE_CONTENT = 'HIDE_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',
  SUSPEND_USER = 'SUSPEND_USER',
}
```

### Medical Disclaimer
- Display on first app load (store acknowledgement in localStorage + user record)
- Show inline banner on all Q&A pages: "ClinIQ is for educational discussion only. Do not use for patient-specific medical decisions."
- Disclaimer text must be reviewed by a clinical advisor before launch

### Frontend Interface: Moderator Dashboard (`apps/web/app/(mod)/`)
```
(mod)/
├── layout.tsx          # Role-gated: MODERATOR+ only
├── queue/page.tsx      # Flag queue
└── audit/page.tsx      # Audit log
```

**Flag queue:** Table with columns: content preview, entity type, reason, reporter, date, status. Row expand: shows full content + reporter note. Action buttons: Dismiss / Warn / Hide / Delete / Suspend. Audit note textarea (required before action). Filter: by entity type, status, date range.

---

## PILLAR 7 — NOTIFICATIONS

### Goal
In-app notification center. Email digest. Real-time badge count.

### NestJS Module: `apps/api/src/notifications/`
```
notifications/
├── notifications.module.ts
├── notifications.controller.ts
├── notifications.service.ts
└── email/
    ├── email.service.ts        # Postmark integration
    └── templates/
        ├── answer-posted.hbs
        ├── mentor-reply.hbs
        └── digest.hbs
```

### API Contracts
```
GET    /notifications               → { data: Notification[], meta }
PATCH  /notifications/:id/read      → { data: Notification }
PATCH  /notifications/read-all      → { data: { updated: number } }
GET    /notifications/unread-count  → { data: { count: number } }
PATCH  /auth/me/notification-prefs  → { data: User }
```

### Notification Triggers (call from relevant services)
```typescript
// In answers.service.ts — after creating an answer:
await this.notificationsService.create({
  userId: question.userId,
  type: NotificationType.ANSWER_POSTED,
  title: 'New answer on your question',
  body: `${answerer.name} answered: "${question.title}"`,
  link: `/questions/${question.id}#answer-${answer.id}`,
});
```

### Email Digest (cron job — daily at 8am Ghana time GMT+0)
- Use `@nestjs/schedule` with `@Cron('0 8 * * *')`
- For users with `digestEnabled: true`, send summary of unanswered questions in their categories

### Frontend: Notification Bell
- `useUnreadCount` hook: polls `GET /notifications/unread-count` every 30s
- Bell icon in nav with red badge
- Dropdown panel: list of recent notifications, mark all read button
- Click notification → navigate to `link` and mark read

---

## PILLAR 8 — GAMIFICATION

### Goal
Badge awards, profile reputation display. Trigger badges from service events.

### NestJS Module: `apps/api/src/gamification/`
```
gamification/
├── gamification.module.ts
├── gamification.service.ts   # Central badge-check service
└── badge-rules.ts            # Pure functions: checkBadgeEligibility()
```

### Badge Rules
```typescript
// badge-rules.ts
export const BADGE_RULES = {
  FIRST_ANSWER: async (userId: string, prisma: PrismaService) => {
    const count = await prisma.answer.count({ where: { userId } });
    return count >= 1;
  },
  HELPFUL: async (userId: string, prisma: PrismaService) => {
    const answers = await prisma.answer.findMany({
      where: { userId },
      select: { upvotes: true },
    });
    return answers.some(a => a.upvotes >= 5);
  },
  ACCEPTED: async (userId: string, prisma: PrismaService) => {
    const count = await prisma.answer.count({
      where: { userId, isAccepted: true },
    });
    return count >= 3;
  },
  MENTOR_STAR: async (userId: string, prisma: PrismaService) => {
    const profile = await prisma.mentorProfile.findUnique({ where: { userId } });
    return profile ? profile.acceptanceRate >= 0.6 && profile.totalAnswers >= 10 : false;
  },
};
```

### Award Flow
```typescript
// Call after any relevant event (answer created, vote cast, etc.)
async checkAndAward(userId: string) {
  for (const [badgeType, checkFn] of Object.entries(BADGE_RULES)) {
    const alreadyHas = await this.prisma.userBadge.findUnique({
      where: { userId_type: { userId, type: badgeType as BadgeType } },
    });
    if (!alreadyHas && await checkFn(userId, this.prisma)) {
      await this.prisma.userBadge.create({ data: { userId, type: badgeType as BadgeType } });
      await this.notificationsService.create({
        userId,
        type: NotificationType.BADGE_EARNED,
        title: `You earned the ${badgeType} badge!`,
        body: BADGE_DESCRIPTIONS[badgeType],
        link: `/profile`,
      });
    }
  }
}
```

---

## PILLAR 9 — GHANAHEALTH AI

### Overview
Two modes — **embedded** (contextual assist within Q&A) and **standalone** (conversational study assistant). Both powered by GPT-4o with RAG over a Ghana-specific clinical knowledge base stored as vectors in pgvector.

### Knowledge Base Sources (seed before launch)
| Source | Description | Format |
|---|---|---|
| GHS Clinical Protocols | Ghana Health Service standard treatment guidelines | PDF → chunks |
| NMC Ghana Curriculum | Nursing & Midwifery Council competency framework | PDF → chunks |
| WHO Essential Medicines (Ghana) | WHO list localised to Ghana formulary | PDF → chunks |
| Common Tropical Diseases | Malaria, typhoid, cholera, TB, HIV — Ghana epidemiology | Curated text |
| NMC Past Exam Questions | Past licensure exam Q&As (where available) | Structured text |
| Ghana Pharmacopeia | Drug interactions, dosages, Ghana-available drugs | PDF → chunks |

### NestJS Module: `apps/api/src/ai/`
```
ai/
├── ai.module.ts
├── ai.controller.ts
├── ai.service.ts
├── rag.service.ts             # Vector search + context retrieval
├── knowledge.service.ts       # Seed + manage knowledge base
└── dto/
    ├── chat-message.dto.ts
    └── suggest.dto.ts
```

### API Contracts
```
POST   /ai/chat                  → { data: { message: AIMessage, sources: Source[] } }
GET    /ai/conversations         → { data: AIConversation[] }
GET    /ai/conversations/:id     → { data: AIConversationDetail }
DELETE /ai/conversations/:id     → { data: { deleted: true } }
GET    /ai/suggest?q={query}     → { data: { suggestions: QuestionSuggestion[] } }
POST   /ai/answer-assist         → { data: { draft: string, confidence: number } }
```

### RAG Service
```typescript
// rag.service.ts
async retrieveContext(query: string, topK = 5): Promise<KnowledgeChunk[]> {
  const embedding = await this.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const vector = embedding.data[0].embedding;

  return this.prisma.$queryRaw`
    SELECT kc.id, kc.content, kc.source, kc.title,
           1 - (kc.embedding <=> ${vector}::vector) as similarity
    FROM "KnowledgeChunk" kc
    WHERE 1 - (kc.embedding <=> ${vector}::vector) > 0.75
    ORDER BY kc.embedding <=> ${vector}::vector
    LIMIT ${topK}
  `;
}
```

### System Prompt (GhanaHealth AI)
```
You are GhanaHealth AI — a clinical study assistant for nursing and midwifery students 
in Ghana. You are trained on Ghana Health Service protocols, NMC Ghana curriculum 
standards, WHO guidelines localised for West Africa, and Ghana-specific clinical knowledge.

Your role is EDUCATIONAL ONLY. You help students understand concepts, prepare for 
NMC licensure exams, and explore clinical knowledge for learning purposes.

HARD RULES:
1. Never provide advice for specific patients or real clinical situations.
2. Always state: "This is for educational purposes only. Consult your supervisor 
   or a qualified clinician for patient care decisions."
3. Ground every clinical answer in the provided context chunks.
4. If the question is outside your knowledge base, say so clearly.
5. Prefer Ghana-specific protocols over general guidelines where available.
6. When referencing drugs, use Ghana-available generic names.
7. When exam preparation is the intent, format answers in a way that aids memorisation.

Current context (from Ghana clinical knowledge base):
{context}

Student question: {question}
```

### Chat Service
```typescript
async chat(userId: string, conversationId: string | null, message: string) {
  // 1. Retrieve context via RAG
  const chunks = await this.ragService.retrieveContext(message);
  const context = chunks.map(c => `[${c.source}] ${c.content}`).join('\n\n');

  // 2. Load conversation history (last 10 messages for context window)
  const history = conversationId
    ? await this.getHistory(conversationId, 10)
    : [];

  // 3. Call GPT-4o
  const completion = await this.openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ],
    temperature: 0.3,   // Low temp for clinical accuracy
    max_tokens: 1000,
  });

  // 4. Store + return
  const reply = completion.choices[0].message.content;
  await this.storeMessage(conversationId, userId, message, reply, chunks);

  return { message: reply, sources: chunks.map(c => ({ title: c.title, source: c.source })) };
}
```

### Knowledge Seeding Script (`apps/api/src/ai/seed-knowledge.ts`)
```typescript
// Run once: npx ts-node src/ai/seed-knowledge.ts
// 1. Load PDFs from /knowledge-sources/
// 2. Chunk into ~500-token segments with 50-token overlap
// 3. Generate embeddings via text-embedding-3-small
// 4. Insert into KnowledgeChunk table with source metadata
```

Add to Prisma schema:
```prisma
model KnowledgeChunk {
  id        String  @id @default(cuid())
  title     String
  source    String
  content   String
  embedding Unsupported("vector(1536)")?
  createdAt DateTime @default(now())
}
```

### Frontend Interface 1: Standalone AI Tab (`apps/web/app/(app)/ai/`)
```
ai/
├── page.tsx              # Conversation list + new chat CTA
└── [conversationId]/
    └── page.tsx          # Chat interface
```

**Chat page design:**
- Split layout: left sidebar (conversation history list), right panel (active chat)
- Message bubbles: user = right-aligned teal, AI = left-aligned neutral
- Each AI message: response text + collapsible "Sources" section listing knowledge base refs
- Hard disclaimer banner pinned at top: "For study purposes only — not clinical advice"
- Suggested starter prompts on empty state: "Explain the stages of labour", "What are signs of eclampsia?", "Help me revise pharmacology for NMC exams"
- Input: textarea + send button. Streaming responses via `ReadableStream` from API

### Frontend Interface 2: Embedded AI Assist
**Locations:**
1. Ask Question page — debounced suggestion panel after title input
2. Answer composer — "Draft with AI" button that calls `/ai/answer-assist`
3. Question detail page — "Ask GhanaHealth AI about this topic" CTA in sidebar

**Embedded component: `<AIAssistPanel query={questionTitle} />`**
- Shows 2-3 relevant AI-suggested answers or concepts
- "See full answer in AI chat" link opens standalone tab
- Can be dismissed/collapsed

---

## PILLAR 10 — ADMIN CONSOLE

### Goal
User management, category CRUD, mentor verification, analytics dashboard, CSV export.

### NestJS Module: `apps/api/src/admin/`
```
admin/
├── admin.module.ts
├── admin.controller.ts
├── admin.service.ts
├── analytics.service.ts
└── dto/
    ├── verify-mentor.dto.ts
    └── analytics-filter.dto.ts
```

### API Contracts
```
GET    /admin/users                    → { data: User[], meta }       [ADMIN]
PATCH  /admin/users/:id/role           → { data: User }               [ADMIN]
POST   /admin/mentors/:userId/verify   → { data: MentorProfile }      [ADMIN]
GET    /admin/analytics                → { data: AnalyticsSnapshot }  [ADMIN]
GET    /admin/analytics/export         → CSV download                 [ADMIN]
POST   /admin/categories               → { data: Category }           [ADMIN]
PATCH  /admin/categories/:id           → { data: Category }           [ADMIN]
DELETE /admin/categories/:id           → { data: { deleted: true } }  [ADMIN]
```

### Analytics Snapshot
```typescript
interface AnalyticsSnapshot {
  totalUsers: number;
  newUsersToday: number;
  totalQuestions: number;
  questionsToday: number;
  answeredPercent: number;
  medianFirstResponseHours: number;
  totalMentors: number;
  activeMentors: number;            // answered in last 7 days
  flagsThisWeek: number;
  dau: number;
  mau: number;
  dauMauRatio: number;
  topCategories: { name: string; questionCount: number }[];
}
```

### Frontend Interface: Admin Console (`apps/web/app/(admin)/`)
```
(admin)/
├── layout.tsx              # Role-gated: ADMIN only. Sidebar nav.
├── page.tsx                # Analytics dashboard
├── users/page.tsx          # User table with role management
├── mentors/page.tsx        # Mentor verification queue
├── categories/page.tsx     # Category CRUD
└── export/page.tsx         # CSV export tool
```

**Analytics dashboard:** 6 metric cards (users, questions today, answer rate, response time, DAU/MAU, active mentors). Line chart (questions/day over 30 days using Recharts). Bar chart (top 5 categories). Flag rate indicator.

---

## 5 INTERFACES — SUMMARY

| # | Interface | Route Group | Accessible To | Primary Purpose |
|---|---|---|---|---|
| 1 | Student PWA | `(app)/` | STUDENT, MENTOR | Q&A, Resources, Groups, AI |
| 2 | Mentor Portal | `(app)/mentors/` | MENTOR+ | Requests, messages, profile |
| 3 | Moderator Dashboard | `(mod)/` | MODERATOR+ | Flag queue, audit log |
| 4 | Admin Console | `(admin)/` | ADMIN | Analytics, users, categories |
| 5 | GhanaHealth AI | `(app)/ai/` | All authenticated | Standalone AI chat |

Note: Interfaces 1, 2, and 5 share the `(app)/` layout (main nav + notification bell). Interfaces 3 and 4 have separate minimal layouts.

---

## SHARED COMPONENTS (`packages/ui/`)

```
ui/
├── components/
│   ├── QuestionCard.tsx
│   ├── AnswerCard.tsx
│   ├── MentorCard.tsx
│   ├── BadgePill.tsx
│   ├── CategoryChip.tsx
│   ├── AIAssistPanel.tsx
│   ├── MarkdownEditor.tsx
│   ├── FileUploadZone.tsx
│   ├── NotificationBell.tsx
│   ├── MedicalDisclaimer.tsx
│   └── UserAvatar.tsx
└── hooks/
    ├── useUnreadCount.ts
    ├── useCurrentUser.ts
    ├── useInfiniteQuestions.ts
    └── useAIStream.ts
```

---

## DEPLOYMENT CONFIG

### Vercel (`apps/web/vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && turbo build --filter=web",
  "outputDirectory": "apps/web/.next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@cliniq-api-url",
    "NEXT_PUBLIC_APP_URL": "@cliniq-app-url"
  }
}
```

### Railway Services (4 services)
1. **cliniq-api** — NestJS app, Dockerfile in `apps/api/`
2. **cliniq-db** — PostgreSQL 16 (Railway managed)
3. **cliniq-redis** — Redis 7 (Railway managed)
4. **cliniq-worker** — Notification digest cron (same NestJS codebase, `NODE_ENV=worker`)

### Dockerfile (`apps/api/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build --workspace=apps/api

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
RUN npx prisma generate
CMD ["node", "dist/main.js"]
```

### Prisma Migrations (run in Railway deploy hook)
```bash
npx prisma migrate deploy
npx prisma db seed    # seed categories and knowledge chunks
```

---

## BUILD ORDER FOR AGENT

Execute pillars in this exact sequence:
1. Scaffold monorepo (Turborepo + shared packages)
2. Database schema + Prisma migrations
3. Pillar 1: Auth & Profiles (everything depends on this)
4. Pillar 2: Q&A Engine (core loop)
5. Pillar 7: Notifications (needed by Q&A)
6. Pillar 8: Gamification (hooks into Q&A)
7. Pillar 3: Mentor Directory
8. Pillar 4: Resource Library
9. Pillar 5: Study Groups
10. Pillar 6: Moderation
11. Pillar 9: GhanaHealth AI (knowledge seeding first)
12. Pillar 10: Admin Console
13. Integration testing + deployment config

---

*ClinIQ Agent Build Spec v1.0 — Internal use only*
