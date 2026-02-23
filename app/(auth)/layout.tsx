// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--ink)] flex flex-col items-start justify-start px-4 relative overflow-hidden pt-[120px]">
      {/* طبقة نسيج خفيف */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />
      {/* طبقات التوهج الذهبي */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 1000,
          height: 1000,
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 800,
          height: 800,
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
        }}
      />
      {/* حاوية البطاقة */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}