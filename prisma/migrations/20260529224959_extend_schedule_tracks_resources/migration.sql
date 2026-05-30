/*
  Warnings:

  - You are about to drop the column `resources` on the `Topic` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Month` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Month` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Week` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Track" AS ENUM ('CORE', 'DSA', 'AZURE', 'CLAUDE_CODE');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('DOC', 'VIDEO', 'TEXTBOOK');

-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "externalId" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "Month" ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "isBuffer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" DATE NOT NULL;

-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN     "pomodoros" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "topicId" INTEGER;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "resources",
ADD COLUMN     "estimatedPomodoros" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "scheduledDate" DATE,
ADD COLUMN     "track" "Track" NOT NULL DEFAULT 'CORE';

-- AlterTable
ALTER TABLE "Week" ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL;

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "type" "ResourceType" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "source" TEXT,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
