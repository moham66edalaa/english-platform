// 📁 components/player/AttachmentList.tsx

import type { AttachmentRow } from '@/types'

export default function AttachmentList({ attachments }: { attachments: AttachmentRow[] }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-[1.1rem] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Resources
      </h3>
      <div className="flex flex-col gap-2">
        {attachments.map((a) => (
          <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm px-4 py-3 hover:border-[rgba(201,168,76,0.3)] hover:text-[var(--gold)] transition-all group">
            <span className="text-[var(--gold)] text-[0.85rem]">📄</span>
            <span className="text-[0.85rem] text-[var(--cream-dim)] group-hover:text-[var(--gold)] transition-colors">
              {a.name}
            </span>
            <span className="ml-auto text-[0.65rem] tracking-widest uppercase text-[var(--muted)] group-hover:text-[var(--gold)]">
              Download →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}