import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'hi';

const STRINGS: Record<string, Record<Lang, string>> = {
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  trainees: { en: 'Trainees', hi: 'प्रशिक्षणार्थी' },
  stations: { en: 'Stations', hi: 'स्टेशन' },
  skill_matrix: { en: 'Skill Matrix', hi: 'कौशल मैट्रिक्स' },
  approval_queue: { en: 'Approval Queue', hi: 'अनुमोदन कतार' },
  reports: { en: 'Reports & Print Centre', hi: 'रिपोर्ट और प्रिंट केंद्र' },
  audit_trail: { en: 'Audit Trail', hi: 'ऑडिट ट्रेल' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  logout: { en: 'Log out', hi: 'लॉग आउट' },
  certified: { en: 'Certified', hi: 'प्रमाणित' },
  not_recorded: { en: 'Not recorded', hi: 'दर्ज नहीं' },
  status: { en: 'Status', hi: 'स्थिति' },
  station: { en: 'Station', hi: 'स्टेशन' },
  level: { en: 'Level', hi: 'स्तर' },
  competent_independent: { en: 'Competent — can work independently', hi: 'सक्षम — स्वतंत्र रूप से कार्य कर सकते हैं' },
  under_supervision: { en: 'Can perform under supervision', hi: 'देखरेख में कार्य कर सकते हैं' },
  under_training: { en: 'Under training', hi: 'प्रशिक्षणाधीन' },
  not_trained: { en: 'Not trained', hi: 'अप्रशिक्षित' },
  can_train_others: { en: 'Can train and assess others', hi: 'दूसरों को प्रशिक्षित/मूल्यांकन कर सकते हैं' },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }>({
  lang: 'en', setLang: () => {}, t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: string) => STRINGS[key]?.[lang] ?? key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function levelLabel(level: number): { symbol: string; text: string } {
  switch (level) {
    case 0: return { symbol: '○', text: 'Not trained' };
    case 1: return { symbol: '◔', text: 'Under training — cannot work on station' };
    case 2: return { symbol: '◑', text: 'Can perform under supervision' };
    case 3: return { symbol: '◕', text: 'Competent — can work independently' };
    case 4: return { symbol: '●', text: 'Can train and assess others' };
    default: return { symbol: '?', text: 'Unknown' };
  }
}
