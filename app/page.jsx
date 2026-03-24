import Remover from './components/Remover'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Image Background Remover</h1>
        <p className="text-gray-500 text-lg">Remove image backgrounds instantly. Free, fast, no sign-up.</p>
      </div>

      <Remover />

      {/* Info bar */}
      <div className="flex justify-center gap-8 mt-12 flex-wrap text-sm text-gray-400">
        <span>⚡ Fast processing</span>
        <span>🔒 Images are never stored</span>
        <span>✅ No sign-up required</span>
      </div>
    </main>
  )
}
