import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      firstname: "Jaylord",
      middlename: "Pinos",
      lastname: "Jenelyn",
      gender: "male",
      email: "JaySoguilonIS@gmail.com",
      password: "Jaylord123",
      role: "admin",
    },
  });

  console.log(user);
}

main()
  .catch((error) => {
    console.error(error.message);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
