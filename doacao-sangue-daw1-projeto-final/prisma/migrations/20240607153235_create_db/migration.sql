-- CreateEnum
CREATE TYPE "TipoSanguineo" AS ENUM ('A', 'B', 'AB', 'O', 'DESCONHECIDO');

-- CreateEnum
CREATE TYPE "RH" AS ENUM ('POSITIVO', 'NEGATIVO', 'DESCONHECIDO');

-- CreateTable
CREATE TABLE "Doador" (
    "codigo" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "contato" TEXT NOT NULL,
    "tipoSanguineo" "TipoSanguineo" NOT NULL,
    "rh" "RH" NOT NULL,
    "tipoRhCorretos" BOOLEAN NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Doador_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Doacao" (
    "codigo" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "hora" TIME(3) NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "tipoSanguineo" "TipoSanguineo" NOT NULL,
    "rh" "RH" NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("codigo")
);

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Doador"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
