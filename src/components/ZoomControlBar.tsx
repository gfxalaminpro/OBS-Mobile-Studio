import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  FlipHorizontal, 
  RotateCw, 
  Move 
} from 'lucide-react';

interface ZoomControlBarProps {
  zoom: number; // 0.5 to 3.0
  setZoom: (zoom: number) => void;
  panX: number;
  panY: number;
  resetPan: () => void;
  fitMode: 'contain' | 'cover';
  setFitMode: (mode: 'contain' | 'cover') => void;
  rotation: number;
  setRotation: (deg: number) => void;
  flipH: boolean;
  setFlipH: (flip: boolean) => void;
}

export const ZoomControlBar: React.FC<ZoomControlBarProps> = ({
  zoom,
  setZoom,
  panX,
  panY,
  resetPan,
  fitMode,
  setFitMode,
  rotation,
  setRotation,
  flipH,
  setFlipH,
}) => {
  const percent = Math.round(zoom * 100);

  const handleZoomIn = () => {
    setZoom(Math.min(3.0, Number((zoom + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.5, Number((zoom - 0.15).toFixed(2))));
  };

  const handleResetAll = () => {
    setZoom(1.0);
    resetPan();
    setRotation(0);
    setFlipH(false);
  };

  return (
    <div className="bg-[#161B22] border-t border-[#30363D] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Zoom Bar Label & Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-[#8B949E] font-medium flex items-center gap-1.5 shrink-0">
          <ZoomIn className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>জুম ইন / আউট (Zoom):</span>
        </span>

        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-1 rounded bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 text-[#C9D1D9] hover:text-white cursor-pointer"
          title="Zoom Out (-15%)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Continuous Zoom Slider */}
        <div className="flex items-center gap-2 w-32 sm:w-44">
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 3.0}
          className="p-1 rounded bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 text-[#C9D1D9] hover:text-white cursor-pointer"
          title="Zoom In (+15%)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom percentage badge */}
        <span className="font-mono font-bold text-white px-2 py-0.5 bg-[#0D1117] border border-[#30363D] rounded min-w-[52px] text-center">
          {percent}%
        </span>
      </div>

      {/* Middle: Quick zoom presets */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          type="button"
          onClick={() => setZoom(1.0)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            percent === 100 ? 'bg-[#58A6FF]/20 text-[#58A6FF] font-bold' : 'bg-[#21262D] text-[#8B949E] hover:text-white'
          }`}
        >
          100%
        </button>
        <button
          type="button"
          onClick={() => setZoom(1.5)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            percent === 150 ? 'bg-[#58A6FF]/20 text-[#58A6FF] font-bold' : 'bg-[#21262D] text-[#8B949E] hover:text-white'
          }`}
        >
          150%
        </button>
        <button
          type="button"
          onClick={() => setZoom(2.0)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            percent === 200 ? 'bg-[#58A6FF]/20 text-[#58A6FF] font-bold' : 'bg-[#21262D] text-[#8B949E] hover:text-white'
          }`}
        >
          200%
        </button>
      </div>

      {/* Right: Framing, Mirror, Rotation & Reset */}
      <div className="flex items-center gap-1.5">
        {(panX !== 0 || panY !== 0) && (
          <button
            type="button"
            onClick={resetPan}
            className="px-2 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#38EF7D] text-[11px] rounded flex items-center gap-1 cursor-pointer"
            title="Reset Pan Center"
          >
            <Move className="w-3 h-3" />
            <span>Center</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            fitMode === 'cover' ? 'bg-[#58A6FF]/20 text-[#58A6FF]' : 'bg-[#21262D] text-[#8B949E] hover:text-white'
          }`}
          title={fitMode === 'contain' ? 'Switch to Fill/Cover' : 'Switch to Fit/Contain'}
        >
          {fitMode === 'contain' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setFlipH(!flipH)}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            flipH ? 'bg-[#58A6FF]/20 text-[#58A6FF]' : 'bg-[#21262D] text-[#8B949E] hover:text-white'
          }`}
          title="Mirror / Flip Horizontal"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setRotation((rotation + 90) % 360)}
          className="p-1.5 rounded bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white cursor-pointer"
          title="Rotate 90°"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetAll}
          className="px-2.5 py-1 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white rounded flex items-center gap-1 cursor-pointer"
          title="Reset Zoom & Transform"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
