import './globals.css'

export const metadata = {
  title: 'Image Background Remover — Free Online Tool',
  description: 'Remove image backgrounds instantly. Free, fast, no sign-up required.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
