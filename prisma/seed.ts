// prisma/seed.ts
const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Bersihkan dulu (opsional, hati-hati di production!)
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gradeLevel.deleteMany();

  // === 1. Seed Grade Levels ===
  const kelas7 = await prisma.gradeLevel.create({
    data: { name: "Kelas 7", order: 7, isFinal: false },
  });
  const kelas8 = await prisma.gradeLevel.create({
    data: { name: "Kelas 8", order: 8, isFinal: false },
  });
  const kelas9 = await prisma.gradeLevel.create({
    data: { name: "Kelas 9", order: 9, isFinal: true },
  });

  console.log("✅ GradeLevel seeded: 7–9");

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      role: Role.ADMIN,
      password: await bcrypt.hash("admin", 10),
    },
  });
  console.log(`✅ Admin seeded : ${admin.name}`);

  // === 2. Seed 5 Students ===
  for (let i = 1; i <= 10; i++) {
    const nis = `2025${i.toString().padStart(3, "0")}`; // contoh: 2025001, 2025002 ...
    const hashed = await bcrypt.hash(nis, 10);

    const user = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        role: Role.STUDENT,
        password: hashed,
        studentProfile: {
          create: {
            nis,
            gradeLevelId: kelas7.id, // semua masuk Kelas 7 awalnya
          },
        },
      },
    });

    console.log(`👩‍🎓 Student created: ${user.name} (nis=${nis}, pass=${nis})`);
  }

  // === 3. Seed 5 Teachers ===
  for (let i = 1; i <= 5; i++) {
    const nip = `TCH2025${i.toString().padStart(3, "0")}`; // contoh: TCH2025001
    const hashed = await bcrypt.hash(nip, 10);

    const user = await prisma.user.create({
      data: {
        name: `Teacher ${i}`,
        role: Role.TEACHER,
        password: hashed,
        teacherProfile: {
          create: {
            nip,
            subject: `Subject ${i}`,
          },
        },
      },
    });

    console.log(`👨‍🏫 Teacher created: ${user.name} (nip=${nip}, pass=${nip})`);
  }

  console.log("🎉 Seeding finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
