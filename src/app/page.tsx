export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Blog Platform</h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern platform for sharing your thoughts and ideas with the world.
        </p>
        <div className="grid gap-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-600">
              Start writing your first blog post and share your knowledge with
              others.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
