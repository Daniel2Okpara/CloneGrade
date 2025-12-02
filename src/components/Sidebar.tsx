export default function Sidebar({ children }: { children?: React.ReactNode }) {
    return (
        <aside className="glass-panel" style={{
            position: 'fixed',
            top: '64px',
            right: 0,
            bottom: 0,
            width: '320px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderLeft: '1px solid var(--glass-border)',
            overflowY: 'auto'
        }}>
            <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--foreground-muted)', marginBottom: '16px' }}>
                    Edit DNA
                </h3>
                {children || (
                    <div style={{
                        padding: '16px',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--foreground-muted)',
                        fontSize: '13px'
                    }}>
                        No reference image
                    </div>
                )}
            </div>

            <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--foreground-muted)', marginBottom: '16px' }}>
                    Adjustments
                </h3>
                {/* Placeholder for Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {['Exposure', 'Contrast', 'Highlights', 'Shadows'].map(label => (
                        <div key={label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                <span>{label}</span>
                                <span style={{ color: 'var(--foreground-muted)' }}>0</span>
                            </div>
                            <div style={{
                                height: '4px',
                                background: 'var(--surface-highlight)',
                                borderRadius: 'var(--radius-full)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '50%',
                                    height: '100%',
                                    background: 'var(--primary)',
                                    borderRadius: 'var(--radius-full)'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
