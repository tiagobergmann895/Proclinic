const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({where: {email: 'admin@mediflow.com'}})
  .then(user => {
    if(user) console.log("User found in database!");
    else console.log("User not found in database.");
  })
  .catch(console.error)
  .finally(()=>prisma.$disconnect());
