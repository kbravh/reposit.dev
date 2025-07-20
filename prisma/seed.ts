import { prisma } from '../src/lib/db'
import { generateId, generateAuthId } from '../src/lib/utils'

async function main() {
  console.log('🌱 Starting seed...')

  // Create a sample user (using generateAuthId for NextAuth compatibility)
  const user = await prisma.user.create({
    data: {
      id: generateAuthId(),
      name: 'John Doe',
      email: 'john@example.com',
    },
  })

  console.log('👤 Created user:', user.email)

  // Create sample tags
  const reactTag = await prisma.tag.create({
    data: {
      id: generateId(),
      name: 'React',
      color: '#61DAFB',
      createdById: user.id,
    },
  })

  const typescriptTag = await prisma.tag.create({
    data: {
      id: generateId(),
      name: 'TypeScript',
      color: '#3178C6',
      createdById: user.id,
    },
  })

  console.log('🏷️ Created tags:', reactTag.name, typescriptTag.name)

  // Create a sample repository
  const repository = await prisma.repository.create({
    data: {
      id: generateId(),
      name: 'awesome-react-app',
      owner: 'johndoe',
      url: 'https://github.com/johndoe/awesome-react-app',
      description: 'An awesome React application',
      createdById: user.id,
    },
  })

  console.log('📦 Created repository:', repository.name)

  // Tag the repository
  await prisma.repositoryTag.create({
    data: {
      repositoryId: repository.id,
      tagId: reactTag.id,
    },
  })

  await prisma.repositoryTag.create({
    data: {
      repositoryId: repository.id,
      tagId: typescriptTag.id,
    },
  })

  console.log('🔗 Tagged repository with React and TypeScript')

  // Create a sample list
  const list = await prisma.list.create({
    data: {
      id: generateId(),
      name: 'Frontend Projects',
      description: 'Collection of frontend development projects',
      createdById: user.id,
    },
  })

  console.log('📋 Created list:', list.name)

  // Add repository to list
  await prisma.listRepositoryEntry.create({
    data: {
      id: generateId(),
      listId: list.id,
      repositoryId: repository.id,
      entryType: 'include',
    },
  })

  console.log('✅ Added repository to list')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })