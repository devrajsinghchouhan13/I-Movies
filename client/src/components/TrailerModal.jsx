import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export const TrailerModal = ({
  trailerUrl,
  movieTitle,
  onClose
}) => {
  const getEmbedUrl = (url) => {
    try {
      const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`;
      }
    } catch (e) {
      // fallback
    }
    return null;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold block">
              Official Cinema Preview
            </span>
            <h3 className="text-base font-bold font-display text-white mt-0.5">
              {movieTitle} — Trailer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black relative flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="text-center p-8 space-y-3">
              <p className="text-neutral-400 text-sm">Online preview trailer player</p>
              <a
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl"
              >
                Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
