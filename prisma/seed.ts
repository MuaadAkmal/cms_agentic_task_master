import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean the database first
  await prisma.message.deleteMany()
  await prisma.task.deleteMany()
  await prisma.document.deleteMany()
  await prisma.groupChat.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleaned')

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
  })

  const employee1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employee',
    },
  })

  const employee2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'employee',
    },
  })

  console.log('Users created:', { admin, employee1, employee2 })

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      lsa: 'Option 1',
      tsp: 'TSP 1',
      dotAndLea: 'Option A',
      problemDescription: 'Network connectivity issues in the server room.',
      status: 'Pending',
      assignedToId: employee1.id,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      lsa: 'Option 2',
      tsp: 'TSP 2',
      dotAndLea: 'Option B',
      problemDescription: 'Software installation failure on workstation WS-003.',
      status: 'Approved',
      assignedToId: employee2.id,
      solutionProvided: 'Reinstalled the software and updated drivers.',
      remarks: 'Fixed within SLA timeframe.',
    },
  })

  const task3 = await prisma.task.create({
    data: {
      lsa: 'Option 3',
      tsp: 'TSP 3',
      dotAndLea: 'Option C',
      problemDescription: 'Email service outage affecting marketing department.',
      status: 'Pending',
      assignedToId: employee1.id,
    },
  })

  console.log('Tasks created:', { task1, task2, task3 })

  // Create a group chat
  const generalChat = await prisma.groupChat.create({
    data: {
      name: 'General Chat',
      participants: {
        connect: [
          { id: admin.id },
          { id: employee1.id },
          { id: employee2.id },
        ],
      },
    },
  })

  console.log('Group chat created:', generalChat)

  // Create some chat messages
  const message1 = await prisma.message.create({
    data: {
      content: 'Hello team, welcome to the new CMS system!',
      senderId: admin.id,
      groupChatId: generalChat.id,
    },
  })

  const message2 = await prisma.message.create({
    data: {
      content: 'Thanks! Looking forward to using it.',
      senderId: employee1.id,
      groupChatId: generalChat.id,
    },
  })

  const message3 = await prisma.message.create({
    data: {
      content: 'The interface looks very clean and intuitive.',
      senderId: employee2.id,
      groupChatId: generalChat.id,
    },
  })

  console.log('Messages created:', { message1, message2, message3 })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })