'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
    onUpload: (file: File) => void;
    label?: string;
    accept?: string;
}

export default function ImageUploader({ onUpload, label = "Upload Image", accept = "image/*" }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`glass-panel ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
                border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept={accept}
                style={{ display: 'none' }}
            />

            <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--surface-highlight)',
                borderRadius: '50%',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                {label}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
                Drag & drop or click to browse
            </p>
        </div>
    );
}
