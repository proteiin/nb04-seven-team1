/*
  Warnings:

  - The values [REOCORD] on the enum `badge` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `aimed_time` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discord_server_url` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `likecount` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `total_record_count` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total_record_time` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discord_invite_url` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_rep` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auth_code` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."auth_code" AS ENUM ('Owner', 'participants');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."badge_new" AS ENUM ('PARTICIPANT', 'RECORD', 'LIKECOUNT');
ALTER TABLE "public"."Group" ALTER COLUMN "badge" TYPE "public"."badge_new" USING ("badge"::text::"public"."badge_new");
ALTER TYPE "public"."badge" RENAME TO "badge_old";
ALTER TYPE "public"."badge_new" RENAME TO "badge";
DROP TYPE "public"."badge_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Tags" DROP CONSTRAINT "Tags_group_id_fkey";

-- AlterTable
ALTER TABLE "public"."Group" DROP COLUMN "aimed_time",
DROP COLUMN "discord_server_url",
DROP COLUMN "imageId",
DROP COLUMN "likecount",
DROP COLUMN "nickname",
DROP COLUMN "password",
ADD COLUMN     "discord_invite_url" TEXT NOT NULL,
ADD COLUMN     "goal_rep" INTEGER NOT NULL,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "badge" DROP NOT NULL,
ALTER COLUMN "user_count" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "uploadedAt",
ADD COLUMN     "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Record" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "total_record_count",
DROP COLUMN "total_record_time",
ADD COLUMN     "auth_code" "public"."auth_code" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Tags";

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
