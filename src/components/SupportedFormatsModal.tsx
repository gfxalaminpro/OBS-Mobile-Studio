import React from 'react';
import { SUPPORTED_FORMATS } from '../data/platforms';
import { 
  X, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  FileText, 
  Code, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

interface SupportedFormatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportedFormatsModal: React.FC<SupportedFormatsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getFormatIcon = (category: string) => {
    switch (category) {
      case 'Video Files': return <FileVideo className="w-5 h-5 text-rose-400" />;
      case 'Audio & Music Tracks': return <FileAudio className="w-5 h-5 text-amber-400" />;
      case 'Images & Graphics': return <FileImage className="w-5 h-5 text-emerald-400" />;
      case 'PDF Documents & Slides': return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Interactive HTML & Web Pages': return <Code className="w-5 h-5 text-cyan-400" />;
      default: return <HelpCircle className="w-5 h-5 text-[#58A6FF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0D1117] border-b border-[#21262D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#58A6FF]/10 text-[#58A6FF] rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                সমর্থিত ফাইল ফরম্যাট গাইড (Supported Formats)
              </h2>
              <p className="text-xs text-[#8B949E]">
                মোবাইল স্টুডিওতে লাইভ স্ট্রিম করার জন্য গ্রহণযোগ্য সকল মিডিয়া ফাইল
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#21262D] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {SUPPORTED_FORMATS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0D1117] border border-[#21262D] rounded-xl p-4 flex flex-col gap-2.5 hover:border-[#30363D] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#161B22] border border-[#30363D]">
                    {getFormatIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{item.categoryBn}</span>
                      <span className="text-xs font-normal text-[#8B949E]">({item.category})</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.extensions.map((ext, eIdx) => (
                        <span
                          key={eIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#21262D] text-[#58A6FF] border border-[#30363D]"
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#C9D1D9] leading-relaxed">
                <p className="text-[#38EF7D]">{item.descriptionBn}</p>
                <p className="text-[#8B949E] text-[11px] mt-1">{item.description}</p>
              </div>

              <div className="text-[11px] text-[#8B949E] pt-2 border-t border-[#21262D] flex items-center gap-1.5">
                <span className="font-semibold text-white">উপযোগী ক্ষেত্র:</span>
                <span>{item.sampleUse}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0D1117] border-t border-[#21262D] flex items-center justify-between text-xs text-[#8B949E]">
          <span>Android 10+ ও Modern Web ব্রাউজারে সম্পূর্ণ কার্যকর</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#238636] hover:bg-[#2EA043] text-white font-semibold rounded-lg cursor-pointer"
          >
            বুঝেছি (Got It)
          </button>
        </div>
      </div>
    </div>
  );
};
