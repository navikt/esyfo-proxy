-- DropIndex
DROP INDEX "BehovForVeiledning_bruker_id_idx";

-- AlterTable
ALTER TABLE "BehovForVeiledning" ADD COLUMN     "foedselsnummer" TEXT;

-- CreateIndex
CREATE INDEX "BehovForVeiledning_bruker_id_foedselsnummer_idx" ON "BehovForVeiledning"("bruker_id", "foedselsnummer");
