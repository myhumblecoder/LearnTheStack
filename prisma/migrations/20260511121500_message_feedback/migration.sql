-- CreateEnum
CREATE TYPE "FeedbackRating" AS ENUM ('UP', 'DOWN');

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN "externalId" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_externalId_key" ON "ChatMessage"("externalId");

-- CreateTable
CREATE TABLE "MessageFeedback" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "rating" "FeedbackRating" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageFeedback_messageId_key" ON "MessageFeedback"("messageId");

-- AddForeignKey
ALTER TABLE "MessageFeedback" ADD CONSTRAINT "MessageFeedback_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
