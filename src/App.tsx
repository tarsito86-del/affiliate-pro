import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Settings as SettingsIcon, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Video,
  Download,
  Upload,
  FileVideo,
  Loader2,
  History,
  Clock,
  Info,
  ChevronLeft,
  Scissors,
  Type,
  Music,
  Save,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { analyzeProduct, generateScript, getTrendingNiches, analyzeVideo, analyzeUploadedVideo, getViralProductSuggestions, generateVideo, getOperationStatus, ProductAnalysis, ScriptSuggestion, VideoAnalysis } from "./services/gemini";
import { UserPreferences } from "./types";

type Tab = "dashboard" | "products" | "viral" | "scripts" | "seo" | "analytics" | "saved" | "settings" | "guidelines";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    niche: "Home & Living (PH)",
    targetAudience: {
      ageRange: "18-34",
      interests: ["Affordable Finds", "Budol Finds", "Home Decor", "Kitchen Gadgets"],
    },
    contentStyles: ["Unboxing", "Honest Review", "POV"],
    experienceLevel: "Beginner",
    language: "Taglish (Filipino/English)",
  });

  const [trendingNiches, setTrendingNiches] = useState<string[]>([]);
  const [loadingNiches, setLoadingNiches] = useState(false);
  const [savedProducts, setSavedProducts] = useState<ProductAnalysis[]>([]);
  const [savedScripts, setSavedScripts] = useState<ScriptSuggestion[]>([]);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tour_completed");
    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem("tour_completed", "true");
    setShowTour(false);
  };

  useEffect(() => {
    const fetchNiches = async () => {
      setLoadingNiches(true);
      try {
        const niches = await getTrendingNiches();
        setTrendingNiches(niches);
      } catch (err) {
        console.error("Failed to fetch niches", err);
      } finally {
        setLoadingNiches(false);
      }
    };
    fetchNiches();
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Product Finder", icon: Search },
    { id: "viral", label: "Viral Suggestions", icon: Sparkles },
    { id: "scripts", label: "Script Lab", icon: FileText },
    { id: "seo", label: "SEO Tools", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "guidelines", label: "Guidelines", icon: ShieldCheck },
    { id: "saved", label: "Saved Items", icon: CheckCircle2 },
    { id: "settings", label: "Preferences", icon: SettingsIcon },
  ];

  const handleSaveProduct = (product: ProductAnalysis) => {
    setSavedProducts(prev => [...prev, product]);
  };

  const handleSaveScript = (script: ScriptSuggestion) => {
    setSavedScripts(prev => [...prev, script]);
  };

  const [videoPrompt, setVideoPrompt] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0] overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#141414]/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-[#141414] text-[#E4E3E0] transition-all duration-300 flex flex-col z-50 lg:relative",
        isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-[#E4E3E0]/10">
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <span className={cn(
              "font-serif italic text-xl tracking-tight transition-opacity duration-300",
              !isSidebarOpen && "lg:opacity-0"
            )}>
              Affiliate Pro
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1 hover:bg-[#E4E3E0]/10 rounded transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all group",
                activeTab === item.id 
                  ? "bg-[#E4E3E0] text-[#141414]" 
                  : "hover:bg-[#E4E3E0]/5 text-[#E4E3E0]/60 hover:text-[#E4E3E0]"
              )}
            >
              <item.icon size={20} className={cn(activeTab === item.id ? "text-[#141414]" : "text-[#E4E3E0]/40 group-hover:text-[#E4E3E0]")} />
              {(isSidebarOpen || window.innerWidth >= 1024) && (
                <span className={cn(
                  "font-medium text-sm transition-opacity duration-300",
                  !isSidebarOpen && "lg:opacity-0"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#E4E3E0]/10">
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <div className={cn(
              "text-[10px] uppercase tracking-widest opacity-40 font-mono transition-opacity duration-300",
              !isSidebarOpen && "lg:opacity-0"
            )}>
              v1.0.0-beta
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-[#141414]/10 p-4 flex items-center justify-between z-30">
          <span className="font-serif italic text-xl tracking-tight">Affiliate Pro</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <AnimatePresence>
          {showTour && (
            <OnboardingTour 
              onComplete={completeTour} 
              onTabChange={(tab) => setActiveTab(tab)}
              activeTab={activeTab}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {activeTab === "dashboard" && (
              <Dashboard trendingNiches={trendingNiches} loading={loadingNiches} userPrefs={userPrefs} onTabChange={setActiveTab} />
            )}
            {activeTab === "products" && (
              <ProductFinder userPrefs={userPrefs} onSave={handleSaveProduct} />
            )}
            {activeTab === "viral" && (
              <ViralSuggestions userPrefs={userPrefs} onSave={handleSaveProduct} onGenerateVideo={setVideoPrompt} />
            )}
            {activeTab === "scripts" && (
              <ScriptLab userPrefs={userPrefs} onSave={handleSaveScript} onGenerateVideo={setVideoPrompt} />
            )}
            {activeTab === "seo" && (
              <SEOTools userPrefs={userPrefs} />
            )}
            {activeTab === "analytics" && (
              <VideoAnalytics />
            )}
            {activeTab === "guidelines" && (
              <CommunityGuidelines />
            )}
            {activeTab === "saved" && (
              <SavedItems products={savedProducts} scripts={savedScripts} />
            )}
            {activeTab === "settings" && (
              <Settings userPrefs={userPrefs} setUserPrefs={setUserPrefs} />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {videoPrompt && (
            <VideoGenerator 
              prompt={videoPrompt} 
              onClose={() => setVideoPrompt(null)} 
            />
          )}
        </AnimatePresence>
      </main>
      </div>
    </div>
  );
}

function VideoGenerator({ prompt, onClose }: { prompt: string, onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "generating" | "polling" | "completed" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [trimRange, setTrimRange] = useState({ start: 0, end: 100 });
  const [textOverlay, setTextOverlay] = useState("");
  const [textPosition, setTextPosition] = useState(25); // Percentage from top
  const [textColor, setTextColor] = useState<string>("white");
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("center");
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPreviewingTrim, setIsPreviewingTrim] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    return seconds.toFixed(1) + "s";
  };

  const selectedDuration = ((trimRange.end - trimRange.start) / 100) * videoDuration;

  const musicOptions = [
    { id: "lofi", name: "Lofi Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: "energetic", name: "Energetic Pop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "chill", name: "Chill Wave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ];

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (videoRef.current && status === "completed") {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        const duration = video.duration || 1;
        const startTime = (trimRange.start / 100) * duration;
        const endTime = (trimRange.end / 100) * duration;
        
        setCurrentTime(video.currentTime);

        if (isPreviewingTrim) {
          if (video.currentTime < startTime) {
            video.currentTime = startTime;
          }
          if (video.currentTime > endTime) {
            video.currentTime = startTime;
            if (!video.paused) video.play();
          }
        }
      };
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, [status, trimRange, isEditing]);

  const handleStart = async () => {
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true);
      return;
    }

    setStatus("generating");
    setError(null);
    try {
      let operation = await generateVideo(prompt);
      setStatus("polling");
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await getOperationStatus(operation);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Append API key for download as per guidelines
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY!;
        const finalUrl = `${downloadLink}?x-goog-api-key=${apiKey}`;
        setVideoUrl(finalUrl);
        setStatus("completed");
      } else {
        throw new Error("Video generation failed: No download link received.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key session expired or invalid. Please re-select your key.");
      } else {
        setError(err.message || "An unexpected error occurred during video generation.");
      }
      setStatus("error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/80 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#E4E3E0] w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
      >
        <div className="p-5 md:p-8 border-b border-[#141414]/10 flex items-center justify-between">
          <div>
            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[#141414]/40">Veo 3.1 Fast</div>
            <h2 className="text-xl md:text-2xl font-serif italic font-medium">Video Generator.</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#141414]/5 rounded-full transition-colors">
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Generation Prompt</label>
            <div className="p-3 md:p-4 bg-white border border-[#141414]/10 rounded-xl text-xs md:text-sm italic text-[#141414]/80 leading-relaxed">
              {prompt}
            </div>
          </div>

          {status === "idle" && (
            <div className="space-y-4 md:space-y-6">
              {!hasKey && (
                <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 text-xs md:text-sm text-yellow-800">
                  <AlertTriangle size={18} className="shrink-0 md:w-5 md:h-5" />
                  <div className="space-y-1 md:space-y-2">
                    <p className="font-medium">API Key Required</p>
                    <p>Video generation requires a paid Google Cloud API key. You will be prompted to select one.</p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline font-medium">Learn about billing</a>
                  </div>
                </div>
              )}
              <button 
                onClick={handleStart}
                className="w-full py-3 md:py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
              >
                <Video size={18} className="md:w-5 md:h-5" /> {hasKey ? "Generate Promotional Video" : "Select API Key to Start"}
              </button>
            </div>
          )}

          {(status === "generating" || status === "polling") && (
            <div className="py-8 md:py-12 flex flex-col items-center justify-center space-y-4 md:space-y-6 text-center">
              <div className="relative">
                <Loader2 size={48} className="text-[#141414] animate-spin opacity-20 md:w-16 md:h-16" />
                <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#141414] animate-pulse md:w-6 md:h-6" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-lg md:text-xl font-serif italic font-medium">Crafting your video...</h3>
                <p className="text-xs md:text-sm text-[#141414]/60 max-w-[240px] md:max-w-xs mx-auto">
                  {status === "generating" ? "Initializing AI models..." : "Synthesizing frames and audio. This usually takes 1-2 minutes."}
                </p>
              </div>
              <div className="w-full max-w-[200px] md:max-w-xs h-1 bg-[#141414]/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#141414]"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          )}

          {status === "completed" && videoUrl && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="aspect-[9/16] max-h-[400px] mx-auto bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg relative group">
                    <video 
                      ref={videoRef}
                      src={videoUrl} 
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                      <div className="flex justify-between items-center">
                        <div className="bg-[#141414]/60 backdrop-blur-md text-[#E4E3E0] px-2 py-1 rounded text-[10px] font-mono flex items-center gap-2">
                          <Clock size={10} />
                          {formatTime(currentTime)} / {formatTime(videoDuration)}
                        </div>
                        {isEditing && (
                          <div className="bg-[#141414]/60 backdrop-blur-md text-[#E4E3E0] px-2 py-1 rounded text-[10px] font-mono flex items-center gap-2">
                            <Scissors size={10} />
                            Clip: {formatTime(selectedDuration)}
                          </div>
                        )}
                      </div>
                      
                      {/* Visual Timeline Scrubber */}
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                        <div 
                          className="absolute h-full bg-white/40"
                          style={{ 
                            left: `${trimRange.start}%`, 
                            width: `${trimRange.end - trimRange.start}%` 
                          }}
                        />
                        <motion.div 
                          className="absolute h-full bg-white w-0.5 z-10"
                          style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                        />
                      </div>
                    </div>
                    {textOverlay && (
                      <div 
                        className={cn(
                          "absolute inset-x-0 flex pointer-events-none px-4",
                          textAlignment === "left" ? "justify-start" : textAlignment === "right" ? "justify-end" : "justify-center"
                        )}
                        style={{ top: `${textPosition}%` }}
                      >
                        <span 
                          className="px-4 py-2 rounded-lg text-lg font-bold text-center shadow-xl backdrop-blur-sm transition-all"
                          style={{ 
                            backgroundColor: textColor === "white" ? "rgba(20, 20, 20, 0.8)" : 
                                            textColor === "black" ? "rgba(228, 227, 224, 0.8)" : 
                                            textColor === "yellow" ? "rgba(253, 224, 71, 0.9)" :
                                            textColor === "red" ? "rgba(239, 68, 68, 0.9)" :
                                            textColor === "blue" ? "rgba(59, 130, 246, 0.9)" :
                                            "rgba(20, 20, 20, 0.8)",
                            color: textColor === "white" ? "#E4E3E0" : 
                                   textColor === "black" ? "#141414" : 
                                   textColor === "yellow" ? "#141414" :
                                   textColor === "red" ? "#FFFFFF" :
                                   textColor === "blue" ? "#FFFFFF" :
                                   "#E4E3E0"
                          }}
                        >
                          {textOverlay}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <button 
                        onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause()}
                        className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:scale-110 transition-transform"
                      >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <a 
                      href={videoUrl} 
                      download="promo-video.mp4"
                      className="flex-1 py-3 md:py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
                    >
                      <Download size={18} className="md:w-5 md:h-5" /> Download
                    </a>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className={cn(
                        "flex-1 py-3 md:py-4 border rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm md:text-base",
                        isEditing ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" : "border-[#141414]/10 hover:bg-[#141414]/5"
                      )}
                    >
                      {isEditing ? <Save size={18} /> : <Scissors size={18} />}
                      {isEditing ? "Done Editing" : "Edit Video"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-72 space-y-6 bg-white p-6 rounded-2xl border border-[#141414]/10"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                            <Scissors size={14} /> Trim Video
                          </div>
                          <button 
                            onClick={() => setTrimRange({ start: 0, end: 100 })}
                            className="text-[10px] font-mono uppercase text-[#141414]/40 hover:text-[#141414] transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                        <div className="space-y-6 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-[#141414]/60">Loop Selection</span>
                            <button 
                              onClick={() => setIsPreviewingTrim(!isPreviewingTrim)}
                              className={cn(
                                "w-8 h-4 rounded-full transition-colors relative",
                                isPreviewingTrim ? "bg-green-500" : "bg-[#141414]/10"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                                isPreviewingTrim ? "left-4" : "left-0.5"
                              )} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono uppercase text-[#141414]/60">Start Point</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    if (videoRef.current) {
                                      const percent = (videoRef.current.currentTime / videoDuration) * 100;
                                      setTrimRange({ ...trimRange, start: Math.min(percent, trimRange.end - 1) });
                                    }
                                  }}
                                  className="text-[9px] font-mono px-1.5 py-0.5 bg-[#141414]/5 hover:bg-[#141414]/10 rounded border border-[#141414]/10 transition-colors"
                                >
                                  Use Current
                                </button>
                                <span className="text-[10px] font-mono font-bold w-12 text-right">{formatTime((trimRange.start / 100) * videoDuration)}</span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center">
                              <input 
                                type="range" 
                                min="0" 
                                max={trimRange.end - 1} 
                                step="0.1"
                                value={trimRange.start}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setTrimRange({ ...trimRange, start: val });
                                  if (videoRef.current) {
                                    videoRef.current.currentTime = (val / 100) * videoDuration;
                                  }
                                }}
                                className="flex-1 accent-[#141414] h-1.5"
                              />
                              <input 
                                type="number"
                                step="0.1"
                                min="0"
                                max={((trimRange.end - 0.1) / 100) * videoDuration}
                                value={((trimRange.start / 100) * videoDuration).toFixed(1)}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && videoDuration > 0) {
                                    const percent = Math.min(Math.max(0, (val / videoDuration) * 100), trimRange.end - 0.1);
                                    setTrimRange({ ...trimRange, start: percent });
                                    if (videoRef.current) videoRef.current.currentTime = val;
                                  }
                                }}
                                className="w-14 p-1 text-[10px] font-mono border border-[#141414]/10 rounded bg-[#141414]/5 outline-none text-center"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono uppercase text-[#141414]/60">End Point</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    if (videoRef.current) {
                                      const percent = (videoRef.current.currentTime / videoDuration) * 100;
                                      setTrimRange({ ...trimRange, end: Math.max(percent, trimRange.start + 1) });
                                    }
                                  }}
                                  className="text-[9px] font-mono px-1.5 py-0.5 bg-[#141414]/5 hover:bg-[#141414]/10 rounded border border-[#141414]/10 transition-colors"
                                >
                                  Use Current
                                </button>
                                <span className="text-[10px] font-mono font-bold w-12 text-right">{formatTime((trimRange.end / 100) * videoDuration)}</span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center">
                              <input 
                                type="range" 
                                min={trimRange.start + 1} 
                                max="100" 
                                step="0.1"
                                value={trimRange.end}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setTrimRange({ ...trimRange, end: val });
                                  if (videoRef.current) {
                                    videoRef.current.currentTime = (val / 100) * videoDuration;
                                  }
                                }}
                                className="flex-1 accent-[#141414] h-1.5"
                              />
                              <input 
                                type="number"
                                step="0.1"
                                min={((trimRange.start + 0.1) / 100) * videoDuration}
                                max={videoDuration}
                                value={((trimRange.end / 100) * videoDuration).toFixed(1)}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && videoDuration > 0) {
                                    const percent = Math.min(Math.max(trimRange.start + 0.1, (val / videoDuration) * 100), 100);
                                    setTrimRange({ ...trimRange, end: percent });
                                    if (videoRef.current) videoRef.current.currentTime = val;
                                  }
                                }}
                                className="w-14 p-1 text-[10px] font-mono border border-[#141414]/10 rounded bg-[#141414]/5 outline-none text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                            <Type size={14} /> Text Overlay
                          </div>
                          <input 
                            type="text"
                            placeholder="Add viral text..."
                            value={textOverlay}
                            onChange={(e) => setTextOverlay(e.target.value)}
                            className="w-full p-3 bg-[#141414]/5 border border-transparent rounded-lg focus:border-[#141414] focus:bg-white outline-none transition-all text-sm"
                          />
                        </div>

                        {textOverlay && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4 pt-2 border-t border-[#141414]/5"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-mono uppercase text-[#141414]/40">
                                <span>Alignment</span>
                              </div>
                              <div className="flex gap-2">
                                {["left", "center", "right"].map((align) => (
                                  <button
                                    key={align}
                                    onClick={() => setTextAlignment(align as any)}
                                    className={cn(
                                      "flex-1 py-1.5 rounded-md text-[10px] font-mono uppercase border transition-all",
                                      textAlignment === align 
                                        ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                                        : "bg-white text-[#141414]/60 border-[#141414]/10 hover:border-[#141414]/40"
                                    )}
                                  >
                                    {align}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-mono uppercase text-[#141414]/40">
                                <span>Vertical Position</span>
                                <span>{textPosition}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="10" 
                                max="90" 
                                value={textPosition}
                                onChange={(e) => setTextPosition(parseInt(e.target.value))}
                                className="w-full accent-[#141414]"
                              />
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono uppercase text-[#141414]/40">Text Color & Style</span>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: "white", bg: "bg-[#141414]", label: "Dark Bg" },
                                  { id: "black", bg: "bg-[#E4E3E0]", label: "Light Bg" },
                                  { id: "yellow", bg: "bg-yellow-400", label: "Yellow" },
                                  { id: "red", bg: "bg-red-500", label: "Red" },
                                  { id: "blue", bg: "bg-blue-500", label: "Blue" },
                                ].map((color) => (
                                  <button 
                                    key={color.id}
                                    onClick={() => setTextColor(color.id)}
                                    title={color.label}
                                    className={cn(
                                      "w-8 h-8 rounded-full border border-[#141414]/10 flex items-center justify-center transition-all",
                                      color.bg,
                                      textColor === color.id && "ring-2 ring-offset-2 ring-[#141414]"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                          <Music size={14} /> Background Music
                        </div>
                        <div className="space-y-2">
                          {musicOptions.map((music) => (
                            <button
                              key={music.id}
                              onClick={() => setSelectedMusic(selectedMusic === music.url ? null : music.url)}
                              className={cn(
                                "w-full p-3 rounded-lg text-left text-xs font-medium border transition-all flex items-center justify-between",
                                selectedMusic === music.url 
                                  ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                                  : "bg-white text-[#141414]/60 border-[#141414]/10 hover:border-[#141414]/40"
                              )}
                            >
                              {music.name}
                              {selectedMusic === music.url && <div className="w-1.5 h-1.5 bg-[#E4E3E0] rounded-full animate-pulse" />}
                            </button>
                          ))}
                        </div>
                        {selectedMusic && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2 pt-2"
                          >
                            <div className="flex justify-between text-[10px] font-mono uppercase text-[#141414]/40">
                              <span>Volume</span>
                              <span>{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.01"
                              value={musicVolume}
                              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                              className="w-full accent-[#141414]"
                            />
                            <audio 
                              src={selectedMusic} 
                              autoPlay 
                              loop 
                              ref={(el) => { if (el) el.volume = musicVolume; }}
                              hidden={true} 
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <button 
                onClick={() => {
                  setStatus("idle");
                  setTrimRange({ start: 0, end: 100 });
                  setTextOverlay("");
                  setSelectedMusic(null);
                }}
                className="w-full py-3 border border-[#141414]/10 rounded-xl font-medium hover:bg-[#141414]/5 transition-colors text-sm"
              >
                Start New Generation
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="py-6 md:py-8 flex flex-col items-center justify-center space-y-4 md:space-y-6 text-center">
              <div className="p-3 md:p-4 bg-red-100 text-red-600 rounded-full">
                <AlertTriangle size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-lg md:text-xl font-serif italic font-medium text-red-600">Generation Failed</h3>
                <p className="text-xs md:text-sm text-[#141414]/60 max-w-[240px] md:max-w-xs mx-auto">{error}</p>
              </div>
              <button 
                onClick={() => setStatus("idle")}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SEOTools({ userPrefs }: { userPrefs: any }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<{ shortTail: string[], longTail: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("seo_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (term: string) => {
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("seo_history", JSON.stringify(newHistory));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    setShowHistory(false);
    addToHistory(keyword);
    try {
      // We'll use a direct Gemini call here for simplicity
      const ai = new (await import("@google/genai")).GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Generate 5 short-tail and 5 long-tail TikTok SEO keywords for "${keyword}" in the "${userPrefs.niche}" niche specifically for the Philippines (PH) market. Include popular Taglish or local slang if relevant.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: (await import("@google/genai")).Type.OBJECT,
            properties: {
              shortTail: { type: (await import("@google/genai")).Type.ARRAY, items: { type: (await import("@google/genai")).Type.STRING } },
              longTail: { type: (await import("@google/genai")).Type.ARRAY, items: { type: (await import("@google/genai")).Type.STRING } },
            },
            required: ["shortTail", "longTail"],
          },
        },
      });
      setResults(JSON.parse(response.text || "{}"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(h => h.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Search Optimization</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Keyword Intelligence.</h1>
      </header>

      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 relative">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Enter a seed keyword..." 
            className="w-full p-4 bg-white border border-[#141414]/10 rounded-xl focus:outline-none focus:border-[#141414] transition-all text-sm"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowHistory(true);
            }}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          <AnimatePresence>
            {showHistory && filteredHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#141414]/10 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {filteredHistory.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setKeyword(h);
                      setShowHistory(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#141414]/5 text-left transition-colors"
                  >
                    <History size={14} className="text-[#141414]/40" />
                    <span className="text-sm">{h}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          disabled={loading}
          className="px-8 py-4 sm:py-0 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
        >
          {loading ? "Generating..." : "Generate Keywords"}
        </button>
      </form>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-5 md:p-6 border border-[#141414]/10 rounded-xl space-y-3 md:space-y-4">
            <h3 className="font-serif italic text-base md:text-lg border-b border-[#141414]/5 pb-2">Short-Tail Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {results.shortTail.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-[#141414]/5 rounded-full text-xs md:text-sm font-medium">#{kw.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
          <div className="bg-white p-5 md:p-6 border border-[#141414]/10 rounded-xl space-y-3 md:space-y-4">
            <h3 className="font-serif italic text-base md:text-lg border-b border-[#141414]/5 pb-2">Long-Tail Keywords</h3>
            <div className="space-y-2">
              {results.longTail.map((kw, i) => (
                <div key={i} className="p-2.5 md:p-3 bg-[#141414]/5 rounded-lg text-xs md:text-sm flex items-center justify-between group cursor-pointer hover:bg-[#141414]/10 transition-colors">
                  <span>{kw}</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function OnboardingTour({ onComplete, onTabChange, activeTab }: { onComplete: () => void, onTabChange: (tab: Tab) => void, activeTab: Tab }) {
  const steps = [
    {
      tab: "dashboard",
      title: "Welcome to Affiliate Pro",
      content: "This is your command center. See trending niches and viral picks tailored to your preferences.",
      icon: LayoutDashboard
    },
    {
      tab: "products",
      title: "Product Intelligence",
      content: "Search for any product to get an AI-driven analysis of its GMV potential and competition level.",
      icon: Search
    },
    {
      tab: "viral",
      title: "Trend Intelligence",
      content: "Get real-time suggestions for products that are currently going viral in your niche.",
      icon: Sparkles
    },
    {
      tab: "scripts",
      title: "AI Script Lab",
      content: "Generate high-converting TikTok scripts with built-in compliance checks for community guidelines.",
      icon: FileText
    },
    {
      tab: "seo",
      title: "Keyword Intelligence",
      content: "Optimize your content with short-tail and long-tail keywords designed for the TikTok algorithm.",
      icon: BarChart3
    },
    {
      tab: "analytics",
      title: "Performance Lab",
      content: "Analyze existing TikTok videos to understand why they went viral and how to replicate their success.",
      icon: TrendingUp
    },
    {
      tab: "guidelines",
      title: "Compliance Center",
      content: "Stay safe from shadowbans by reviewing our categorized guide to TikTok's community standards.",
      icon: ShieldCheck
    },
    {
      tab: "settings",
      title: "Personalization",
      content: "Update your niche, target audience, and content styles to get better AI recommendations.",
      icon: SettingsIcon
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onTabChange(steps[nextStep].tab as Tab);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onTabChange(steps[prevStep].tab as Tab);
    }
  };

  const step = steps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#141414]/10"
      >
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-2.5 md:p-3 bg-[#141414] text-[#E4E3E0] rounded-xl">
              <step.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[#141414]/40">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-xl md:text-2xl font-serif italic font-medium">{step.title}</h3>
            <p className="text-xs md:text-sm text-[#141414]/70 leading-relaxed">
              {step.content}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === currentStep ? "w-8 bg-[#141414]" : "w-2 bg-[#141414]/10"
                )} 
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 md:pt-4">
            <button 
              onClick={onComplete}
              className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="p-2 md:p-3 border border-[#141414]/10 rounded-xl hover:bg-[#141414]/5 transition-colors"
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </button>
              )}
              <button 
                onClick={handleNext}
                className="px-5 md:px-6 py-2 md:py-3 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-xs md:text-sm"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next Step"}
                {currentStep !== steps.length - 1 && <ChevronRight size={14} className="md:w-[18px] md:h-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Dashboard({ trendingNiches, loading, userPrefs, onTabChange }: { trendingNiches: string[], loading: boolean, userPrefs: UserPreferences, onTabChange: (tab: Tab) => void }) {
  const [viralPicks, setViralPicks] = useState<ProductAnalysis[]>([]);
  const [loadingPicks, setLoadingPicks] = useState(false);

  useEffect(() => {
    const fetchPicks = async () => {
      setLoadingPicks(true);
      try {
        const audienceContext = `${userPrefs.targetAudience.ageRange} interested in ${userPrefs.targetAudience.interests.join(", ")}`;
        const picks = await getViralProductSuggestions(userPrefs.niche, audienceContext, 4);
        setViralPicks(picks.slice(0, 4)); // Show top 4 on dashboard
      } catch (err) {
        console.error("Failed to fetch viral picks", err);
      } finally {
        setLoadingPicks(false);
      }
    };
    fetchPicks();
  }, [userPrefs.niche]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">PH Market Overview</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Welcome back, PH Affiliate.</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-[#141414]/5 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-mono text-green-600 font-bold">Active Niche</span>
          </div>
          <div>
            <div className="text-sm text-[#141414]/60">Niche</div>
            <div className="text-xl font-medium">{userPrefs.niche}</div>
          </div>
        </div>
        <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-[#141414]/5 rounded-lg"><BarChart3 size={20} /></div>
            <span className="text-[10px] font-mono text-blue-600 font-bold">Demographics</span>
          </div>
          <div>
            <div className="text-sm text-[#141414]/60">Target Age</div>
            <div className="text-xl font-medium">{userPrefs.targetAudience.ageRange}</div>
          </div>
        </div>
        <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-[#141414]/5 rounded-lg"><ShieldCheck size={20} /></div>
            <span className="text-[10px] font-mono text-purple-600 font-bold">Content Style</span>
          </div>
          <div>
            <div className="text-sm text-[#141414]/60">Primary Style</div>
            <div className="text-xl font-medium">{userPrefs.contentStyles[0]}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif italic font-medium">PH Trending Niches</h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase animate-pulse">
                <div className="w-1 h-1 rounded-full bg-green-700" /> Live
              </span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/40">Real-time Web Data</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-[#141414]/5 animate-pulse rounded-xl" />
              ))
            ) : (
              trendingNiches.map((niche, i) => (
                <div key={i} className="bg-white p-4 border border-[#141414]/10 rounded-xl flex items-center justify-between hover:border-[#141414] transition-colors cursor-pointer group">
                  <span className="font-medium text-sm">{niche}</span>
                  <ArrowUpRight size={14} className="text-[#141414]/20 group-hover:text-[#141414] transition-colors" />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif italic font-medium">PH Viral Picks</h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase animate-pulse">
                <div className="w-1 h-1 rounded-full bg-green-700" /> Live
              </span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/40">For Your Niche</div>
            <button 
              onClick={() => onTabChange("viral")}
              className="text-[10px] font-mono uppercase tracking-widest text-[#141414] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={10} />
            </button>
          </div>
          <div className="space-y-4">
            {loadingPicks ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-[#141414]/5 animate-pulse rounded-xl" />
              ))
            ) : (
              viralPicks.map((pick, i) => (
                <div key={i} className="bg-white p-4 border border-[#141414]/10 rounded-xl flex items-center justify-between group hover:border-[#141414] transition-all">
                  <div className="space-y-1">
                    <div className="font-medium">{pick.name}</div>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-mono bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">{pick.gmvPotential} GMV</span>
                      <span className="text-[9px] font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">Score: {pick.trendingScore}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#141414]/5 rounded-lg group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-colors">
                    <Sparkles size={16} />
                  </div>
                </div>
              ))
            )}
            {!loadingPicks && viralPicks.length === 0 && (
              <div className="p-8 border-2 border-dashed border-[#141414]/10 rounded-xl text-center text-[#141414]/40 text-sm italic">
                No viral picks found for this niche yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ViralSuggestions({ userPrefs, onSave, onGenerateVideo }: { userPrefs: UserPreferences, onSave: (p: ProductAnalysis) => void, onGenerateVideo: (prompt: string) => void }) {
  const [suggestions, setSuggestions] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<"gmv" | "trending" | "competition">("trending");

  const fetchSuggestions = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const audienceContext = `${userPrefs.targetAudience.ageRange} interested in ${userPrefs.targetAudience.interests.join(", ")}`;
      // Fetch in batches of 20 to avoid token limits
      const data = await getViralProductSuggestions(userPrefs.niche, audienceContext, 20);
      if (isLoadMore) {
        setSuggestions(prev => [...prev, ...data]);
      } else {
        setSuggestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [userPrefs.niche]);

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (sortBy === "trending") return b.trendingScore - a.trendingScore;
    if (sortBy === "gmv") {
      const gmvMap = { "High": 3, "Medium": 2, "Low": 1 };
      return gmvMap[b.gmvPotential] - gmvMap[a.gmvPotential];
    }
    if (sortBy === "competition") {
      const compMap = { "Low": 3, "Medium": 2, "High": 1 };
      return compMap[b.competitionLevel] - compMap[a.competitionLevel];
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      <header className="space-y-1 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">PH Trend Intelligence</div>
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase animate-pulse">
              <div className="w-1 h-1 rounded-full bg-green-700" /> Live Feed
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">PH Viral Suggestions.</h1>
          <p className="text-xs text-[#141414]/60 mt-2 max-w-xl">
            Discover trending products in the Philippines with high GMV potential and low competition, specifically curated for Filipino TikTok Affiliates.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-mono uppercase tracking-widest p-2 bg-white border border-[#141414]/10 rounded-lg outline-none"
          >
            <option value="trending">Sort: Trending</option>
            <option value="gmv">Sort: GMV Potential</option>
            <option value="competition">Sort: Low Competition</option>
          </select>
          <button 
            onClick={fetchSuggestions}
            disabled={loading}
            className="w-fit px-4 py-2 border border-[#141414]/10 rounded-lg text-sm hover:bg-[#141414]/5 transition-colors flex items-center gap-2"
          >
            <TrendingUp size={16} /> Refresh Trends
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white border border-[#141414]/10 rounded-2xl animate-pulse" />
          ))
        ) : (
          sortedSuggestions.map((result, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#141414]/10 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-4 md:p-8 border-b border-[#141414]/5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl md:text-2xl font-serif italic font-medium">{result.name}</h3>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase shrink-0">Viral Potential</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#141414]/5 px-2 py-1 rounded uppercase tracking-wider">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] md:text-sm text-[#141414]/40 font-mono uppercase tracking-widest">Trending Score</div>
                    <div className="text-2xl md:text-4xl font-serif italic font-bold">{result.trendingScore}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => onSave(result)}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-[#141414]/10 rounded-lg text-xs md:text-sm hover:bg-[#141414]/5 transition-colors"
                    >
                      <Plus size={14} className="md:w-4 md:h-4" /> Save Analysis
                    </button>
                    <button 
                      onClick={() => onGenerateVideo(`Create a viral TikTok promotional video for ${result.name}. Style: ${userPrefs.contentStyles[0]}. Target: ${userPrefs.targetAudience.ageRange}. Focus on these keywords: ${result.keywords.join(", ")}`)}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#141414] text-[#E4E3E0] rounded-lg text-xs md:text-sm hover:opacity-90 transition-opacity"
                    >
                      <Video size={14} className="md:w-4 md:h-4" /> Generate Video
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">GMV Potential</div>
                    <div className={cn(
                      "text-base md:text-lg font-medium",
                      result.gmvPotential === "High" ? "text-green-600" : result.gmvPotential === "Medium" ? "text-blue-600" : "text-gray-600"
                    )}>{result.gmvPotential}</div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Competition Level</div>
                    <div className={cn(
                      "text-base md:text-lg font-medium",
                      result.competitionLevel === "Low" ? "text-green-600" : result.competitionLevel === "Medium" ? "text-yellow-600" : "text-red-600"
                    )}>{result.competitionLevel}</div>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Viral Strategy</div>
                  <p className="text-xs md:text-sm leading-relaxed text-[#141414]/80">{result.reasoning}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {suggestions.length > 0 && suggestions.length < 100 && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => fetchSuggestions(true)}
            disabled={loadingMore}
            className="px-8 py-4 bg-white border border-[#141414]/10 rounded-2xl font-medium hover:border-[#141414] transition-all flex items-center gap-3 shadow-sm disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Finding More Viral Picks...
              </>
            ) : (
              <>
                <Plus size={20} />
                Load More Viral Picks ({suggestions.length}/100)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function ProductFinder({ userPrefs, onSave }: { userPrefs: UserPreferences, onSave: (p: ProductAnalysis) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortBy, setSortBy] = useState<"gmv" | "trending" | "competition">("trending");

  useEffect(() => {
    const saved = localStorage.getItem("product_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (term: string) => {
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("product_history", JSON.stringify(newHistory));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setShowHistory(false);
    addToHistory(query);
    try {
      const context = `Niche: ${userPrefs.niche}, Target Audience: ${userPrefs.targetAudience.ageRange} interested in ${userPrefs.targetAudience.interests.join(", ")}, Content Styles: ${userPrefs.contentStyles.join(", ")}`;
      const data = await analyzeProduct(query, context);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "trending") return b.trendingScore - a.trendingScore;
    if (sortBy === "gmv") {
      const gmvMap = { "High": 3, "Medium": 2, "Low": 1 };
      return gmvMap[b.gmvPotential] - gmvMap[a.gmvPotential];
    }
    if (sortBy === "competition") {
      const compMap = { "Low": 3, "Medium": 2, "High": 1 };
      return compMap[b.competitionLevel] - compMap[a.competitionLevel];
    }
    return 0;
  });

  const filteredHistory = history.filter(h => h.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="space-y-1 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">PH Product Intelligence</div>
          <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Find PH High-GMV Products.</h1>
        </div>
        {results.length > 0 && (
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-mono uppercase tracking-widest p-2 bg-white border border-[#141414]/10 rounded-lg outline-none w-full md:w-auto"
          >
            <option value="trending">Sort: Trending</option>
            <option value="gmv">Sort: GMV Potential</option>
            <option value="competition">Sort: Low Competition</option>
          </select>
        )}
      </header>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 relative">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]/40" size={20} />
          <input 
            type="text" 
            placeholder="Search for a product or category..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#141414]/10 rounded-xl focus:outline-none focus:border-[#141414] transition-all"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowHistory(true);
            }}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          <AnimatePresence>
            {showHistory && filteredHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#141414]/10 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {filteredHistory.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(h);
                      setShowHistory(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#141414]/5 text-left transition-colors"
                  >
                    <Clock size={14} className="text-[#141414]/40" />
                    <span className="text-sm">{h}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          disabled={loading}
          className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white border border-[#141414]/10 rounded-2xl animate-pulse" />
          ))
        ) : (
          sortedResults.map((result, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#141414]/10 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-4 md:p-8 border-b border-[#141414]/5 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif italic font-medium">{result.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#141414]/5 px-2 py-1 rounded uppercase tracking-wider">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] md:text-sm text-[#141414]/40 font-mono uppercase tracking-widest">Trending Score</div>
                    <div className="text-2xl md:text-4xl font-serif italic font-bold">{result.trendingScore}</div>
                  </div>
                  <button 
                    onClick={() => onSave(result)}
                    className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-[#141414]/10 rounded-lg text-xs md:text-sm hover:bg-[#141414]/5 transition-colors"
                  >
                    <Plus size={14} className="md:w-4 md:h-4" /> Save Analysis
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">GMV Potential</div>
                    <div className={cn(
                      "text-base md:text-lg font-medium",
                      result.gmvPotential === "High" ? "text-green-600" : result.gmvPotential === "Medium" ? "text-blue-600" : "text-gray-600"
                    )}>{result.gmvPotential}</div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Competition Level</div>
                    <div className={cn(
                      "text-base md:text-lg font-medium",
                      result.competitionLevel === "Low" ? "text-green-600" : result.competitionLevel === "Medium" ? "text-yellow-600" : "text-red-600"
                    )}>{result.competitionLevel}</div>
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">AI Analysis</div>
                  <p className="text-xs md:text-sm leading-relaxed text-[#141414]/80">{result.reasoning}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function ScriptLab({ userPrefs, onSave, onGenerateVideo }: { userPrefs: UserPreferences, onSave: (s: ScriptSuggestion) => void, onGenerateVideo: (prompt: string) => void }) {
  const [product, setProduct] = useState("");
  const [script, setScript] = useState<ScriptSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    try {
      const audienceContext = `${userPrefs.targetAudience.ageRange} interested in ${userPrefs.targetAudience.interests.join(", ")}. Preferred styles: ${userPrefs.contentStyles.join(", ")}`;
      const data = await generateScript(product, audienceContext);
      setScript(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Content Studio</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">AI Script Lab.</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
            <h3 className="font-medium">Script Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#141414]/40">Product Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-[#141414]/5 border border-transparent rounded-lg focus:border-[#141414] focus:bg-white outline-none transition-all"
                  placeholder="e.g. Portable Blender"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#141414]/40">Target Audience</label>
                <div className="p-3 bg-[#141414]/5 rounded-lg text-sm">
                  {userPrefs.targetAudience.ageRange} • {userPrefs.targetAudience.interests.join(", ")}
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-[#141414] text-[#E4E3E0] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Generating..." : <><Sparkles size={18} /> Generate Script</>}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {script ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 border border-[#141414]/10 rounded-2xl space-y-8 relative">
                <button 
                  onClick={() => onSave(script)}
                  className="absolute top-8 right-8 p-2 hover:bg-[#141414]/5 rounded-lg transition-colors"
                  title="Save Script"
                >
                  <Plus size={20} />
                </button>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> The Hook
                  </div>
                  <p className="text-xl font-serif italic leading-relaxed">"{script.hook}"</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> The Body
                  </div>
                  <p className="text-lg leading-relaxed text-[#141414]/80">{script.body}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> The CTA
                  </div>
                  <p className="text-lg font-medium">{script.cta}</p>
                </div>
                <div className="pt-6 border-t border-[#141414]/5">
                  <button 
                    onClick={() => onGenerateVideo(`Create a TikTok video based on this script for ${product}. Hook: ${script.hook}. Body: ${script.body}. CTA: ${script.cta}. Style: ${userPrefs.contentStyles[0]}`)}
                    className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg shadow-[#141414]/10"
                  >
                    <Video size={20} /> Generate Video from Script
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                    <ShieldCheck size={16} /> Compliance Check
                  </div>
                  {script.violationCheck.isSafe ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 size={18} /> Safe for TikTok
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600 font-medium">
                        <AlertTriangle size={18} /> Potential Violations
                      </div>
                      <ul className="text-xs space-y-1 text-red-600/80">
                        {script.violationCheck.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 border border-[#141414]/10 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/40">
                    <TrendingUp size={16} /> SEO Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {script.seoKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#141414]/5 px-2 py-1 rounded uppercase tracking-wider">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-[#141414]/10 rounded-2xl flex flex-col items-center justify-center text-[#141414]/20 space-y-4">
              <FileText size={48} strokeWidth={1} />
              <p className="font-serif italic text-lg">Your script will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommunityGuidelines() {
  const guidelines = [
    {
      category: "Medical & Health Claims",
      status: "Critical",
      description: "TikTok strictly prohibits misleading medical advice or claims that a product can cure, treat, or prevent diseases.",
      examples: [
        "Claiming a supplement 'cures diabetes'",
        "Suggesting a beauty product has 'permanent' medical effects",
        "Promoting 'weight loss' products without proper disclaimers"
      ],
      tips: "Focus on cosmetic benefits or general wellness rather than medical results."
    },
    {
      category: "Misleading Content",
      status: "High",
      description: "Content that deceives users about the functionality, price, or origin of a product.",
      examples: [
        "Using filters to exaggerate product results",
        "Fake 'limited time' countdowns that never end",
        "Misrepresenting shipping times or hidden costs"
      ],
      tips: "Be transparent about results and use realistic demonstrations."
    },
    {
      category: "Minor Safety",
      status: "Critical",
      description: "Strict rules regarding content that features minors or targets them with inappropriate products.",
      examples: [
        "Promoting age-restricted products to minors",
        "Featuring children in promotional content without clear context",
        "Encouraging dangerous challenges or behavior"
      ],
      tips: "Ensure your target audience is set correctly and avoid using children in ads."
    },
    {
      category: "Intellectual Property",
      status: "Medium",
      description: "Using copyrighted music, logos, or brand names without authorization.",
      examples: [
        "Using non-commercial music in an affiliate video",
        "Showing competitor logos in a negative light",
        "Selling counterfeit or 'dupe' products as originals"
      ],
      tips: "Always use the TikTok Commercial Music Library for affiliate content."
    }
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Compliance Center</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Community Guidelines.</h1>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {guidelines.map((g, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#141414]/10 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-[#141414]/5 flex items-center justify-between">
              <h3 className="text-xl font-serif italic font-medium">{g.category}</h3>
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                g.status === "Critical" ? "bg-red-100 text-red-600" : 
                g.status === "High" ? "bg-orange-100 text-orange-600" : 
                "bg-blue-100 text-blue-600"
              )}>
                {g.status} Priority
              </span>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-[#141414]/70 leading-relaxed">{g.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-red-500/60">Common Violations</div>
                  <ul className="space-y-2">
                    {g.examples.map((ex, j) => (
                      <li key={j} className="flex gap-2 text-xs text-[#141414]/80">
                        <X size={14} className="text-red-500 shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-green-500/60">AI Recommendations</div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800 leading-relaxed">
                    <div className="font-bold mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Pro Tip:
                    </div>
                    {g.tips}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-40">
          <AlertTriangle size={16} /> Disclaimer
        </div>
        <p className="text-sm opacity-60 leading-relaxed">
          These guidelines are based on current TikTok Shop policies and are provided for educational purposes only. TikTok's algorithms and human moderators may change enforcement patterns at any time. Always refer to the official TikTok Business Center for the most up-to-date policy information.
        </p>
      </div>
    </div>
  );
}

function VideoAnalytics() {
  const [url, setUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<(VideoAnalysis & { url: string, timestamp: number, filePreview?: string })[]>([]);
  const [sortBy, setSortBy] = useState<"views" | "likes" | "shares" | "timestamp">("timestamp");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [keywordFilter, setKeywordFilter] = useState<string>("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("video_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedResults = localStorage.getItem("video_analyses");
    if (savedResults) setSavedAnalyses(JSON.parse(savedResults));
  }, []);

  const addToHistory = (term: string) => {
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("video_history", JSON.stringify(newHistory));
  };

  const saveAnalysis = (data: VideoAnalysis, videoUrl: string, preview?: string) => {
    const newAnalysis = { ...data, url: videoUrl, timestamp: Date.now(), filePreview: preview };
    const updated = [newAnalysis, ...savedAnalyses];
    setSavedAnalyses(updated);
    localStorage.setItem("video_analyses", JSON.stringify(updated));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUrl(""); // Clear URL when file is uploaded
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !uploadedFile) return;
    setLoading(true);
    setShowHistory(false);
    
    try {
      let result: VideoAnalysis;
      if (uploadedFile && filePreview) {
        const base64 = filePreview.split(',')[1];
        result = await analyzeUploadedVideo(base64, uploadedFile.type);
        setAnalysis(result);
        saveAnalysis(result, uploadedFile.name, filePreview);
      } else {
        addToHistory(url);
        result = await analyzeVideo(url);
        setAnalysis(result);
        saveAnalysis(result, url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseMetric = (val: string): number => {
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    if (val.toLowerCase().includes('k')) return num * 1000;
    if (val.toLowerCase().includes('m')) return num * 1000000;
    if (val.toLowerCase().includes('b')) return num * 1000000000;
    return num;
  };

  const filteredAnalyses = savedAnalyses.filter(a => {
    // Date filter
    if (dateFilter !== "all") {
      const now = Date.now();
      const diff = now - a.timestamp;
      if (dateFilter === "today" && diff >= 24 * 60 * 60 * 1000) return false;
      if (dateFilter === "week" && diff >= 7 * 24 * 60 * 60 * 1000) return false;
      if (dateFilter === "month" && diff >= 30 * 24 * 60 * 60 * 1000) return false;
    }

    // Niche filter
    if (nicheFilter !== "all" && a.factors.niche !== nicheFilter) return false;

    // Keyword filter
    if (keywordFilter) {
      const search = keywordFilter.toLowerCase();
      const matchesKeyword = a.factors.keywords.some(k => k.toLowerCase().includes(search));
      const matchesNiche = a.factors.niche?.toLowerCase().includes(search);
      const matchesUrl = a.url.toLowerCase().includes(search);
      if (!matchesKeyword && !matchesNiche && !matchesUrl) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "timestamp") return b.timestamp - a.timestamp;
    const valA = parseMetric(a.metrics[sortBy as keyof typeof a.metrics]);
    const valB = parseMetric(b.metrics[sortBy as keyof typeof b.metrics]);
    return valB - valA;
  });

  const niches = Array.from(new Set(savedAnalyses.map(a => a.factors.niche).filter(Boolean)));

  const filteredHistory = history.filter(h => h.toLowerCase().includes(url.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Performance Lab</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Video Analytics.</h1>
      </header>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 relative">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Paste TikTok video URL here..." 
              className="w-full p-4 bg-white border border-[#141414]/10 rounded-xl focus:outline-none focus:border-[#141414] transition-all text-sm pr-12"
              value={url}
              disabled={!!uploadedFile}
              onChange={(e) => {
                setUrl(e.target.value);
                setShowHistory(true);
              }}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <label className={cn(
                "cursor-pointer p-2 rounded-lg transition-colors",
                uploadedFile ? "text-blue-600 bg-blue-50" : "text-[#141414]/40 hover:bg-[#141414]/5"
              )}>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Upload size={18} />
              </label>
            </div>
            <AnimatePresence>
              {showHistory && filteredHistory.length > 0 && !uploadedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#141414]/10 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  {filteredHistory.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setUrl(h);
                        setShowHistory(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[#141414]/5 text-left transition-colors"
                    >
                      <History size={14} className="text-[#141414]/40" />
                      <span className="text-sm truncate">{h}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            disabled={loading || (!url && !uploadedFile)}
            className="px-8 py-4 sm:py-0 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {loading ? "Analyzing..." : "Analyze Video"}
          </button>
        </div>

        {uploadedFile && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FileVideo size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-blue-900 truncate">{uploadedFile.name}</div>
              <div className="text-[10px] text-blue-600">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button 
              type="button"
              onClick={() => {
                setUploadedFile(null);
                setFilePreview(null);
              }}
              className="p-1.5 hover:bg-blue-200 rounded-lg text-blue-600 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </form>

      {analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Object.entries(analysis.metrics).map(([key, value]) => (
              <div key={key} className="bg-white p-4 md:p-6 border border-[#141414]/10 rounded-xl">
                <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[#141414]/40 mb-1">{key}</div>
                <div className="text-xl md:text-2xl font-serif italic font-bold">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 border border-[#141414]/10 rounded-2xl space-y-4 md:space-y-6">
              <h3 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Key Performance Factors</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#141414]/5">
                  <span className="text-xs md:text-sm">Primary Niche</span>
                  <span className="font-serif italic font-medium text-sm md:text-base">{analysis.factors.niche}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#141414]/5">
                  <span className="text-xs md:text-sm">Video Length</span>
                  <span className="font-mono text-xs md:text-sm">{analysis.factors.videoLength}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#141414]/5">
                  <span className="text-xs md:text-sm">Audio Trend</span>
                  <span className={cn(
                    "text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase",
                    analysis.factors.audioTrend === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>{analysis.factors.audioTrend}</span>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <span className="text-xs md:text-sm block">Hook Strength</span>
                  <div className="h-1.5 md:h-2 bg-[#141414]/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#141414]" style={{ width: `${analysis.factors.hookStrength * 10}%` }} />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2 pt-2">
                  <span className="text-xs md:text-sm block">Detected Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.factors.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] md:text-[10px] font-mono bg-[#141414]/5 px-2 py-1 rounded uppercase tracking-wider">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] text-[#E4E3E0] p-6 md:p-8 rounded-2xl space-y-4 md:space-y-6">
              <h3 className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-40">Actionable Tips</h3>
              <div className="space-y-4 md:space-y-6">
                {analysis.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 md:gap-4">
                    <span className="text-xl md:text-2xl font-serif italic opacity-20">0{i + 1}</span>
                    <p className="text-xs md:text-sm leading-relaxed opacity-80">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {savedAnalyses.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-[#141414]/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-serif italic font-medium">Analysis Dashboard.</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#141414]/40" />
                <input 
                  type="text"
                  placeholder="Filter by keyword..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-[#141414]/10 rounded-lg text-xs outline-none focus:border-[#141414] transition-all min-w-[200px]"
                />
              </div>
              <select 
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="text-xs font-mono uppercase tracking-widest p-2 bg-white border border-[#141414]/10 rounded-lg outline-none"
              >
                <option value="all">All Niches</option>
                {niches.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="text-xs font-mono uppercase tracking-widest p-2 bg-white border border-[#141414]/10 rounded-lg outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-mono uppercase tracking-widest p-2 bg-white border border-[#141414]/10 rounded-lg outline-none"
              >
                <option value="timestamp">Newest First</option>
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
                <option value="shares">Most Shares</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAnalyses.map((a, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 border border-[#141414]/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#141414] transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {a.filePreview ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#141414]/5 flex-shrink-0 border border-[#141414]/5">
                      <video src={a.filePreview} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#141414]/5 flex items-center justify-center flex-shrink-0 border border-[#141414]/5 text-[#141414]/20">
                      <Video size={24} />
                    </div>
                  )}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/40">
                        {new Date(a.timestamp).toLocaleDateString()}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-[#141414]/20" />
                      <div className="text-[10px] font-mono text-blue-600 font-bold uppercase">
                        {a.factors.niche}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-[#141414]/60 truncate max-w-[300px]">
                      {a.url}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {a.factors.keywords.slice(0, 3).map((kw, j) => (
                        <span key={j} className="text-[9px] font-mono bg-[#141414]/5 px-1.5 py-0.5 rounded uppercase">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-[#141414]/40">Views</div>
                    <div className="font-serif italic font-bold">{a.metrics.views}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-[#141414]/40">Likes</div>
                    <div className="font-serif italic font-bold">{a.metrics.likes}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-[#141414]/40">Shares</div>
                    <div className="font-serif italic font-bold">{a.metrics.shares}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysis(a)}
                  className="p-2 bg-[#141414]/5 rounded-lg group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
            {filteredAnalyses.length === 0 && (
              <div className="p-12 border-2 border-dashed border-[#141414]/10 rounded-xl text-center text-[#141414]/40 italic">
                No analyses found for the selected filters.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function SavedItems({ products, scripts }: { products: ProductAnalysis[], scripts: ScriptSuggestion[] }) {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Archive</div>
        <h1 className="text-2xl md:text-4xl font-serif italic font-medium tracking-tight">Saved Intelligence.</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-serif italic font-medium">Products</h2>
          {products.length === 0 ? (
            <div className="p-6 md:p-8 border-2 border-dashed border-[#141414]/10 rounded-xl text-center text-[#141414]/40 text-sm">No saved products yet.</div>
          ) : (
            products.map((p, i) => (
              <div key={i} className="bg-white p-4 md:p-6 border border-[#141414]/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-sm md:text-base">{p.name}</h3>
                  <span className="text-[9px] md:text-[10px] font-mono bg-green-100 text-green-700 px-2 py-1 rounded uppercase shrink-0">{p.gmvPotential} GMV</span>
                </div>
                <p className="text-[11px] md:text-xs text-[#141414]/60 line-clamp-2">{p.reasoning}</p>
              </div>
            ))
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-serif italic font-medium">Scripts</h2>
          {scripts.length === 0 ? (
            <div className="p-6 md:p-8 border-2 border-dashed border-[#141414]/10 rounded-xl text-center text-[#141414]/40 text-sm">No saved scripts yet.</div>
          ) : (
            scripts.map((s, i) => (
              <div key={i} className="bg-white p-4 md:p-6 border border-[#141414]/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium italic text-sm md:text-base truncate">"{s.hook}"</h3>
                  {s.violationCheck.isSafe ? <CheckCircle2 size={14} className="text-green-600 shrink-0" /> : <AlertTriangle size={14} className="text-red-600 shrink-0" />}
                </div>
                <p className="text-[11px] md:text-xs text-[#141414]/60 line-clamp-2">{s.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Settings({ userPrefs, setUserPrefs }: { userPrefs: UserPreferences, setUserPrefs: any }) {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/40">Configuration</div>
        <h1 className="text-4xl font-serif italic font-medium tracking-tight">Personalization.</h1>
      </header>

      <div className="bg-white border border-[#141414]/10 rounded-2xl p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Primary Niche</label>
              <select 
                value={userPrefs.niche}
                onChange={(e) => setUserPrefs({ ...userPrefs, niche: e.target.value })}
                className="w-full p-3 bg-[#141414]/5 border border-transparent rounded-lg focus:border-[#141414] focus:bg-white outline-none transition-all text-sm"
              >
                <option>Beauty & Personal Care</option>
                <option>Home & Kitchen</option>
                <option>Electronics</option>
                <option>Fashion & Accessories</option>
                <option>Health & Wellness</option>
                <option>Toys & Hobbies</option>
              </select>
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Target Age Range</label>
              <select 
                value={userPrefs.targetAudience.ageRange}
                onChange={(e) => setUserPrefs({ ...userPrefs, targetAudience: { ...userPrefs.targetAudience, ageRange: e.target.value } })}
                className="w-full p-3 bg-[#141414]/5 border border-transparent rounded-lg focus:border-[#141414] focus:bg-white outline-none transition-all text-sm"
              >
                <option>Under 18</option>
                <option>18-24</option>
                <option>25-34</option>
                <option>35-44</option>
                <option>45+</option>
              </select>
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Audience Interests</label>
              <input 
                type="text" 
                value={userPrefs.targetAudience.interests.join(", ")}
                onChange={(e) => setUserPrefs({ ...userPrefs, targetAudience: { ...userPrefs.targetAudience, interests: e.target.value.split(",").map(s => s.trim()) } })}
                className="w-full p-3 bg-[#141414]/5 border border-transparent rounded-lg focus:border-[#141414] focus:bg-white outline-none transition-all text-sm"
                placeholder="e.g. Gaming, Fitness, Cooking"
              />
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Video Content Styles</label>
              <div className="grid grid-cols-2 gap-2">
                {["Reviews", "Tutorials", "Unboxing", "Vlogs", "ASMR", "Comedy"].map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      const styles = userPrefs.contentStyles.includes(style)
                        ? userPrefs.contentStyles.filter(s => s !== style)
                        : [...userPrefs.contentStyles, style];
                      setUserPrefs({ ...userPrefs, contentStyles: styles });
                    }}
                    className={cn(
                      "py-2 px-3 rounded-lg text-[10px] md:text-xs font-medium border transition-all",
                      userPrefs.contentStyles.includes(style)
                        ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                        : "bg-white text-[#141414]/60 border-[#141414]/10 hover:border-[#141414]/40"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#141414]/40">Experience Level</label>
              <div className="flex gap-2">
                {["Beginner", "Intermediate", "Expert"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setUserPrefs({ ...userPrefs, experienceLevel: level as any })}
                    className={cn(
                      "flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium border transition-all",
                      userPrefs.experienceLevel === level 
                        ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                        : "bg-white text-[#141414]/60 border-[#141414]/10 hover:border-[#141414]/40"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 md:pt-8 border-t border-[#141414]/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <button className="px-8 py-3 bg-[#141414] text-[#E4E3E0] rounded-xl font-medium hover:opacity-90 transition-opacity text-sm">
            Save Preferences
          </button>
          <button 
            onClick={() => alert("TikTok Shop Partner API connection requires a registered business account. In this beta, we use AI-driven intelligence to simulate real-time data.")}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#141414] rounded-xl font-medium hover:bg-[#141414] hover:text-[#E4E3E0] transition-all text-sm"
          >
            <Plus size={18} /> Connect TikTok Shop
          </button>
        </div>
      </div>
    </div>
  );
}
