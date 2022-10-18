/*
  Warnings:

  - You are about to drop the column `aiaAvslaattEgenvurdering` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaAvslaattEgenvurderingUke12` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaFeedbackHjelpOgStotteForklaring` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaFeedbackHjelpOgStotteForklaringUngdom` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaFeedbackMeldekortForklaring` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaFeedbackSvarFraRegistreringen` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaReaktiveringVisning` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `aiaValgtPengestotteVisning` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Profil` table. All the data in the column will be lost.
  - Added the required column `profil` to the `Profil` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profil_bruker_id_key";

-- AlterTable
ALTER TABLE "Profil" DROP COLUMN "aiaAvslaattEgenvurdering",
DROP COLUMN "aiaAvslaattEgenvurderingUke12",
DROP COLUMN "aiaFeedbackHjelpOgStotteForklaring",
DROP COLUMN "aiaFeedbackHjelpOgStotteForklaringUngdom",
DROP COLUMN "aiaFeedbackMeldekortForklaring",
DROP COLUMN "aiaFeedbackSvarFraRegistreringen",
DROP COLUMN "aiaReaktiveringVisning",
DROP COLUMN "aiaValgtPengestotteVisning",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profil" JSONB NOT NULL;
