-- CreateEnum
CREATE TYPE "Oppfolging" AS ENUM ('KLARE_SEG_SELV', 'ONSKER_OPPFOLGING', 'IKKE_BESVART');

-- CreateTable
CREATE TABLE "BehovForVeiledning" (
    "id" SERIAL NOT NULL,
    "bruker_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oppfolging" "Oppfolging" NOT NULL,

    CONSTRAINT "BehovForVeiledning_pkey" PRIMARY KEY ("id")
);
