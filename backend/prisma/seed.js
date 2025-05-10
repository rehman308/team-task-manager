const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

async function seed() {
  console.log('Seeding database...');

  // Reset DB
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const admin1 = await prisma.user.create({
    data: {
      name: 'admin1',
      email: 'admin1@example.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'admin2',
      email: 'admin2@example.com',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  });

  for (let i = 0; i < 10; i++) {
    const member = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `member${i + 1}@example.com`,
        password: await hashPassword('member123'),
        role: 'MEMBER',
      },
    });

    const numProjects = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numProjects; j++) {
      const project = await prisma.project.create({
        data: {
          title: faker.commerce.productName(),
          userId: member.id,
        },
      });

      const numTasks = Math.floor(Math.random() * 10) + 1;
      for (let k = 0; k < numTasks; k++) {
        await prisma.task.create({
          data: {
            content: faker.lorem.sentence(),
            status: Math.random() > 0.5 ? 'complete' : 'incomplete',
            projectId: project.id,
          },
        });
      }
    }
  }

  console.log('Seed complete.');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
