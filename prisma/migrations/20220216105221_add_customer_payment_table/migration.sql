-- CreateTable
CREATE TABLE "customerPayments" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "customerPayments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_paymentId_key" ON "customerPayments"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_customerId_key" ON "customerPayments"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customerPayments_email_key" ON "customerPayments"("email");

-- AddForeignKey
ALTER TABLE "customerPayments" ADD CONSTRAINT "customerPayments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
