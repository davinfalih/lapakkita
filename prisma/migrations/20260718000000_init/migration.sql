CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "namaToko" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "noWhatsapp" TEXT,
    "alamat" TEXT,
    "fotoToko" TEXT NOT NULL DEFAULT 'default-store.png',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "foto" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT,
    "kategori" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Order" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "pembeliNama" TEXT NOT NULL,
    "pembeliAlamat" TEXT,
    "pembeliNoHp" TEXT,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL DEFAULT 'qris',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "orderCode" TEXT NOT NULL UNIQUE,
    "snapToken" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
