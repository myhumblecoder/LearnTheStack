-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "externalId" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "TopicProgress" ADD COLUMN     "nextReviewAt" DATE,
ADD COLUMN     "reviewStage" INTEGER NOT NULL DEFAULT 0;
