/*
  Warnings:

  - The values [KLARE_SEG_SELV,ONSKER_OPPFOLGING,IKKE_BESVART] on the enum `Oppfolging` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Oppfolging_new" AS ENUM ('STANDARD_INNSATS', 'SITUASJONSBESTEMT_INNSATS');
ALTER TABLE "BehovForVeiledning" ALTER COLUMN "oppfolging" TYPE "Oppfolging_new" USING ("oppfolging"::text::"Oppfolging_new");
ALTER TYPE "Oppfolging" RENAME TO "Oppfolging_old";
ALTER TYPE "Oppfolging_new" RENAME TO "Oppfolging";
DROP TYPE "Oppfolging_old";
COMMIT;
