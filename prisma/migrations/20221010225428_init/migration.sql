-- CreateTable
CREATE TABLE "Profil" (
    "id" SERIAL NOT NULL,
    "bruker_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profil_bruker_id_key" ON "Profil"("bruker_id");
