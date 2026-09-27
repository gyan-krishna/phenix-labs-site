import { ImageResponse } from 'next/og'
import { sharedContent } from '@/content/shared'

export const alt = sharedContent.socialPreview.alt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Branded fallback preview used when pages are shared on social and messaging apps. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #071423 0%, #102c48 62%, #0d5ca7 100%)',
          color: '#f3f8fc',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              'linear-gradient(rgba(116,190,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(116,190,255,.45) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            right: -110,
            top: -170,
            borderRadius: 999,
            background: 'rgba(55, 177, 232, .24)',
            filter: 'blur(38px)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 82px',
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 99,
                background: '#55c9f1',
                boxShadow: '0 0 26px #55c9f1',
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
              {sharedContent.socialPreview.brand}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
            <span style={{ fontSize: 72, lineHeight: 1.04, fontWeight: 700, letterSpacing: -3 }}>
              {sharedContent.socialPreview.title}
            </span>
            <span style={{ marginTop: 25, fontSize: 27, color: '#b8cce0' }}>
              {sharedContent.socialPreview.capabilities}
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
