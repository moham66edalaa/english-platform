import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eloquence — English Mastery Platform',
  description:
    'Structured English learning from A1 to C1. Expert-led courses, placement testing, live sessions, and CEFR certification.',
  keywords: ['English learning', 'IELTS', 'TOEFL', 'CEFR', 'English courses'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}