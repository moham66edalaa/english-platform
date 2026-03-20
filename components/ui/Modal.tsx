// 📁 components/ui/Modal.tsx
'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open:       boolean
  onClose:    () => void
  title?:     string
  children:   React.ReactNode
  className?: string
  size?:      'sm' | 'md' | 'lg'
}

const sizeMap = { sm: '480px', md: '560px', lg: '672px' }

export default function Modal({ open, onClose, title, children, className, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const modal = (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 950, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(6,8,12,0.88)',
        backdropFilter: 'blur(8px)',
      }} />

      {/* Panel */}
      <div
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: sizeMap[size],
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg, #181c26 0%, #12151d 100%)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '20px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Gold top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
          background: 'linear-gradient(90deg, transparent, #c9a84c, #e8cc80, #c9a84c, transparent)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 28px 18px',
            borderBottom: '1px solid rgba(245,240,232,0.06)',
          }}>
            <h2
              id="modal-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.35rem', fontWeight: 600,
                color: '#F5F0E8', margin: 0, letterSpacing: '0.01em',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(245,240,232,0.04)',
                border: '1px solid rgba(245,240,232,0.06)',
                borderRadius: '10px', padding: '6px',
                cursor: 'pointer', color: '#8A8278',
                transition: 'all 0.2s', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F5F0E8'
                e.currentTarget.style.background = 'rgba(245,240,232,0.08)'
                e.currentTarget.style.borderColor = 'rgba(245,240,232,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8A8278'
                e.currentTarget.style.background = 'rgba(245,240,232,0.04)'
                e.currentTarget.style.borderColor = 'rgba(245,240,232,0.06)'
              }}
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Close button only (no title) */}
        {!title && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 10,
              background: 'rgba(245,240,232,0.04)',
              border: '1px solid rgba(245,240,232,0.06)',
              borderRadius: '10px', padding: '6px',
              cursor: 'pointer', color: '#8A8278',
              transition: 'all 0.2s', display: 'flex',
            }}
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div style={{
          padding: '24px 28px', flex: 1, minHeight: 0,
          overflowY: 'auto',
        }}>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
