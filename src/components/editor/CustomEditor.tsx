import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';
import {
  Type, MousePointerClick, Plus, Trash2, Maximize2, Minimize2,
  Smartphone, Laptop, Palette, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ChevronUp, ChevronDown, ChevronsUp, ChevronsDown,
  Undo2, Redo2, Copy, CopyPlus, Square, Circle, Triangle,
  Minus, Star, ImagePlus, Eye, EyeOff, Lock, Unlock,
  AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Search, Settings2,
  Link2, Link2Off, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Screen, CanvasElement, ShapeType } from '../../lib/types';
import { searchStickers, searchBackgrounds, type StickerProvider, type BackgroundProvider } from '../../lib/media';
import { useWizard } from '../../contexts/CreateWizardContext';
import { useHistory } from '../../hooks/useHistory';
import { AuroraBackground } from '../shared/AuroraBackground';
import { CupidLoader } from '../shared/CupidLoader';

interface Props {
  screens: Screen[];
  onChange: (screens: Screen[]) => void;
}

export const CustomEditor: React.FC<Props> = ({ screens, onChange }) => {
  const { state: wizardState, setTargetRatio, setSyncLayout } = useWizard();
  const targetRatio = wizardState.targetRatio;
  const syncLayout = wizardState.syncLayout;

  // History integration
  const { state: historyScreens, setState: setHistoryScreens, undo, redo, canUndo, canRedo } = useHistory<Screen[]>(screens);
  
  // Update parent when history changes
  useEffect(() => {
    if (historyScreens !== screens) {
      onChange(historyScreens);
    }
  }, [historyScreens]);

  const currentScreens = historyScreens;

  const [activeScreenId, setActiveScreenId] = useState<string>(currentScreens[0]?.id || '');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'stickers' | 'backgrounds'>('elements');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickers, setStickers] = useState<string[]>([]);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [isSearchingStickers, setIsSearchingStickers] = useState(false);
  const [isSearchingBg, setIsSearchingBg] = useState(false);
  
  const [stickerProvider, setStickerProvider] = useState<StickerProvider>('builtin');
  const [bgProvider, setBgProvider] = useState<BackgroundProvider>('builtin');

  // Load wizard data once on mount  
  const resizeStartFontSize = useRef<Record<string, number>>({});
  const resizeStartHeight = useRef<Record<string, number>>({});
  const lastTouchTime = useRef<Record<string, number>>({});
  const [mobileTab, setMobileTab] = useState<'tools' | 'canvas' | 'properties'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // New State for Advanced Features
  const [zoomLevel, setZoomLevel] = useState<number | 'auto'>('auto');
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    position: true, typography: true, appearance: true, layout: true, actions: true
  });

  const [workspaceSize, setWorkspaceSize] = useState({ width: 800, height: 600 });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        setWorkspaceSize({
          width: workspaceRef.current.clientWidth,
          height: workspaceRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen, mobileTab]);

  useEffect(() => {
    if (isFullscreen) document.documentElement.classList.add('editor-fullscreen');
    else document.documentElement.classList.remove('editor-fullscreen');
    return () => document.documentElement.classList.remove('editor-fullscreen');
  }, [isFullscreen]);

  useEffect(() => {
    if (!activeScreenId && currentScreens.length > 0) {
      setActiveScreenId(currentScreens[0].id);
    }
  }, [currentScreens, activeScreenId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'stickers') {
        setIsSearchingStickers(true);
        searchStickers(searchQuery, stickerProvider)
          .then(setStickers)
          .finally(() => setIsSearchingStickers(false));
      } else if (activeTab === 'backgrounds') {
        setIsSearchingBg(true);
        searchBackgrounds(searchQuery, bgProvider)
          .then(setBackgrounds)
          .finally(() => setIsSearchingBg(false));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, stickerProvider, bgProvider]);

  const activeScreen = currentScreens.find(s => s.id === activeScreenId);
  const selectedElement = activeScreen?.elements.find(e => e.id === selectedElementId);

  const updateScreen = useCallback((updatedScreen: Screen) => {
    setHistoryScreens(currentScreens.map(s => s.id === updatedScreen.id ? updatedScreen : s));
  }, [currentScreens, setHistoryScreens]);

  const addScreen = () => {
    const newScreen: Screen = { id: uuidv4(), name: `Screen ${currentScreens.length + 1}`, elements: [] };
    setHistoryScreens([...currentScreens, newScreen]);
    setActiveScreenId(newScreen.id);
  };

  const duplicateScreen = (id: string) => {
    const screenToDup = currentScreens.find(s => s.id === id);
    if (!screenToDup) return;
    const newScreen: Screen = {
      ...screenToDup,
      id: uuidv4(),
      name: `${screenToDup.name} (Copy)`,
      elements: screenToDup.elements.map(e => ({ ...e, id: uuidv4() }))
    };
    setHistoryScreens([...currentScreens, newScreen]);
    setActiveScreenId(newScreen.id);
  };

  const removeScreen = (id: string) => {
    if (currentScreens.length === 1) return;
    const newScreens = currentScreens.filter(s => s.id !== id);
    setHistoryScreens(newScreens);
    if (activeScreenId === id) setActiveScreenId(newScreens[0].id);
  };

  const addElement = (element: Partial<CanvasElement>) => {
    if (!activeScreen) return;
    const baseWidth = 360;
    const baseHeight = 640;
    
    let w = element.width || 50;
    let h = element.height || 15;
    let x = element.x ?? 10;
    let y = element.y ?? 10;

    if (!element.isNormalized) {
      w = (w / baseWidth) * 100;
      h = (h / baseHeight) * 100;
      x = (x / baseWidth) * 100;
      y = (y / baseHeight) * 100;
    }

    const newElement: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x, y, width: w, height: h,
      rotation: 0,
      opacity: 1,
      zIndex: activeScreen.elements.length + 1,
      name: `${element.type || 'text'} ${activeScreen.elements.length + 1}`,
      isNormalized: true,
      config: {},
      visible: true,
      ...element
    };

    updateScreen({ ...activeScreen, elements: [...activeScreen.elements, newElement] });
    setSelectedElementId(newElement.id);
  };

  const duplicateElement = useCallback(() => {
    if (!activeScreen || !selectedElement) return;
    const newElement = {
      ...selectedElement,
      id: uuidv4(),
      x: Math.min(selectedElement.x + 2, 90),
      y: Math.min(selectedElement.y + 2, 90),
      zIndex: activeScreen.elements.length + 1,
      name: `${selectedElement.name || selectedElement.type} (Copy)`
    };
    updateScreen({ ...activeScreen, elements: [...activeScreen.elements, newElement] });
    setSelectedElementId(newElement.id);
  }, [activeScreen, selectedElement, updateScreen]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    if (!activeScreen) return;
    updateScreen({
      ...activeScreen,
      elements: activeScreen.elements.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  }, [activeScreen, updateScreen]);

  const removeElement = useCallback((id: string) => {
    if (!activeScreen) return;
    updateScreen({
      ...activeScreen,
      elements: activeScreen.elements.filter(e => e.id !== id)
    });
    if (selectedElementId === id) setSelectedElementId(null);
  }, [activeScreen, selectedElementId, updateScreen]);

  const handleSpatialUpdate = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const el = activeScreen?.elements.find(e => e.id === id);
    if (!el) return;
    
    const { x, y, width, height, ...restUpdates } = updates;
    const cleanSpatial: any = {};
    if (x !== undefined) cleanSpatial.x = x;
    if (y !== undefined) cleanSpatial.y = y;
    if (width !== undefined) cleanSpatial.width = width;
    if (height !== undefined) cleanSpatial.height = height;

    if (syncLayout) {
      updateElement(id, { ...cleanSpatial, ...restUpdates, mobileOverrides: undefined });
    } else if (targetRatio === 'mobile') {
      const currentOverrides = el.mobileOverrides || { x: el.x, y: el.y, width: el.width, height: el.height };
      updateElement(id, { mobileOverrides: { ...currentOverrides, ...cleanSpatial }, ...restUpdates });
    } else {
      updateElement(id, { ...cleanSpatial, ...restUpdates });
    }
  }, [activeScreen, syncLayout, targetRatio, updateElement]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      
      if (e.key === 'Escape') {
        setSelectedElementId(null);
        setEditingElementId(null);
        return;
      }
      
      if (isInput) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !editingElementId) {
        e.preventDefault();
        removeElement(selectedElementId);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo(); else undo();
        }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 'd' && selectedElementId) { e.preventDefault(); duplicateElement(); }
      }
      
      if (selectedElementId && !editingElementId && e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 0.2 : 1;
        const activeX = !syncLayout && targetRatio === 'mobile' && selectedElement?.mobileOverrides ? selectedElement.mobileOverrides.x : selectedElement!.x;
        const activeY = !syncLayout && targetRatio === 'mobile' && selectedElement?.mobileOverrides ? selectedElement.mobileOverrides.y : selectedElement!.y;
        
        if (e.key === 'ArrowUp') handleSpatialUpdate(selectedElementId, { y: activeY - step });
        if (e.key === 'ArrowDown') handleSpatialUpdate(selectedElementId, { y: activeY + step });
        if (e.key === 'ArrowLeft') handleSpatialUpdate(selectedElementId, { x: activeX - step });
        if (e.key === 'ArrowRight') handleSpatialUpdate(selectedElementId, { x: activeX + step });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingElementId, removeElement, undo, redo, duplicateElement, updateElement, selectedElement]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        addElement({
          type: 'image',
          config: { src: ev.target.result as string },
          width: 50, height: 30
        });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInlineEditComplete = () => {
    if (editingElementId && editInputRef.current) {
      const text = editInputRef.current.value;
      const el = activeScreen?.elements.find(e => e.id === editingElementId);
      if (el) {
        updateElement(editingElementId, { config: { ...el.config, text } });
      }
    }
    setEditingElementId(null);
  };

  const canvasWidth = targetRatio === 'laptop' ? 1024 : 360;
  const canvasHeight = targetRatio === 'laptop' ? 576 : 640;
  const pad = 80;
  const autoScaleX = (workspaceSize.width - pad) / canvasWidth;
  const autoScaleY = (workspaceSize.height - pad) / canvasHeight;
  const autoScale = Math.max(0.15, Math.min(autoScaleX, autoScaleY, 1.2));
  const scale = zoomLevel === 'auto' ? autoScale : zoomLevel;

  const toggleSection = (section: string) => setExpandedSections(p => ({ ...p, [section]: !p[section] }));

  if (!activeScreen) return null;

  return (
    <div className={cn(
      "flex flex-col bg-[#0f0f1a] overflow-hidden text-sm transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-[9999] rounded-none border-none" : "h-[85vh] md:h-[calc(100vh-120px)] rounded-2xl border border-white/10 relative"
    )}>
      {/* HEADER */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-black/40">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <h2 className="font-semibold text-white hidden sm:block">Design Editor</h2>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="flex gap-1">
            <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"><Undo2 className="w-4 h-4" /></button>
            <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"><Redo2 className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/10">
            <button onClick={() => setZoomLevel(z => z === 'auto' ? autoScale - 0.1 : Math.max(0.1, (z as number) - 0.1))} className="p-1 hover:bg-white/10 rounded text-gray-400"><Minus className="w-4 h-4" /></button>
            <span className="text-xs text-gray-400 font-mono w-10 text-center cursor-pointer" onClick={() => setZoomLevel('auto')}>{zoomLevel === 'auto' ? 'FIT' : `${Math.round(zoomLevel * 100)}%`}</span>
            <button onClick={() => setZoomLevel(z => z === 'auto' ? autoScale + 0.1 : Math.min(2, (z as number) + 0.1))} className="p-1 hover:bg-white/10 rounded text-gray-400"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
            <button onClick={() => setTargetRatio('mobile')} className={cn("p-1.5 rounded-md transition-all cursor-pointer", targetRatio === 'mobile' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => setTargetRatio('laptop')} className={cn("p-1.5 rounded-md transition-all cursor-pointer", targetRatio === 'laptop' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}><Laptop className="w-4 h-4" /></button>
          </div>
          <button
            onClick={() => setSyncLayout(!syncLayout)}
            className={cn(
              "p-1.5 rounded-lg border transition-all cursor-pointer",
              syncLayout
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                : "bg-orange-500/15 border-orange-500/30 text-orange-400"
            )}
            title={syncLayout ? 'Sync Mode: Changes apply to both layouts' : 'Independent Mode: Design separately for each layout'}
          >
            {syncLayout ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR */}
        <div className={cn("w-64 border-r border-white/10 flex flex-col bg-black/40", mobileTab !== 'tools' && "hidden md:flex absolute md:relative z-20 h-full")}>
          <div className="flex border-b border-white/10 shrink-0">
            {['elements', 'stickers', 'backgrounds'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn("flex-1 py-3 text-xs font-semibold capitalize cursor-pointer", activeTab === tab ? "text-pink-400 border-b-2 border-pink-400 bg-pink-500/5" : "text-gray-500 hover:text-white")}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'elements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Basic</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => addElement({ type: 'text', width: 80, height: 12, x: 10, y: 40, isNormalized: true, config: { text: 'Heading', fontSize: 28, fontWeight: 'bold' }})} className="p-3 border border-white/10 rounded-lg hover:border-pink-500/50 hover:bg-pink-500/5 text-gray-300 flex flex-col items-center gap-2 cursor-pointer transition-all"><Type className="w-5 h-5 text-pink-400" /><span>Text</span></button>
                    <button onClick={() => addElement({ type: 'button', width: 50, height: 10, x: 25, y: 45, isNormalized: true, config: { text: 'Button', variant: 'primary', fontSize: 16 }})} className="p-3 border border-white/10 rounded-lg hover:border-pink-500/50 hover:bg-pink-500/5 text-gray-300 flex flex-col items-center gap-2 cursor-pointer transition-all"><MousePointerClick className="w-5 h-5 text-pink-400" /><span>Button</span></button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 border border-white/10 rounded-lg hover:border-pink-500/50 hover:bg-pink-500/5 text-gray-300 flex flex-col items-center gap-2 cursor-pointer transition-all"><ImagePlus className="w-5 h-5 text-pink-400" /><span>Image</span></button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shapes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['rectangle', 'circle', 'triangle', 'line', 'star'] as ShapeType[]).map(shape => (
                      <button key={shape} onClick={() => addElement({ type: 'shape', config: { shapeType: shape, fill: '#ff3e6c' }, width: shape === 'line' ? 80 : 20, height: shape === 'line' ? 2 : 20 })} className="p-2 border border-white/10 rounded-lg hover:border-pink-500/50 hover:bg-pink-500/5 text-gray-300 flex justify-center items-center cursor-pointer transition-all" title={shape}>
                        {shape === 'rectangle' ? <Square className="w-5 h-5" /> : shape === 'circle' ? <Circle className="w-5 h-5" /> : shape === 'triangle' ? <Triangle className="w-5 h-5" /> : shape === 'line' ? <Minus className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Screens</h3>
                    <button onClick={addScreen} className="p-1 rounded hover:bg-white/10 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-1">
                    {currentScreens.map((s, i) => (
                      <div key={s.id} onClick={() => setActiveScreenId(s.id)} className={cn("flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group", activeScreenId === s.id ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" : "text-gray-400 hover:bg-white/5 border border-transparent")}>
                        <span className="text-sm truncate pr-2">{i + 1}. {s.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); duplicateScreen(s.id); }} className="p-1 rounded hover:bg-white/20 text-gray-400 hover:text-white" title="Duplicate Screen"><CopyPlus className="w-3.5 h-3.5" /></button>
                          {currentScreens.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); removeScreen(s.id); }} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400" title="Delete Screen"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Layers</h3>
                  <div className="space-y-1">
                    {[...(activeScreen?.elements || [])].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)).map((el) => (
                      <div key={el.id} onClick={() => setSelectedElementId(el.id)} className={cn("flex justify-between items-center px-2 py-1.5 rounded-lg cursor-pointer transition-colors group border", selectedElementId === el.id ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-transparent text-gray-400 hover:bg-white/5")}>
                        <div className="flex items-center gap-2 truncate">
                          {el.type === 'text' ? <Type className="w-3.5 h-3.5 shrink-0" /> : el.type === 'button' ? <MousePointerClick className="w-3.5 h-3.5 shrink-0" /> : el.type === 'image' || el.type === 'sticker' ? <ImagePlus className="w-3.5 h-3.5 shrink-0" /> : <Square className="w-3.5 h-3.5 shrink-0" />}
                          <span className="text-xs truncate">{el.name || el.type}</span>
                        </div>
                        <div className="flex gap-1 opacity-50 group-hover:opacity-100">
                          <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: el.visible !== false ? false : true }); }} className="p-1 hover:text-white">
                            {el.visible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }} className="p-1 hover:text-white">
                            {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                <select value={stickerProvider} onChange={(e) => setStickerProvider(e.target.value as StickerProvider)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50">
                  <option value="builtin">Built-in</option>
                  <option value="giphy">Giphy</option>
                  <option value="pixabay">Pixabay</option>
                  <option value="iconfinder">IconFinder</option>
                  <option value="openmoji">OpenMoji</option>
                  <option value="noto">Noto</option>
                  <option value="bootstrap">Bootstrap</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stickers..." className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50" />
                </div>
                {isSearchingStickers ? (
                  <div className="py-12">
                    <CupidLoader size="md" text="Finding perfect stickers..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {stickers.map((url, i) => (
                      <div key={i} onClick={() => addElement({ type: 'sticker', config: { src: url }, width: 30, height: 30 })} className="aspect-square bg-white/5 rounded-lg border border-white/5 hover:border-pink-500/50 p-2 cursor-pointer transition-all flex items-center justify-center group">
                        <img src={url} alt="Sticker" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'backgrounds' && (
              <div className="space-y-4">
                <select value={bgProvider} onChange={(e) => setBgProvider(e.target.value as BackgroundProvider)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50">
                  <option value="builtin">Built-in</option>
                  <option value="pexels">Pexels</option>
                  <option value="pixabay">Pixabay</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search backgrounds..." className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50" />
                </div>
                {isSearchingBg ? (
                  <div className="py-12">
                    <CupidLoader size="md" text="Finding perfect backgrounds..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateScreen({ ...activeScreen, background: undefined })} className="aspect-video bg-black rounded-lg border border-white/10 hover:border-pink-500/50 flex items-center justify-center text-xs text-gray-500 cursor-pointer">Clear</button>
                    {backgrounds.map((url, i) => (
                      <div key={i} onClick={() => updateScreen({ ...activeScreen, background: { type: 'image', value: url } })} className="aspect-video bg-white/5 rounded-lg border border-white/5 hover:border-pink-500/50 overflow-hidden cursor-pointer">
                        <img src={url} alt="Bg" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE (CANVAS) */}
        <div ref={workspaceRef} className={cn("flex-1 overflow-hidden flex items-center justify-center relative", mobileTab !== 'canvas' && "hidden md:flex", isFullscreen ? "bg-[#0a0a1a]" : "bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:20px_20px]")} onClick={() => { setSelectedElementId(null); setEditingElementId(null); }}>
          <div 
            className={`relative rounded-sm shadow-2xl overflow-hidden transition-all duration-300 theme-${wizardState.theme} bg-[var(--bg)] font-[var(--font-body)] text-[var(--text)] flex-shrink-0`}
            style={{ width: canvasWidth, height: canvasHeight, transform: `scale(${scale})`, transformOrigin: 'center center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              <AuroraBackground theme={wizardState.theme} />
            </div>
            {activeScreen.background?.type === 'color' && <div className="absolute inset-0 z-0" style={{ backgroundColor: activeScreen.background.value }} />}
            {activeScreen.background?.type === 'image' && <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${activeScreen.background.value})` }} />}
            
            {activeScreen.elements.filter(el => el.visible !== false).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((element) => {
              const isSelected = selectedElementId === element.id;
              const isEditing = editingElementId === element.id;
              
              const isMobileView = targetRatio === 'mobile';
              const useMobileOverride = isMobileView && !syncLayout && element.mobileOverrides;
              
              const activeX = useMobileOverride ? element.mobileOverrides!.x : element.x;
              const activeY = useMobileOverride ? element.mobileOverrides!.y : element.y;
              const activeW = useMobileOverride ? element.mobileOverrides!.width : element.width;
              const activeH = useMobileOverride ? element.mobileOverrides!.height : element.height;

              const absX = (activeX / 100) * canvasWidth;
              const absY = (activeY / 100) * canvasHeight;
              const absW = (activeW / 100) * canvasWidth;
              const absH = (activeH / 100) * canvasHeight;

              return (
                <Rnd
                  key={element.id}
                  position={{ x: absX, y: absY }}
                  size={{ width: absW, height: absH }}
                  onDragStart={() => setSelectedElementId(element.id)}
                  onDragStop={(_, d) => {
                    if (element.locked) return;
                    handleSpatialUpdate(element.id, { x: (d.x / canvasWidth) * 100, y: (d.y / canvasHeight) * 100 });
                  }}
                  onResizeStart={() => {
                    resizeStartFontSize.current[element.id] = element.config.fontSize || 16;
                    resizeStartHeight.current[element.id] = absH;
                  }}
                  onResize={(_, __, ref, ___, pos) => {
                    if (element.locked) return;
                    const newAbsH = ref.offsetHeight;
                    const startAbsH = resizeStartHeight.current[element.id];
                    const startFS = resizeStartFontSize.current[element.id];
                    
                    const newW = (ref.offsetWidth / canvasWidth) * 100;
                    const newH = (newAbsH / canvasHeight) * 100;
                    const newX = (pos.x / canvasWidth) * 100;
                    const newY = (pos.y / canvasHeight) * 100;
                    
                    let updates: Partial<CanvasElement> = { width: newW, height: newH, x: newX, y: newY };
                    if ((element.type === 'text' || element.type === 'button') && startAbsH && startFS) {
                      const ratio = newAbsH / startAbsH;
                      updates.config = { ...element.config, fontSize: Math.max(6, Math.round(startFS * ratio)) };
                    }
                    handleSpatialUpdate(element.id, updates);
                  }}
                  onResizeStop={(_, __, ref, ___, pos) => {
                    if (element.locked) return;
                    const newAbsH = ref.offsetHeight;
                    const startAbsH = resizeStartHeight.current[element.id];
                    const startFS = resizeStartFontSize.current[element.id];
                    
                    const newW = (ref.offsetWidth / canvasWidth) * 100;
                    const newH = (newAbsH / canvasHeight) * 100;
                    const newX = (pos.x / canvasWidth) * 100;
                    const newY = (pos.y / canvasHeight) * 100;
                    
                    let updates: Partial<CanvasElement> = { width: newW, height: newH, x: newX, y: newY };
                    if ((element.type === 'text' || element.type === 'button') && startAbsH && startFS) {
                      const ratio = newAbsH / startAbsH;
                      updates.config = { ...element.config, fontSize: Math.max(6, Math.round(startFS * ratio)) };
                    }
                    handleSpatialUpdate(element.id, updates);
                  }}
                  disableDragging={element.locked || isEditing}
                  enableResizing={!element.locked && !isEditing}
                  bounds="parent"
                  className={cn(
                    "group",
                    isSelected && !isEditing && "ring-2 ring-blue-500 ring-offset-1 ring-offset-black",
                    isEditing && "ring-2 ring-pink-500 ring-offset-1 ring-offset-black",
                    element.locked && "opacity-80"
                  )}
                  style={{ zIndex: element.zIndex || 0 }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedElementId(element.id);
                    setEditingElementId(null);
                  }}
                  onDoubleClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (element.type === 'text' || element.type === 'button') {
                      setEditingElementId(element.id);
                      setTimeout(() => editInputRef.current?.focus(), 50);
                    }
                  }}
                  onTouchEnd={() => {
                    const now = Date.now();
                    const last = lastTouchTime.current[element.id] || 0;
                    if (now - last < 300) {
                      if (element.type === 'text' || element.type === 'button') {
                        setEditingElementId(element.id);
                        setTimeout(() => editInputRef.current?.focus(), 50);
                      }
                    }
                    lastTouchTime.current[element.id] = now;
                  }}
                >
                  {/* Lock badge */}
                  {element.locked && isSelected && (
                    <div className="absolute -top-3 -right-3 bg-black border border-white/20 rounded-full p-1 z-10"><Lock className="w-3 h-3 text-red-400" /></div>
                  )}

                  {/* Rotation wrapper — rotation applied here, NOT on Rnd */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${element.rotation || 0}deg)`,
                      opacity: element.opacity ?? 1,
                    }}
                  >
                    {isEditing ? (
                      <textarea
                        ref={editInputRef as any}
                        defaultValue={element.config.text}
                        onBlur={handleInlineEditComplete}
                        onKeyDown={(e) => { if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey)) { e.preventDefault(); handleInlineEditComplete(); } e.stopPropagation(); }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full bg-transparent border-none outline-none resize-none p-1 m-0"
                        style={{
                          fontSize: `${element.config.fontSize || 16}px`,
                          color: element.config.textColor || element.config.color || '#fff',
                          fontFamily: element.config.fontFamily || 'inherit',
                          fontWeight: element.config.fontWeight,
                          fontStyle: element.config.fontStyle,
                          textDecoration: element.config.textDecoration,
                          textAlign: element.config.textAlign as any || 'center',
                          lineHeight: element.config.lineHeight || 1.4,
                          letterSpacing: `${element.config.letterSpacing || 0}px`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center overflow-hidden"
                        style={{
                          borderRadius: element.borderRadius ? `${element.borderRadius}px` : (element.type === 'button' ? '9999px' : '0'),
                          boxShadow: element.shadow || (element.type === 'button' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'),
                          backgroundColor: element.config.bgColor || (element.type === 'button' ? '#ec4899' : 'transparent'),
                          border: element.config.variant === 'outline' ? '2px solid currentColor' : 'none',
                          color: element.config.textColor || element.config.color || '#fff',
                        }}
                      >
                        {element.type === 'shape' && (
                          <div className="w-full h-full" style={{
                            backgroundColor: element.config.fill,
                            borderRadius: element.config.shapeType === 'circle' ? '50%' : element.borderRadius,
                            border: element.config.strokeWidth ? `${element.config.strokeWidth}px solid ${element.config.strokeColor || '#fff'}` : 'none',
                            clipPath: element.config.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : element.config.shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                          }} />
                        )}
                        {(element.type === 'text' || element.type === 'button') && (
                          <div className="pointer-events-none" style={{
                            fontSize: `${element.config.fontSize || 16}px`,
                            fontFamily: element.config.fontFamily || 'inherit',
                            fontWeight: element.config.fontWeight,
                            fontStyle: element.config.fontStyle,
                            textDecoration: element.config.textDecoration,
                            textAlign: element.config.textAlign as any || 'center',
                            lineHeight: element.config.lineHeight || 1.4,
                            letterSpacing: `${element.config.letterSpacing || 0}px`,
                            width: '100%',
                            wordBreak: 'break-word',
                            padding: element.type === 'button' ? '4px 12px' : '2px'
                          }}>
                            {element.config.text || 'Text'}
                          </div>
                        )}
                        {(element.type === 'image' || element.type === 'sticker') && (
                          <img src={element.config.src} className="w-full h-full object-contain pointer-events-none" alt="" />
                        )}
                      </div>
                    )}
                  </div>
                </Rnd>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR (PROPERTIES) */}
        <div className={cn("w-72 border-l border-white/10 flex flex-col bg-black/40 overflow-y-auto custom-scrollbar", mobileTab !== 'properties' && "hidden md:flex absolute md:relative z-20 h-full right-0")}>
          {!selectedElement ? (
            <div className="p-6 text-center text-gray-500">
              <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Select an element to edit properties</p>
              <hr className="border-white/10 my-6" />
              <h3 className="text-white font-semibold mb-4 text-left">Screen Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1 text-left">Screen Name</label>
                  <input type="text" value={activeScreen.name} onChange={e => updateScreen({ ...activeScreen, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1 text-left">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={activeScreen.background?.type === 'color' ? activeScreen.background.value : '#000000'} onChange={e => updateScreen({ ...activeScreen, background: { type: 'color', value: e.target.value } })} className="h-8 w-8 rounded cursor-pointer border border-white/20" />
                    <button onClick={() => updateScreen({ ...activeScreen, background: undefined })} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-white">Clear</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1 text-left">Screen Directs To (On Tap)</label>
                  <select 
                    value={activeScreen.nextScreenId || ''} 
                    onChange={e => updateScreen({ ...activeScreen, nextScreenId: e.target.value || undefined })} 
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-sm"
                  >
                    <option value="">(None - Only buttons navigate)</option>
                    {screens.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    <option value="success">Success / Accepted Page</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <span className="font-semibold text-white capitalize">{selectedElement.type} Settings</span>
                <button onClick={() => removeElement(selectedElement.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* Position & Size */}
              <div className="border-b border-white/10">
                <button onClick={() => toggleSection('position')} className="w-full p-4 flex justify-between items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer">
                  <span className="font-semibold text-xs uppercase tracking-wider">Position & Size</span>
                  {expandedSections.position ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.position && (() => {
                  const activeX = !syncLayout && targetRatio === 'mobile' && selectedElement.mobileOverrides ? selectedElement.mobileOverrides.x : selectedElement.x;
                  const activeY = !syncLayout && targetRatio === 'mobile' && selectedElement.mobileOverrides ? selectedElement.mobileOverrides.y : selectedElement.y;
                  const activeW = !syncLayout && targetRatio === 'mobile' && selectedElement.mobileOverrides ? selectedElement.mobileOverrides.width : selectedElement.width;
                  const activeH = !syncLayout && targetRatio === 'mobile' && selectedElement.mobileOverrides ? selectedElement.mobileOverrides.height : selectedElement.height;
                  
                  return (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] text-gray-500 block mb-1">X (%)</label><input type="number" value={Math.round(activeX)} onChange={e => handleSpatialUpdate(selectedElement.id, { x: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs" /></div>
                      <div><label className="text-[10px] text-gray-500 block mb-1">Y (%)</label><input type="number" value={Math.round(activeY)} onChange={e => handleSpatialUpdate(selectedElement.id, { y: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs" /></div>
                      <div><label className="text-[10px] text-gray-500 block mb-1">W (%)</label><input type="number" value={Math.round(activeW)} onChange={e => handleSpatialUpdate(selectedElement.id, { width: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs" /></div>
                      <div><label className="text-[10px] text-gray-500 block mb-1">H (%)</label><input type="number" value={Math.round(activeH)} onChange={e => handleSpatialUpdate(selectedElement.id, { height: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 block">Rotation</label><span className="text-[10px] text-gray-400">{selectedElement.rotation || 0}°</span></div>
                      <input type="range" min="0" max="360" value={selectedElement.rotation || 0} onChange={e => updateElement(selectedElement.id, { rotation: Number(e.target.value) })} className="w-full accent-pink-500" />
                    </div>
                    <div className="flex justify-between gap-1 pt-2">
                      <button onClick={() => handleSpatialUpdate(selectedElement.id, { x: 0 })} className="p-1.5 flex-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex justify-center text-gray-400" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleSpatialUpdate(selectedElement.id, { x: 50 - activeW/2 })} className="p-1.5 flex-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex justify-center text-gray-400" title="Center Horizontal"><AlignHorizontalSpaceAround className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleSpatialUpdate(selectedElement.id, { x: 100 - activeW })} className="p-1.5 flex-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex justify-center text-gray-400" title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleSpatialUpdate(selectedElement.id, { y: 50 - activeH/2 })} className="p-1.5 flex-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex justify-center text-gray-400" title="Center Vertical"><AlignVerticalSpaceAround className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  );
                })()}
              </div>

              {/* Typography */}
              {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                <div className="border-b border-white/10">
                  <button onClick={() => toggleSection('typography')} className="w-full p-4 flex justify-between items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer">
                    <span className="font-semibold text-xs uppercase tracking-wider">Typography</span>
                    {expandedSections.typography ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.typography && (
                    <div className="px-4 pb-4 space-y-4">
                      {selectedElement.type === 'button' && (
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Button Text</label>
                          <input type="text" value={selectedElement.config.text || ''} onChange={e => updateElement(selectedElement.id, { config: { ...selectedElement.config, text: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Font Family</label>
                          <select value={selectedElement.config.fontFamily || ''} onChange={e => updateElement(selectedElement.id, { config: { ...selectedElement.config, fontFamily: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none">
                            <option value="">Default Theme</option>
                            <option value="Inter">Inter</option>
                            <option value="Playfair Display">Playfair</option>
                            <option value="Space Mono">Space Mono</option>
                            <option value="Kalam">Kalam</option>
                            <option value="Pacifico">Pacifico</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Size (px)</label>
                          <input type="number" value={selectedElement.config.fontSize || 16} onChange={e => updateElement(selectedElement.id, { config: { ...selectedElement.config, fontSize: Number(e.target.value) } })} className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1">Text Color</label>
                        <div className="flex gap-2">
                          <input type="color" value={selectedElement.config.textColor || selectedElement.config.color || '#ffffff'} onChange={e => updateElement(selectedElement.id, { config: { ...selectedElement.config, color: e.target.value, textColor: e.target.value } })} className="h-8 w-full rounded cursor-pointer border border-white/20" />
                        </div>
                      </div>
                      <div className="flex justify-between bg-black/30 border border-white/10 rounded p-1">
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, fontWeight: selectedElement.config.fontWeight === 'bold' ? 'normal' : 'bold' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.fontWeight === 'bold' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><Bold className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, fontStyle: selectedElement.config.fontStyle === 'italic' ? 'normal' : 'italic' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.fontStyle === 'italic' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><Italic className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, textDecoration: selectedElement.config.textDecoration === 'underline' ? 'none' : 'underline' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.textDecoration === 'underline' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><Underline className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex justify-between bg-black/30 border border-white/10 rounded p-1">
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, textAlign: 'left' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.textAlign === 'left' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, textAlign: 'center' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", (!selectedElement.config.textAlign || selectedElement.config.textAlign === 'center') ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, textAlign: 'right' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.textAlign === 'right' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><AlignRight className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateElement(selectedElement.id, { config: { ...selectedElement.config, textAlign: 'justify' } })} className={cn("p-1.5 rounded flex-1 flex justify-center cursor-pointer", selectedElement.config.textAlign === 'justify' ? "bg-white/20 text-white" : "text-gray-400 hover:bg-white/5")}><AlignJustify className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Appearance */}
              <div className="border-b border-white/10">
                <button onClick={() => toggleSection('appearance')} className="w-full p-4 flex justify-between items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer">
                  <span className="font-semibold text-xs uppercase tracking-wider">Appearance</span>
                  {expandedSections.appearance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.appearance && (
                  <div className="px-4 pb-4 space-y-4">
                    {(selectedElement.type === 'shape' || selectedElement.type === 'button') && (
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1">Fill / Background</label>
                        <input type="color" value={selectedElement.config.fill || selectedElement.config.bgColor || '#ff3e6c'} onChange={e => updateElement(selectedElement.id, { config: { ...selectedElement.config, fill: e.target.value, bgColor: e.target.value } })} className="h-8 w-full rounded cursor-pointer border border-white/20" />
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 block">Opacity</label><span className="text-[10px] text-gray-400">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span></div>
                      <input type="range" min="0" max="1" step="0.05" value={selectedElement.opacity ?? 1} onChange={e => updateElement(selectedElement.id, { opacity: Number(e.target.value) })} className="w-full accent-pink-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 block">Border Radius</label><span className="text-[10px] text-gray-400">{selectedElement.borderRadius || 0}px</span></div>
                      <input type="range" min="0" max="100" value={selectedElement.borderRadius || 0} onChange={e => updateElement(selectedElement.id, { borderRadius: Number(e.target.value) })} className="w-full accent-pink-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Layout & Actions */}
              <div className="border-b border-white/10">
                <button onClick={() => toggleSection('layout')} className="w-full p-4 flex justify-between items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer">
                  <span className="font-semibold text-xs uppercase tracking-wider">Layout & Layering</span>
                  {expandedSections.layout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.layout && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="grid grid-cols-4 gap-1">
                      <button onClick={() => {
                        const maxZ = Math.max(0, ...activeScreen.elements.map(e => e.zIndex || 0));
                        updateElement(selectedElement.id, { zIndex: maxZ + 1 });
                      }} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer text-[10px]" title="Bring to Front"><ChevronsUp className="w-3.5 h-3.5" />Front</button>
                      <button onClick={() => updateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 0) + 1 })} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer text-[10px]" title="Move Forward"><ChevronUp className="w-3.5 h-3.5" />Fwd</button>
                      <button onClick={() => updateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 0) - 1 })} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer text-[10px]" title="Move Backward"><ChevronDown className="w-3.5 h-3.5" />Back</button>
                      <button onClick={() => {
                        const minZ = Math.min(0, ...activeScreen.elements.map(e => e.zIndex || 0));
                        updateElement(selectedElement.id, { zIndex: minZ - 1 });
                      }} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer text-[10px]" title="Send to Back"><ChevronsDown className="w-3.5 h-3.5" />Bottom</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={duplicateElement} className="p-2 border border-white/10 rounded hover:bg-white/5 text-gray-300 flex items-center justify-center gap-2 cursor-pointer transition-all"><Copy className="w-4 h-4" /> Duplicate</button>
                      <button onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })} className={cn("p-2 border border-white/10 rounded hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer transition-all", selectedElement.locked ? "text-pink-400 bg-pink-500/10 border-pink-500/30" : "text-gray-300")}>
                        {selectedElement.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} Lock
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {selectedElement.type === 'button' && (
                <div className="border-b border-white/10">
                  <button onClick={() => toggleSection('actions')} className="w-full p-4 flex justify-between items-center text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer">
                    <span className="font-semibold text-xs uppercase tracking-wider">Button Actions</span>
                    {expandedSections.actions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.actions && (
                    <div className="px-4 pb-4 space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1">On Click Action</label>
                        <select
                          value={selectedElement.action?.targetId || ''}
                          onChange={e => updateElement(selectedElement.id, { action: { type: 'navigate', targetId: e.target.value } })}
                          className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-white text-xs outline-none"
                        >
                          <option value="">None (Just visual)</option>
                          <option value="success">Trigger Success / Victory</option>
                          {currentScreens.filter(s => s.id !== activeScreen.id).map(s => (
                            <option key={s.id} value={s.id}>Navigate to: {s.name}</option>
                          ))}
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked={selectedElement.isUntouchable || false} onChange={e => updateElement(selectedElement.id, { isUntouchable: e.target.checked })} className="w-4 h-4 rounded bg-black border border-white/20 checked:bg-pink-500 accent-pink-500" />
                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Runaway Mode (Untouchable)</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-white/10 bg-black/80 backdrop-blur shrink-0 h-[60px]">
        <button onClick={() => setMobileTab('tools')} className={cn("flex-1 flex flex-col items-center justify-center gap-1", mobileTab === 'tools' ? "text-pink-400" : "text-gray-500")}><Palette className="w-5 h-5" /><span className="text-[10px] font-medium">Add</span></button>
        <button onClick={() => setMobileTab('canvas')} className={cn("flex-1 flex flex-col items-center justify-center gap-1", mobileTab === 'canvas' ? "text-pink-400" : "text-gray-500")}><Maximize2 className="w-5 h-5" /><span className="text-[10px] font-medium">Edit</span></button>
        <button onClick={() => setMobileTab('properties')} className={cn("flex-1 flex flex-col items-center justify-center gap-1", mobileTab === 'properties' ? "text-pink-400" : "text-gray-500")}><Settings2 className="w-5 h-5" /><span className="text-[10px] font-medium">Props</span></button>
      </div>
    </div>
  );
};
