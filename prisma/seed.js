const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.upsert({
    create: { email: process.env.ADMIN_EMAIL },
    update: {},
    where: { email: process.env.ADMIN_EMAIL },
  });
  console.info({ user });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
