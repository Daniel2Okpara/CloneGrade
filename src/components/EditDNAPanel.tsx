import { ImageStats } from "@/lib/analysis";

interface EditDNAPanelProps {
    stats: ImageStats | null;
}

export default function EditDNAPanel({ stats }: EditDNAPanelProps) {
    if (!stats) {
        return (
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
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Colors */}
            <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--foreground-muted)' }}>
                    Dominant Colors
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {stats.dominantColors.map((color, i) => (
                        <div
                            key={i}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: color,
                                border: '1px solid var(--glass-border)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--foreground-muted)' }}>
                    Global Stats
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <StatItem label="Brightness" value={stats.brightness} />
                    <StatItem label="Contrast" value={stats.contrast} />
                    <StatItem label="Saturation" value={stats.saturation} />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: number }) {
    return (
        <div style={{
            background: 'var(--surface)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)'
        }}>
            <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
                {value}%
            </div>
        </div>
    );
}
