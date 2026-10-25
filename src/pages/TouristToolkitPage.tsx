import React, { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  FileText,
  ShieldAlert,
  PhoneCall,
  Wifi,
  Navigation,
  DollarSign,
  Languages,
  ExternalLink,
  Volume2,
  Copy,
  Check,
  Plane,
  Train,
  Bus,
  Car,
  AlertTriangle,
  Info,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

type ToolkitTab = 'visa' | 'safety' | 'emergency' | 'sim' | 'transport' | 'money' | 'phrases';

interface PhraseItem {
  english: string;
  urdu: string;
  roman: string;
  category: 'greetings' | 'directions' | 'food' | 'shopping' | 'emergency';
}

const URDU_PHRASES: PhraseItem[] = [
  // Greetings & Respect
  { english: 'Hello / Peace be upon you', urdu: 'السلام علیکم', roman: 'Assalam-o-Alaikum', category: 'greetings' },
  { english: 'And peace be upon you too (Reply)', urdu: 'وعلیکم السلام', roman: 'Walaikum Assalam', category: 'greetings' },
  { english: 'Thank you very much', urdu: 'بہت شکریہ', roman: 'Bohat Shukriya', category: 'greetings' },
  { english: 'How are you?', urdu: 'آپ کیسے ہیں؟', roman: 'Aap kaise hain?', category: 'greetings' },
  { english: 'I am fine, praise be to God', urdu: 'میں ٹھیک ہوں، الحمد للہ', roman: 'Main theek hoon, Alhamdulillah', category: 'greetings' },
  { english: 'Please / Excuse me', urdu: 'براہ مہربانی / معاف کیجیے گا', roman: 'Barahe meherbani / Maaf kijiye ga', category: 'greetings' },
  { english: 'Goodbye', urdu: 'خدا حافظ', roman: 'Khuda Hafiz', category: 'greetings' },
  { english: 'What is your name?', urdu: 'آپ کا نام کیا ہے؟', roman: 'Aap ka naam kya hai?', category: 'greetings' },
  { english: 'My name is...', urdu: 'میرا نام ... ہے', roman: 'Mera naam ... hai', category: 'greetings' },

  // Directions & Travel
  { english: 'Where is this place?', urdu: 'یہ جگہ کہاں ہے؟', roman: 'Yeh jagah kahan hai?', category: 'directions' },
  { english: 'Where is the hotel / lodge?', urdu: 'ہوٹل کہاں ہے؟', roman: 'Hotel kahan hai?', category: 'directions' },
  { english: 'Please stop here', urdu: 'یہاں روکیے', roman: 'Yahan rokiye', category: 'directions' },
  { english: 'How far is it?', urdu: 'یہ کتنا دور ہے؟', roman: 'Yeh kitna door hai?', category: 'directions' },
  { english: 'Turn right', urdu: 'دائیں مڑیں', roman: 'Daayein murein', category: 'directions' },
  { english: 'Turn left', urdu: 'بائیں مڑیں', roman: 'Baayein murein', category: 'directions' },
  { english: 'Straight ahead', urdu: 'سیدھا آگے', roman: 'Seedha aagay', category: 'directions' },

  // Food & Chai
  { english: 'Can I get a cup of tea?', urdu: 'کیا چائے مل سکتی ہے؟', roman: 'Kya chai mil sakti hai?', category: 'food' },
  { english: 'Less spicy please', urdu: 'کم مرچ، براہ مہربانی', roman: 'Kam mirch, barahe meherbani', category: 'food' },
  { english: 'The food is very delicious', urdu: 'کھانا بہت لذیذ ہے', roman: 'Khaana bohat lazeez hai', category: 'food' },
  { english: 'Drinking water please', urdu: 'پینے کا پانی، پلیز', roman: 'Peenay ka paani, please', category: 'food' },
  { english: 'The bill / check please', urdu: 'بل دیجیے گا', roman: 'Bill dijiye ga', category: 'food' },

  // Bargaining & Shopping
  { english: 'How much does this cost?', urdu: 'یہ کتنے کا ہے؟', roman: 'Yeh kitnay ka hai?', category: 'shopping' },
  { english: 'Can you give a discount?', urdu: 'کچھ رعایت ہو سکتی ہے؟', roman: 'Kuch riaayat ho sakti hai?', category: 'shopping' },
  { english: 'It is too expensive', urdu: 'یہ بہت مہنگا ہے', roman: 'Yeh bohat mehnga hai', category: 'shopping' },
  { english: 'I want this one', urdu: 'مجھے یہ چاہیے', roman: 'Mujhe yeh chahiye', category: 'shopping' },

  // Emergencies & Health
  { english: 'I need urgent help!', urdu: 'مجھے مدد چاہیے!', roman: 'Mujhe madad chahiye!', category: 'emergency' },
  { english: 'Where is the nearest hospital?', urdu: 'قریبی ہسپتال کہاں ہے؟', roman: 'Qareebi hospital kahan hai?', category: 'emergency' },
  { english: 'Call the doctor please', urdu: 'ڈاکٹر کو بلائیں', roman: 'Doctor ko bulayein', category: 'emergency' },
  { english: 'Call the police', urdu: 'پولیس کو فون کریں', roman: 'Police ko phone karein', category: 'emergency' },
  { english: 'I am lost', urdu: 'میں راستہ بھول گیا ہوں', roman: 'Main raasta bhool gaya hoon', category: 'emergency' },
];

export const TouristToolkitPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolkitTab>('visa');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Currency Converter State
  const [amount, setAmount] = useState<number>(100);
  const [sourceCurrency, setSourceCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'AED' | 'CNY'>('USD');
  const [pkrRate, setPkrRate] = useState<number>(278.5);
  const [isLiveRate, setIsLiveRate] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);

  // Urdu Phrasebook filter
  const [phraseCategory, setPhraseCategory] = useState<'all' | 'greetings' | 'directions' | 'food' | 'shopping' | 'emergency'>('all');

  // Page title
  useEffect(() => {
    document.title = 'Foreign Tourist Toolkit & Travel Navigator | Wayfarer Pakistan';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Official e-visa guide, safety advisories, emergency numbers (1122, 15), SIM tips (SCOM), live currency converter, and audio Urdu phrasebook.'
      );
    }
  }, []);

  // Fetch Live Exchange Rates (free API with static fallback)
  useEffect(() => {
    setRateLoading(true);
    fetch(`https://open.er-api.com/v6/latest/${sourceCurrency}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rates?.PKR) {
          setPkrRate(data.rates.PKR);
          setIsLiveRate(true);
        }
      })
      .catch((e) => {
        console.warn('Currency live API fallback active:', e);
        // Reliable fallback rates if network fails
        const fallbacks: Record<string, number> = {
          USD: 278.5,
          EUR: 302.2,
          GBP: 355.4,
          CAD: 204.1,
          AUD: 182.6,
          AED: 75.8,
          CNY: 38.6,
        };
        setPkrRate(fallbacks[sourceCurrency] || 278.5);
      })
      .finally(() => {
        setRateLoading(false);
      });
  }, [sourceCurrency]);

  // Audio Speech Synthesis for Urdu Phrase
  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find Urdu or Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const urduVoice = voices.find((v) => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
      if (urduVoice) {
        utterance.voice = urduVoice;
      }
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredPhrases = useMemo(() => {
    if (phraseCategory === 'all') return URDU_PHRASES;
    return URDU_PHRASES.filter((p) => p.category === phraseCategory);
  }, [phraseCategory]);

  const tabs = [
    { id: 'visa', label: 'e-Visa & Entry', icon: FileText },
    { id: 'safety', label: 'Safety & Advisories', icon: ShieldAlert },
    { id: 'emergency', label: 'Emergency Numbers', icon: PhoneCall },
    { id: 'sim', label: 'SIM & Connectivity', icon: Wifi },
    { id: 'transport', label: 'Transport Navigator', icon: Navigation },
    { id: 'money', label: 'Money & Currency', icon: DollarSign },
    { id: 'phrases', label: 'Urdu Audio Phrasebook', icon: Languages },
  ];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tourist Toolkit' },
        ]}
      />

      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-[#121620] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 inline-block">
            Field Essentials For Foreign Travelers
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
            Pakistan Tourist Toolkit & Navigator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Everything an international tourist needs to move smoothly across Pakistan: official e-visas, mountain safety protocols, SCOM internet coverage, emergency helplines, live currency conversion, and an audio Urdu phrasebook.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ToolkitTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISA & ENTRY */}
      {activeTab === 'visa' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 p-8 rounded-3xl border border-white/10 bg-[#141822] space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                  NADRA Official Visa System
                </span>
                <h3 className="text-2xl font-bold font-serif text-white mt-1">
                  Pakistan Tourist e-Visa: Official Process
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Citizens of over 175 countries are eligible to apply online 100% digitally through the official Ministry of Interior portal.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
                  <strong className="block font-sans text-sm text-white">Crucial Official Portal Reminder:</strong>
                  <span>
                    Only submit visa applications directly via the official Government of Pakistan e-Visa portal at <strong>visa.nadra.gov.pk</strong>. Beware of unauthorized third-party copycat sites.
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white pt-2">Step-by-Step Application Steps:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Register Account:</strong> Visit the official NADRA portal and create an account with a verified email address.
                  </li>
                  <li>
                    <strong>Select Tourist Visa:</strong> Choose "Tourist / Visit Visa" (Standard 30-day single entry or multiple entry up to 90 days).
                  </li>
                  <li>
                    <strong>Upload Documents:</strong> High-resolution passport scan (valid for at least 6 months), passport-size digital photograph against white backdrop, and confirmed hotel booking or Invitation Letter (Wayfarer provides verified bookings).
                  </li>
                  <li>
                    <strong>Fee Payment:</strong> Pay the standard government processing fee ($25 to $60 depending on nationality) using Visa or Mastercard.
                  </li>
                  <li>
                    <strong>Receive Electronic Visa:</strong> Processing typically takes between 48 hours to 7 working days. Print 2 physical copies of the PDF e-visa for immigration counters.
                  </li>
                </ol>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                  <span className="text-slate-400 text-[11px]">
                    Note: Always verify the latest official entry regulations before booking flights.
                  </span>
                  <a
                    href="https://visa.nadra.gov.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
                  >
                    <span>Launch Official NADRA Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 rounded-3xl border border-white/10 bg-[#121620] space-y-4">
              <h4 className="text-base font-bold font-serif text-white">Required Documents Checklist</h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Passport valid for 6+ months from entry date</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clear passport photo (white background, digital)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hotel reservation or tour operator invitation letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Return or onward flight reservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Printed copies of e-Visa document (keep in carry-on)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFETY & TRAVEL ADVISORY */}
      {activeTab === 'safety' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-8 rounded-3xl border border-white/10 bg-[#141822] space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Independent Field Intelligence
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Safety, Security & Travel Advisories
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct insights from verified tour guides and official government foreign travel advisories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Gilgit-Baltistan & Northern Valleys</span>
                </h4>
                <p className="leading-relaxed">
                  Hunza, Skardu, Fairy Meadows, and Deosai enjoy exceptionally low crime rates. Local communities are peaceable and protective of foreign guests. Women travelers frequently report feeling safer than in European transit centers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Restricted Border Zones (NOC Required)</span>
                </h4>
                <p className="leading-relaxed">
                  Most of Pakistan (including Islamabad, Lahore, Hunza, Skardu, Swat) requires NO permits (NOC) for foreign tourists. However, treks within 10 miles of the Line of Control (LoC) or parts of interior Balochistan require a Non-Objection Certificate from the Ministry of Interior.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Official Consular Advisory Portals:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.gov.uk/foreign-travel-advice/pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>UK FCDO Travel Advice</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
                <a
                  href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/pakistan-travel-advisory.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>US State Department Advisory</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY NUMBERS */}
      {activeTab === 'emergency' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
              Immediate Assistance Helplines
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              National Emergency Helplines (Toll-Free 24/7)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              All numbers work from any mobile phone even without prepaid balance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Rescue 1122 (Paramedic, Fire & Disaster)', number: '1122', note: 'Standard nationwide emergency rescue service' },
              { name: 'Police Emergency Response', number: '15', note: 'City & district police control desk' },
              { name: 'Edhi Foundation Free Ambulance', number: '115', note: 'World’s largest volunteer ambulance network' },
              { name: 'National Tourist Police Helpline', number: '1422', note: 'Dedicated tourist assistance & route guidance' },
              { name: 'National Highway & Motorway Police', number: '130', note: 'Breakdown & escort on M-2, M-1, and KKH' },
              { name: 'Chhipa Welfare Ambulance', number: '1020', note: 'Rapid 24/7 medical transit service' },
            ].map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">{item.name}</span>
                  <div className="text-3xl font-bold font-mono text-amber-400 my-2">
                    {item.number}
                  </div>
                  <p className="text-[11px] text-slate-400">{item.note}</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <a
                    href={`tel:${item.number}`}
                    className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(item.number)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                    title="Copy number"
                  >
                    {copiedNumber === item.number ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SIM & CONNECTIVITY */}
      {activeTab === 'sim' && (
        <div className="p-8 rounded-3xl border border-white/10 bg-[#141822] space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
              Mobile Data & WiFi Guide
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              SIM Cards, eSIMs & Northern Valley Coverage
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gilgit-Baltistan and Azad Kashmir operate on distinct telecommunications networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
                1. SCOM (Essential for Gilgit-Baltistan & Azad Kashmir)
              </span>
              <p>
                Standard Pakistani SIMs (Jazz, Zong, Telenor) have <strong>severely limited or zero mobile data</strong> once you cross into Gilgit-Baltistan. You MUST acquire an <strong>SCOM SIM</strong> (Special Communications Organization). SCOM provides fast 4G coverage across Hunza, Skardu, Gilgit, and along the KKH.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <strong>Where to Buy:</strong> Airport arrival stalls at Islamabad International (outside terminal), or SCOM Customer Centers in Gilgit and Skardu. Requires passport.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
                2. Zong or Jazz (Best for Punjab, Sindh & Motorways)
              </span>
              <p>
                For Islamabad, Lahore, Karachi, Peshawar, and the motorways, <strong>Zong 4G</strong> or <strong>Jazz</strong> offer the highest speeds and widest coverage. 30-day tourist data packages (30GB - 100GB) cost roughly $5 - $10 USD.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[11px]">
                <strong>eSIM Note:</strong> Providers like Airalo and Nomad offer Pakistan eSIMs on the Zong/Jazz network, but note they will NOT work in Gilgit-Baltistan without SCOM.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRANSPORT NAVIGATOR */}
      {activeTab === 'transport' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
              Getting Around Pakistan
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              Transport Navigator: Flights, Trains, Buses & 4x4 Chauffeurs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-3">
              <Plane className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Mountain Flights</h4>
              <p className="leading-relaxed">
                PIA operates daily direct flights from Islamabad to Skardu and Gilgit. These flights are strictly weather-dependent (visual flight rules). Always budget 1 buffer day in case of cloud cover.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-3">
              <Train className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Scenic Railways</h4>
              <p className="leading-relaxed">
                The <strong>Green Line Express</strong> and <strong>Karakoram Express</strong> connect Islamabad/Rawalpindi to Lahore and Karachi. AC Business and Sleeper berths are clean, air-conditioned, and scenic.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-3">
              <Bus className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Luxury Buses</h4>
              <p className="leading-relaxed">
                <strong>Daewoo Express</strong> and <strong>Faisal Movers</strong> offer modern, punctual, reclining leather-seat coaches with onboard WiFi and charging ports between major cities.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-3">
              <Car className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">4x4 Mountain Driver</h4>
              <p className="leading-relaxed">
                For northern valley trails (Deosai, Fairy Meadows, Khunjerab), hiring a Toyota Prado or HiAce with an experienced local driver ($50-$90/day) is the safest and most enjoyable method.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MONEY & CURRENCY CONVERTER */}
      {activeTab === 'money' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* Interactive Live Converter */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-amber-500/30 bg-[#141822] shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Real-Time Currency Calculator
                </span>
                <h3 className="text-2xl font-bold font-serif text-white mt-1">
                  Foreign Currency to Pakistani Rupee (PKR)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isLiveRate ? 'Live Market Rate' : 'Static Fallback Rate'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Your Currency Amount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="flex-1 bg-[#10131a] border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value as any)}
                    className="bg-[#10131a] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Equivalent in Pakistani Rupee (PKR)
                </label>
                <div className="bg-[#10131a] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xl font-bold font-mono text-amber-400 flex items-center justify-between">
                  <span>₨ {Math.round(amount * pkrRate).toLocaleString()}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">PKR</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>
                1 {sourceCurrency} ≈ ₨ {pkrRate.toFixed(2)} PKR
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Source: Open Exchange Rates
              </span>
            </div>
          </div>

          {/* Practical Cash & Card Advice */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-white/10 bg-[#121620] space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>ATM Networks & Cash Rules</span>
            </h4>
            <p>
              <strong>Cash is King in the Mountains:</strong> While upscale hotels and restaurants in Islamabad, Lahore, and Karachi accept Visa and Mastercard, rural northern valleys operate 100% on physical cash.
            </p>
            <p>
              <strong>Best ATMs for Foreign Cards:</strong> Standard Chartered, Habib Bank Limited (HBL), and Meezan Bank have the highest reliability for international chip & PIN cards.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
              Tip: Withdraw 30,000 to 50,000 PKR at Islamabad Airport before journeying north. Keep smaller 100, 500, and 1,000 PKR bills handy for local roadside chai stalls.
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: URDU AUDIO PHRASEBOOK */}
      {activeTab === 'phrases' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Phonetic & Audio Companion
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Essential Urdu Tourist Phrasebook
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Click the speaker button to hear native pronunciation powered by speech synthesis.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'greetings', 'directions', 'food', 'shopping', 'emergency'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setPhraseCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                    phraseCategory === c
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10 bg-[#141822] space-y-3 flex flex-col justify-between hover:border-amber-400/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    <span>{phrase.category}</span>
                    <button
                      onClick={() => speakPhrase(phrase.urdu)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
                      title="Listen pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Audio</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-white">{phrase.english}</h4>
                  <div className="text-xl font-serif text-amber-400 text-right dir-rtl py-1 font-normal">
                    {phrase.urdu}
                  </div>
                  <div className="text-xs font-mono text-slate-300 italic">
                    "{phrase.roman}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
