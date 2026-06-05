// Built-in fallbacks
export const BUILT_IN_STICKERS = [
  'https://media.tenor.com/P1v3xOabC18AAAAi/milk-and-mocha-bear-couple.gif',
  'https://media.tenor.com/E8W-xQOQz3wAAAAi/peach-and-goma-peach-goma.gif',
  'https://media.tenor.com/W2o37Hk2TVEAAAAi/cute-cat.gif',
  'https://media.tenor.com/XqT7hS3p0qQAAAAi/hearts-love.gif',
  'https://media.tenor.com/gK2R0nE9d_kAAAAi/bubu-dudu-kisses.gif',
  'https://media.tenor.com/Y17O5y5m8uYAAAAi/love-hearts.gif'
];

export const BUILT_IN_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
];

export type StickerProvider = 'builtin' | 'giphy' | 'pixabay' | 'iconfinder' | 'openmoji' | 'noto' | 'bootstrap';
export type BackgroundProvider = 'builtin' | 'pexels' | 'pixabay';

// --- STICKERS ---
export async function searchStickers(query: string, provider: StickerProvider): Promise<string[]> {
  const defaultQuery = query || 'love';

  try {
    switch (provider) {
      case 'giphy': {
        const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
        if (!apiKey) return [];
        const res = await fetch(`https://api.giphy.com/v1/stickers/search?api_key=${apiKey}&q=${encodeURIComponent(defaultQuery)}&limit=20`);
        const data = await res.json();
        return data.data.map((r: any) => r.images.original.url);
      }
      
      case 'pixabay': {
        const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
        if (!apiKey) return [];
        const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(defaultQuery)}&image_type=vector&per_page=20`);
        const data = await res.json();
        return data.hits.map((h: any) => h.webformatURL);
      }

      case 'iconfinder': {
        const apiKey = import.meta.env.VITE_ICONFINDER_API_KEY;
        if (!apiKey) return [];
        const res = await fetch(`https://api.iconfinder.com/v4/icons/search?query=${encodeURIComponent(defaultQuery)}&count=20&premium=false`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json'
          }
        });
        const data = await res.json();
        return data.icons.map((i: any) => {
          const raster = i.raster_sizes.sort((a: any, b: any) => b.size - a.size)[0];
          return raster ? raster.formats[0].preview_url : '';
        }).filter(Boolean);
      }

      case 'openmoji': {
        if (!(window as any).__openmojiCache) {
          const res = await fetch('https://cdn.jsdelivr.net/npm/openmoji@14.0.0/data/openmoji.json');
          (window as any).__openmojiCache = await res.json();
        }
        const cache: any[] = (window as any).__openmojiCache;
        const q = defaultQuery.toLowerCase();
        const matches = cache.filter(e => {
          const ann = e.annotation || '';
          const tags = e.tags || '';
          return ann.includes(q) || tags.includes(q);
        }).slice(0, 30);
        return matches.map(e => `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/${e.hexcode}.svg`);
      }

      case 'noto': {
        if (!(window as any).__notoCache) {
          const res = await fetch('https://unpkg.com/emojibase-data@15.3.1/en/data.json');
          (window as any).__notoCache = await res.json();
        }
        const cache: any[] = (window as any).__notoCache;
        const q = defaultQuery.toLowerCase();
        const matches = cache.filter(e => {
          const ann = e.annotation || '';
          const tags = (e.tags || []).join(' ');
          return ann.includes(q) || tags.includes(q);
        }).slice(0, 30);
        return matches.map(e => {
          const hex = e.hexcode.split('-')[0].toLowerCase();
          return `https://fonts.gstatic.com/s/e/notoemoji/latest/${hex}/512.gif`;
        });
      }

      case 'bootstrap': {
        if (!(window as any).__bootstrapIconsCache) {
          const res = await fetch('https://unpkg.com/bootstrap-icons@1.11.3/font/bootstrap-icons.json');
          const data = await res.json();
          (window as any).__bootstrapIconsCache = Object.keys(data);
        }
        const cache: string[] = (window as any).__bootstrapIconsCache;
        const q = defaultQuery.toLowerCase();
        const matches = cache.filter(i => i.includes(q)).slice(0, 30);
        return matches.map(i => `https://unpkg.com/bootstrap-icons@1.11.3/icons/${i}.svg`);
      }

      case 'builtin':
      default:
        return BUILT_IN_STICKERS;
    }
  } catch (err) {
    console.error(`Sticker fetch failed for ${provider}`, err);
    return [];
  }
}

// --- BACKGROUNDS ---
export async function searchBackgrounds(query: string, provider: BackgroundProvider): Promise<string[]> {
  const defaultQuery = query || 'romantic landscape';

  try {
    switch (provider) {
      case 'pexels': {
        const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (!apiKey) return BUILT_IN_BACKGROUNDS;
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(defaultQuery)}&per_page=20`, {
          headers: { Authorization: apiKey }
        });
        const data = await res.json();
        return data.photos.map((p: any) => p.src.large2x);
      }

      case 'pixabay': {
        const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
        if (!apiKey) return BUILT_IN_BACKGROUNDS;
        const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(defaultQuery)}&image_type=photo&per_page=20`);
        const data = await res.json();
        return data.hits.map((h: any) => h.largeImageURL);
      }

      case 'builtin':
      default:
        return BUILT_IN_BACKGROUNDS;
    }
  } catch (err) {
    console.error(`Background fetch failed for ${provider}`, err);
    return BUILT_IN_BACKGROUNDS;
  }
}
