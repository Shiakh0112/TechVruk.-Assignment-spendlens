import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ auditId }) {
  const [copied, setCopied] = useState(false);
  // Direct audit URL for sharing — OG tags served via /api/og/:id proxy for crawlers
  const shareUrl = `${window.location.origin}/audit/${auditId}`;
  const ogProxyUrl = `${import.meta.env.VITE_API_URL || '/api'}/og/${auditId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        // Use OG proxy URL for native share so social previews work correctly
        await navigator.share({
          title: 'My AI Spend Audit — SpendLens',
          text: 'I just audited my AI tool spend. See what I found:',
          url: ogProxyUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 truncate font-mono">
        {shareUrl}
      </div>
      <button
        onClick={handleCopy}
        className="btn-secondary flex items-center gap-2 py-2 px-3 text-sm"
        aria-label="Copy shareable link"
      >
        {copied ? (
          <><Check className="h-4 w-4 text-success-600" aria-hidden="true" /> Copied!</>
        ) : (
          <><Copy className="h-4 w-4" aria-hidden="true" /> Copy</>
        )}
      </button>
      <button
        onClick={handleNativeShare}
        className="btn-primary flex items-center gap-2 py-2 px-3 text-sm"
        aria-label="Share audit"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>
    </div>
  );
}
