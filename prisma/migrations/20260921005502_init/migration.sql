-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT,
    "birthYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artworks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "inventoryCode" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "medium" TEXT NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "isExhibited" BOOLEAN NOT NULL DEFAULT true,
    "artistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artworks_inventoryCode_key" ON "artworks"("inventoryCode");

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
