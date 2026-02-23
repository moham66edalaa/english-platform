// 📁 app/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600, height: 600, top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  )
}