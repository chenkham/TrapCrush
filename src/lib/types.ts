// ============================================================
// Core Type Definitions for the Trap Your Crush Platform v3
// ============================================================

export type PurposeType =
  | 'date'
  | 'love-letter'
  | 'anniversary'
  | 'proposal'
  | 'birthday'
  | 'reasons'
  | 'long-distance'
  | 'custom';

export type ThemeType =
  | 'dreamy-rose'
  | 'midnight-glow'
  | 'sunny-chaos'
  | 'vintage-film'
  | 'arcade-retro'
  | 'garden-party';

// ============================================================
// Canvas Data Models
// ============================================================

export type ElementType = 'text' | 'image' | 'button' | 'sticker' | 'shape';

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle' | 'star';

export interface CanvasElement {
  id: string;
  type: ElementType;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex?: number;
  opacity?: number; // 0-1
  borderRadius?: number;
  shadow?: string; // CSS box-shadow value
  locked?: boolean;
  visible?: boolean; // for layers panel eye toggle
  config: {
    text?: string;
    src?: string;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    fontWeight?: 'bold' | 'normal';
    fontStyle?: 'italic' | 'normal';
    textDecoration?: 'underline' | 'none';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    bgColor?: string;
    textColor?: string;
    letterSpacing?: number;
    lineHeight?: number;
    // Shape-specific
    shapeType?: ShapeType;
    fill?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
  action?: {
    type: 'navigate' | 'external';
    targetId?: string; // screen ID or URL
  };
  isUntouchable?: boolean;
  isNormalized?: boolean;
  mobileOverrides?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Screen {
  id: string;
  name: string;
  background?: {
    type: 'color' | 'image';
    value: string;
  };
  elements: CanvasElement[];
  nextScreenId?: string;
}

export interface Page {
  id: string;
  user_id: string;
  slug: string;
  purpose: PurposeType;
  theme: ThemeType;
  sender_name: string;
  recipient_name: string;
  screens: Screen[];
  created_at: string;
  updated_at: string;
  target_ratio?: 'laptop' | 'mobile';
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerification: boolean;
}

// ============================================================
// Purpose Metadata
// ============================================================

export interface PurposeMeta {
  id: PurposeType;
  name: string;
  description: string;
  icon: string;
}

export const PURPOSES: PurposeMeta[] = [
  { id: 'date', name: 'Ask on a Date', description: 'Pop the question with style', icon: 'Heart' },
  { id: 'love-letter', name: 'Love Letter', description: 'Pour your heart out digitally', icon: 'MailHeart' },
  { id: 'anniversary', name: 'Anniversary', description: 'Celebrate your time together', icon: 'Gift' },
  { id: 'proposal', name: 'Proposal', description: 'The big question', icon: 'Gem' },
  { id: 'birthday', name: 'Birthday Love', description: 'A special birthday surprise', icon: 'PartyPopper' },
  { id: 'reasons', name: 'Reasons I Love You', description: 'An animated love list', icon: 'ListHeart' },
  { id: 'long-distance', name: 'Long Distance', description: 'Bridge the miles with love', icon: 'Plane' },
  { id: 'custom', name: 'Custom Builder', description: 'Blank canvas. Build your own flow.', icon: 'Wand2' },
];

// ============================================================
// Theme Metadata
// ============================================================

export interface ThemeMeta {
  id: ThemeType;
  name: string;
  description: string;
  preview: { bg: string; accent: string; text: string };
  fontHeading: string;
  fontBody: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'dreamy-rose',
    name: 'Dreamy Rose',
    description: 'Liquid glass, aurora blobs & soft romance',
    preview: { bg: '#FFFDF9', accent: '#FF3E6C', text: '#333' },
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
  },
  {
    id: 'midnight-glow',
    name: 'Midnight Glow',
    description: 'Dark elegance with neon accents',
    preview: { bg: '#1a1a2e', accent: '#FF007F', text: '#e0e0e0' },
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Montserrat',
  },
  {
    id: 'sunny-chaos',
    name: 'Sunny Chaos',
    description: 'Bold brutalism & high-energy vibes',
    preview: { bg: '#FFDE00', accent: '#00F5D4', text: '#000' },
    fontHeading: 'Space Mono',
    fontBody: 'Inter',
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    description: 'Warm sepia tones & handwritten charm',
    preview: { bg: '#F3E5D8', accent: '#B76E79', text: '#3C1518' },
    fontHeading: 'Sacramento',
    fontBody: 'Lato',
  },
  {
    id: 'arcade-retro',
    name: 'Arcade Retro',
    description: 'Pixel art & neon gaming nostalgia',
    preview: { bg: '#0B0C10', accent: '#FF007F', text: '#C5C6C7' },
    fontHeading: 'Press Start 2P',
    fontBody: 'Space Mono',
  },
  {
    id: 'garden-party',
    name: 'Garden Party',
    description: 'Botanical warmth & organic elegance',
    preview: { bg: '#f0faf4', accent: '#2d6a4f', text: '#1b4332' },
    fontHeading: 'Kalam',
    fontBody: 'Open Sans',
  },
];

// ============================================================
// Default Screens per Purpose (v3 Architecture)
// ============================================================

export function getDefaultScreens(purpose: PurposeType, senderName: string, recipientName: string): Screen[] {
  const makeId = () => Math.random().toString(36).slice(2, 10);
  const s1 = makeId();
  const s2 = makeId();
  const s3 = makeId();

  const titleFormat = { fontSize: 36, fontWeight: 'bold' as const, fontFamily: 'var(--font-heading)', color: 'var(--accent)' };
  const textFormat = { fontSize: 20, color: 'var(--text)' };
  const btnPrimary = { variant: 'primary' as const, fontSize: 16, fontWeight: 'bold' as const };
  const btnOutline = { variant: 'outline' as const, fontSize: 16, fontWeight: 'bold' as const };

  const createText = (text: string, y: number, height: number, config: any): CanvasElement => ({
    id: makeId(), type: 'text', x: 5, y, width: 90, height, rotation: 0, zIndex: 1, opacity: 1, isNormalized: true, visible: true,
    config: { text, ...config }
  });

  const createBtn = (text: string, y: number, config: any, action?: any, isUntouchable = false, x = 25, width = 50): CanvasElement => ({
    id: makeId(), type: 'button', x, y, width, height: 8, rotation: 0, zIndex: 2, opacity: 1, isNormalized: true, visible: true,
    config: { text, ...config }, action, isUntouchable
  });

  if (purpose === 'custom') {
    return [{ id: s1, name: 'Start', elements: [] }];
  }

  switch (purpose) {
    case 'date':
      return [
        { id: s1, name: 'Intro', elements: [
          createText(`Hey ${recipientName}`, 20, 12, titleFormat),
          createText(`From ${senderName}`, 35, 8, textFormat),
          createBtn('Next', 55, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'Question', elements: [
          createText('Will you go on a date with me?', 20, 15, titleFormat),
          createBtn('Yes!', 50, btnPrimary, { type: 'navigate', targetId: s3 }, false, 10, 35),
          createBtn('No', 50, btnOutline, undefined, true, 55, 35)
        ]},
        { id: s3, name: 'Yay', elements: [
          createText('Yay! Can\'t wait! ❤️', 30, 15, titleFormat),
          createText('I will pick you up at 8!', 50, 10, textFormat)
        ]}
      ];
    case 'love-letter':
      return [
        { id: s1, name: 'Envelope', elements: [
          createText(`A letter for ${recipientName}`, 25, 12, titleFormat),
          createBtn('Open Letter', 50, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'Letter', elements: [
          createText('You mean everything to me. I just wanted to remind you how much I care about you.', 15, 30, { ...textFormat, textAlign: 'left' }),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s3 })
        ]},
        { id: s3, name: 'Sign-off', elements: [
          createText('I love you.', 30, 12, titleFormat),
          createText(`Forever yours, ${senderName}`, 45, 10, textFormat)
        ]}
      ];
    case 'anniversary':
      return [
        { id: s1, name: 'Happy Anniv', elements: [
          createText(`Happy Anniversary ${recipientName}!`, 20, 15, titleFormat),
          createBtn('Next', 55, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'Memories', elements: [
          createText('Another beautiful year of amazing memories together.', 25, 20, textFormat),
          createBtn('Next', 55, btnPrimary, { type: 'navigate', targetId: s3 })
        ]},
        { id: s3, name: 'Future', elements: [
          createText('To many more years!', 30, 15, titleFormat),
          createText('🥂', 50, 15, { fontSize: 60 })
        ]}
      ];
    case 'proposal':
      return [
        { id: s1, name: 'Nerves', elements: [
          createText(`${recipientName},`, 15, 10, titleFormat),
          createText('I have been meaning to ask you something important...', 30, 15, textFormat),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'The Question', elements: [
          createText('Will you marry me?', 20, 15, titleFormat),
          createBtn('YES!', 50, btnPrimary, { type: 'navigate', targetId: s3 }, false, 10, 35),
          createBtn('No', 50, btnOutline, undefined, true, 55, 35)
        ]},
        { id: s3, name: 'She Said Yes', elements: [
          createText('She said YES! 💍', 30, 15, titleFormat),
          createText('I love you forever.', 50, 10, textFormat)
        ]}
      ];
    case 'birthday':
      return [
        { id: s1, name: 'Bday', elements: [
          createText(`Happy Birthday ${recipientName}! 🎂`, 25, 15, titleFormat),
          createBtn('Next', 55, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'Wishes', elements: [
          createText('You deserve the best day ever. I hope all your wishes come true.', 25, 20, textFormat),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s3 })
        ]},
        { id: s3, name: 'Celebrate', elements: [
          createText('Let\'s celebrate!', 30, 12, titleFormat),
          createText('🎉🎁🎈', 45, 15, { fontSize: 40 })
        ]}
      ];
    case 'reasons':
      return [
        { id: s1, name: 'Title', elements: [
          createText('3 Reasons Why I Love You', 25, 15, titleFormat),
          createBtn('Start', 55, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'The List', elements: [
          createText('1. Your beautiful smile\n2. Your amazing laugh\n3. You put up with me', 15, 35, { ...textFormat, textAlign: 'left' }),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s3 })
        ]},
        { id: s3, name: 'Endless', elements: [
          createText('And a million more reasons.', 30, 15, titleFormat),
          createText('❤️', 50, 15, { fontSize: 60 })
        ]}
      ];
    case 'long-distance':
      return [
        { id: s1, name: 'Distance', elements: [
          createText('Miles apart...', 25, 12, titleFormat),
          createText('But close at heart.', 40, 10, textFormat),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s2 })
        ]},
        { id: s2, name: 'Missing You', elements: [
          createText('I miss you so much. Counting down the days until I see you again.', 25, 20, textFormat),
          createBtn('Next', 60, btnPrimary, { type: 'navigate', targetId: s3 })
        ]},
        { id: s3, name: 'Hug', elements: [
          createText('Sending you a virtual hug!', 25, 15, titleFormat),
          createBtn('Accept Hug 🤗', 50, btnPrimary, { type: 'navigate', targetId: 'success' })
        ]}
      ];
    default:
      return [{ id: s1, name: 'Start', elements: [] }];
  }
}
