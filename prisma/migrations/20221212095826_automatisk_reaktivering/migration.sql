-- CreateTable
CREATE TABLE "AutomatiskReaktivering" (
    "id" SERIAL NOT NULL,
    "bruker_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomatiskReaktivering_pkey" PRIMARY KEY ("id")
);
