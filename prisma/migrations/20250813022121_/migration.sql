-- CreateEnum
CREATE TYPE "public"."badge" AS ENUM ('PARTICIPANT', 'REOCORD', 'LIKECOUNT');

-- CreateEnum
CREATE TYPE "public"."exercise_type" AS ENUM ('RUNNING', 'CYCLE', 'SWIMMING');

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "aimed_time" INTEGER NOT NULL,
    "discord_webhook_url" TEXT NOT NULL,
    "discord_server_url" TEXT NOT NULL,
    "badge" "public"."badge" NOT NULL,
    "user_count" INTEGER NOT NULL,
    "likecount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "total_record_time" INTEGER NOT NULL,
    "total_record_count" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Record" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "exercise_type" "public"."exercise_type" NOT NULL,
    "description" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "group_id" INTEGER,
    "record_id" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tags" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."Record"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tags" ADD CONSTRAINT "Tags_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
