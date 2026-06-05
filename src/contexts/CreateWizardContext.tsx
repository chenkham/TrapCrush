import React, { createContext, useContext, useState } from 'react';
import type { PurposeType, ThemeType, Screen } from '../lib/types';

interface WizardState {
  purpose: PurposeType | null;
  theme: ThemeType | null;
  senderName: string;
  recipientName: string;
  screens: Screen[];
  targetRatio: 'laptop' | 'mobile';
  syncLayout: boolean;
}

interface WizardContextType {
  state: WizardState;
  setPurpose: (purpose: PurposeType) => void;
  setTheme: (theme: ThemeType) => void;
  setSenderName: (name: string) => void;
  setRecipientName: (name: string) => void;
  setScreens: (screens: Screen[]) => void;
  setTargetRatio: (ratio: 'laptop' | 'mobile') => void;
  setSyncLayout: (sync: boolean) => void;
  reset: () => void;
}

const initialState: WizardState = {
  purpose: null,
  theme: null,
  senderName: '',
  recipientName: '',
  screens: [],
  targetRatio: 'mobile',
  syncLayout: true,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>(() => {
    try {
      const saved = localStorage.getItem('trapcrush_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load draft:", e);
    }
    return initialState;
  });

  React.useEffect(() => {
    localStorage.setItem('trapcrush_draft', JSON.stringify(state));
  }, [state]);

  const setPurpose = (purpose: PurposeType) => setState(s => ({ ...s, purpose }));
  const setTheme = (theme: ThemeType) => setState(s => ({ ...s, theme }));
  const setSenderName = (name: string) => setState(s => ({ ...s, senderName: name }));
  const setRecipientName = (name: string) => setState(s => ({ ...s, recipientName: name }));
  const setScreens = (screens: Screen[]) => setState(s => ({ ...s, screens }));
  const setTargetRatio = (targetRatio: 'laptop' | 'mobile') => setState(s => ({ ...s, targetRatio }));
  const setSyncLayout = (syncLayout: boolean) => setState(s => ({ ...s, syncLayout }));
  const reset = () => {
    setState(initialState);
    localStorage.removeItem('trapcrush_draft');
  };

  return (
    <WizardContext.Provider value={{
      state, setPurpose, setTheme, setSenderName, setRecipientName, setScreens, setTargetRatio, setSyncLayout, reset
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) throw new Error('useWizard must be used within WizardProvider');
  return context;
};
