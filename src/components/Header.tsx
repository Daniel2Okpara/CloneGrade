import Link from 'next/link';

export default function Header() {
    return (
        <header className="glass-panel" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 50,
            borderBottom: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    borderRadius: '8px'
                }} />
                <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    Clone<span className="text-gradient">Grade</span>
                </h1>
            </div>

            <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--foreground-muted)' }}>
                <Link href="/" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Studio</Link>
                <Link href="/presets">Presets</Link>
                <Link href="/export">Export</Link>
            </nav>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                    Export All
                </button>
            </div>
        </header>
    );
}
