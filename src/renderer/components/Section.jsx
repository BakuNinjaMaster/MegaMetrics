import React from 'react'

export default function Section({ title, children, style }) {
  return (
    // IMPROVEMENT: Used semantic <section> tag instead of a generic div
    <section style={{
      background: 'var(--bg-panel)',
      border: '0.5px solid var(--border)',
      borderRadius: 7,
      padding: '8px 10px',
      // IMPROVEMENT: Allows the parent component to pass in extra styles (like marginTop or gap)
      ...style, 
    }}>
      {/* IMPROVEMENT: Made title optional, and used a semantic <header> tag */}
      {title && (
        <header style={{
          fontSize: 8,
          fontWeight: 600, // Bumped slightly for better contrast on small text
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          {title}
        </header>
      )}
      
      {children}
    </section>
  )
}