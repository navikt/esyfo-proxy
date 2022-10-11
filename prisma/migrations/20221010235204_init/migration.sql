/*
  Warnings:

  - Added the required column `aiaReaktiveringVisning` to the `Profil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aiaValgtPengestotteVisning` to the `Profil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profil" ADD COLUMN     "aiaAvslaattEgenvurdering" TIMESTAMP(3),
ADD COLUMN     "aiaAvslaattEgenvurderingUke12" TIMESTAMP(3),
ADD COLUMN     "aiaFeedbackHjelpOgStotteForklaring" TEXT,
ADD COLUMN     "aiaFeedbackHjelpOgStotteForklaringUngdom" TEXT,
ADD COLUMN     "aiaFeedbackMeldekortForklaring" TEXT,
ADD COLUMN     "aiaFeedbackSvarFraRegistreringen" TEXT,
ADD COLUMN     "aiaReaktiveringVisning" TEXT NOT NULL,
ADD COLUMN     "aiaValgtPengestotteVisning" TEXT NOT NULL;
