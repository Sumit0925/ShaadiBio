import React from 'react';

export function Loader({ fullScreen = false, text = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-3 border-gold-200 border-t-gold-600 rounded-full animate-spin" style={{ borderWidth: 3 }} />
      <span className="text-sm text-gray-500 font-medium">{text}</span>
    </div>
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }
  return <div className="py-12 flex items-center justify-center">{content}</div>;
}

export function EmptyState({ icon = '📋', title = 'Nothing here yet', description, action }) {
  return (
    <div className="py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-xl text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="font-display text-white text-lg mb-1">💍 ShaadiBio</div>
        <p className="text-sm">Marriage BioData Generator · Made with ❤️ for Indian families</p>
        <p className="text-xs mt-2 text-gray-600">© {new Date().getFullYear()} ShaadiBio. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}
