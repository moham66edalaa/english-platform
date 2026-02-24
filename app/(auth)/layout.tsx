// app/(auth)/layout.tsx
import "@/app/globals.css"; // Essential to load styles

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0f14] font-sans antialiased text-[#f5f0e8]">
      {children}
    </div>
  );
}