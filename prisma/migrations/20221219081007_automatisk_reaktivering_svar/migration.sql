-- CreateTable
CREATE TABLE "AutomatiskReaktiveringSvar" (
    "id" SERIAL NOT NULL,
    "bruker_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "automatisk_reaktivering_id" INTEGER NOT NULL,
    "svar" TEXT NOT NULL,

    CONSTRAINT "AutomatiskReaktiveringSvar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutomatiskReaktiveringSvar_automatisk_reaktivering_id_key" ON "AutomatiskReaktiveringSvar"("automatisk_reaktivering_id");

-- CreateIndex
CREATE INDEX "AutomatiskReaktiveringSvar_bruker_id_idx" ON "AutomatiskReaktiveringSvar"("bruker_id");

-- AddForeignKey
ALTER TABLE "AutomatiskReaktiveringSvar" ADD CONSTRAINT "AutomatiskReaktiveringSvar_automatisk_reaktivering_id_fkey" FOREIGN KEY ("automatisk_reaktivering_id") REFERENCES "AutomatiskReaktivering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
