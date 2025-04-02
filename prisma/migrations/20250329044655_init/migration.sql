-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "correct" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
