import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '../lib/db'

export const Route = createFileRoute('/repositories')({
  loader: async () => {
    // Fetch repositories with their tags and creator information
    const repositories = await prisma.repository.findMany({
      where: {
        isArchived: false, // Only show active repositories
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { repositories }
  },
  component: RepositoriesPage,
})

function RepositoriesPage() {
  const { repositories } = Route.useLoaderData()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Repositories</h1>
      
      {repositories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No repositories found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Run <code>npm run db:seed</code> to add some sample data.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {repo.owner}/{repo.name}
                  </a>
                </h3>
              </div>
              
              {repo.description && (
                <p className="text-gray-600 text-sm mb-4">{repo.description}</p>
              )}
              
              {repo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-block px-2 py-1 text-xs rounded-full text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Created by {repo.createdBy.name || repo.createdBy.email}
                <br />
                {new Date(repo.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}