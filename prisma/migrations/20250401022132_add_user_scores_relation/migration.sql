/*
  Warnings:

  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Quiz";

-- CreateTable
CREATE TABLE "Questao" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER NOT NULL,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
