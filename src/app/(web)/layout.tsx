import { absoluteUrl } from '@/lib/utils'
import { Metadata } from 'next'
import '@/styles/index.css'
import 'highlight.js/styles/github.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.dast.in'), 
  
  title: {
    default: 'Dasteen Blog', 
    template: '%s | Dasteen' 
  },
  
  description: 'Personal notes on technology, design, and the curiosities in between.', 
  
  openGraph: {
    title: 'Dasteen Blog',
    description: 'Personal notes on technology, design, and the curiosities in between.',
    url: absoluteUrl('/'),
    siteName: 'Dasteen',
    images: [
      {
        url: absoluteUrl('/images/metadata_cover.jpg'),
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  
  icons: {
    // Mengarahkan ke file favicon yang Kamu masukkan ke folder /app tadi
    icon: [{ url: 'favicon/Favicon-blog-dasteen.ico' }], 
    apple: [{ url: 'favicon/Favicon-blog-dasteen.ico' }]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}