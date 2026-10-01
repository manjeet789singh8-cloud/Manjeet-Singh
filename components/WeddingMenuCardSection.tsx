'use client';

import React, { useState, useMemo } from 'react';
import {
  EVENT_PRESETS,
  WEDDING_MENU_SECTIONS,
  ResortSettings,
} from '@/lib/tfc-data';
import {
  Calendar,
  Clock,
  Users,
  Building2,
  RotateCcw,
  Check,
  Sparkles,
  MessageCircle,
  Phone,
  CheckCircle2,
  SlidersHorizontal,
  PartyPopper,
  Cake,
  Heart,
  Gem,
} from 'lucide-react';

interface WeddingMenuCardSectionProps {
  settings: ResortSettings;
  onBookWeddingCard: (payload: {
    presetTitle: string;
    bookingDate: string;
    timeSlot: string;
    expectedGuests: number;
    hallZone: string;
    selectedItemsCount: number;
    selectedBySection: { title: string; items: string[] }[];
    customNotes: string;
  }) => void;
}

export default function WeddingMenuCardSection({
  settings,
  onBookWeddingCard,
}: WeddingMenuCardSectionProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('wedding');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-30');
  const [timeSlot, setTimeSlot] = useState<string>(
    'Full Day Grand Wedding (09:00 AM - 11:30 PM)'
  );
  const [expectedGuests, setExpectedGuests] = useState<number>(300);
  const [hallZone, setHallZone] = useState<string>(
    'Combined AC Hall & Garden Lawn'
  );
  const [customNotes, setCustomNotes] = useState<string>('');

  // Initialize checked state with the exact 63 default checked items
  const defaultCheckedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    WEDDING_MENU_SECTIONS.forEach((sec) => {
      sec.items.forEach((item) => {
        map[item.id] = item.defaultChecked;
      });
    });
    return map;
  }, []);

  const [checkedItems, setCheckedItems] =
    useState<Record<string, boolean>>(defaultCheckedMap);

  const totalItemsCount = useMemo(() => {
    return WEDDING_MENU_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
  }, []);

  const tickedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const handleToggleItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleTickAll = () => {
    const all: Record<string, boolean> = {};
    WEDDING_MENU_SECTIONS.forEach((sec) => {
      sec.items.forEach((item) => {
        all[item.id] = true;
      });
    });
    setCheckedItems(all);
  };

  const handleDefaultPreset = () => {
    setCheckedItems({ ...defaultCheckedMap });
  };

  const handleClearAll = () => {
    const cleared: Record<string, boolean> = {};
    WEDDING_MENU_SECTIONS.forEach((sec) => {
      sec.items.forEach((item) => {
        cleared[item.id] = false;
      });
    });
    setCheckedItems(cleared);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = EVENT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setExpectedGuests(found.defaultGuests);
      setTimeSlot(found.defaultTimeSlot);
      setHallZone(found.defaultZone);
    }
    const cardEl = document.getElementById('interactive-wedding-checklist');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedPreset =
    EVENT_PRESETS.find((p) => p.id === selectedPresetId) || EVENT_PRESETS[0];

  const selectedBySection = useMemo(() => {
    return WEDDING_MENU_SECTIONS.map((sec) => ({
      id: sec.id,
      title: sec.title,
      items: sec.items.filter((i) => checkedItems[i.id]).map((i) => i.name),
    })).filter((s) => s.items.length > 0);
  }, [checkedItems]);

  const handleSendWhatsApp = () => {
    const summaryLines = selectedBySection
      .map((s) => `*${s.title.toUpperCase()} (${s.items.length}):* ${s.items.join(', ')}`)
      .join('\n');
    const text = encodeURIComponent(
      `Hello ${settings.name} Concierge!\n\nI would like to book the *${selectedPreset.title}* with our customised menu card:\n- Date: ${bookingDate}\n- Time Slot: ${timeSlot}\n- Guests: ${expectedGuests}\n- Venue Zone: ${hallZone}\n- Total Items Selected: ${tickedCount} of ${totalItemsCount}\n\n${summaryLines}\n\nExtra Notes: ${customNotes || 'None'}`
    );
    window.open(`https://wa.me/91${settings.whatsapp}?text=${text}`, '_blank');
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'party':
        return <PartyPopper className="w-4 h-4 text-[#D4A977]" />;
      case 'birthday':
        return <Cake className="w-4 h-4 text-[#D4A977]" />;
      case 'arrange-marriage':
        return <Heart className="w-4 h-4 text-[#D4A977]" />;
      case 'wedding':
        return <Sparkles className="w-4 h-4 text-[#D4A977]" />;
      case 'ring-ceremony':
        return <Gem className="w-4 h-4 text-[#D4A977]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#D4A977]" />;
    }
  };

  const page1Left = WEDDING_MENU_SECTIONS.filter(
    (s) => s.page === 1 && s.column === 'left'
  );
  const page1Right = WEDDING_MENU_SECTIONS.filter(
    (s) => s.page === 1 && s.column === 'right'
  );
  const page2Left = WEDDING_MENU_SECTIONS.filter(
    (s) => s.page === 2 && s.column === 'left'
  );
  const page2Right = WEDDING_MENU_SECTIONS.filter(
    (s) => s.page === 2 && s.column === 'right'
  );

  const renderMenuSectionBlock = (sec: (typeof WEDDING_MENU_SECTIONS)[0]) => {
    const secCheckedCount = sec.items.filter((i) => checkedItems[i.id]).length;
    return (
      <div key={sec.id} className="mb-5">
        {/* Warm golden-peach section header capsule matching screenshot */}
        <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-[#E3AC69] to-[#EEBE84] text-[#5C2514] px-4 py-1.5 rounded-r-full rounded-tl-md shadow-xs mb-2.5 border border-[#D49750]">
          <span className="font-serif italic font-bold text-base sm:text-lg tracking-wide">
            {sec.title}
          </span>
          <span className="text-xs font-mono font-semibold text-[#6E301B]">
            ({secCheckedCount}/{sec.items.length})
          </span>
        </div>

        <div
          className={
            sec.twoColumnGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5'
              : 'space-y-1.5'
          }
        >
          {sec.items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <label
                key={item.id}
                onClick={() => handleToggleItem(item.id)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded cursor-pointer transition-colors select-none text-xs sm:text-sm ${
                  isChecked
                    ? 'bg-[#EFE3CE]/90 text-[#1F1610] font-semibold'
                    : 'bg-transparent text-[#5A4E40] hover:bg-[#EFE3CE]/40 font-normal'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-xs flex items-center justify-center border shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-[#B85D3B] border-[#9E4728] text-white'
                      : 'border-[#9C8D79] bg-white/70'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span className="truncate">{item.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      id="wedding-card-section"
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
          OFFICIAL TFC GARDEN WEDDING & PARTY CUSTOM MENU CARD
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-3">
          Party & Wedding Booking Custom Menu Card
        </h2>
        <p className="text-sm sm:text-base text-[#54635A] max-w-3xl mb-5">
          Tick your preferred items directly on our official Wedding Hall Menu &
          Setup Card below and book instantly or send on WhatsApp.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E5E3A] hover:bg-[#17492D] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Selected Card: {settings.whatsapp}</span>
          </button>
          <a
            href={`tel:${settings.landline}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#132A1F] hover:bg-[#1D3B2C] text-white text-xs sm:text-sm font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4A977]" />
            <span>Call: {settings.landline}</span>
          </a>
        </div>
      </div>

      {/* 5 Event Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {EVENT_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`rounded-2xl overflow-hidden border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#10281E] text-white border-[#D4A977] ring-2 ring-[#D4A977]/60 shadow-lg'
                  : 'bg-white text-[#14281D] border-[#E5DEC9] hover:border-[#C2B69C] shadow-xs'
              }`}
            >
              <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-[#163024]">
                <img
                  src={preset.image}
                  alt={preset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[#112A1F]/85 backdrop-blur-xs flex items-center justify-center border border-white/15">
                  {getPresetIcon(preset.id)}
                </div>
                {isSelected && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#D4A977] text-[#14281D] text-[10px] font-bold uppercase tracking-wider">
                    SELECTED
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-lg sm:text-xl font-semibold mb-0.5">
                  {preset.title}
                </h3>
                <p
                  className={`text-xs mb-3.5 ${
                    isSelected ? 'text-[#B8C7BE]' : 'text-[#68756D]'
                  }`}
                >
                  {preset.guestsText}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPreset(preset.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4A977] text-[#14281D]'
                      : 'bg-[#184A34] hover:bg-[#123827] text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {isSelected ? 'Customising Card' : 'Load Card Preset'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Quick Action Bar */}
      <div
        id="interactive-wedding-checklist"
        className="bg-white rounded-2xl border border-[#E5DEC9] p-4 sm:p-5 mb-6 shadow-xs"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#627067] mb-1">
              <Calendar className="w-3 h-3 text-[#9A6B3E]" />
              <span>BOOKING DATE</span>
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD4C0] bg-[#FAF8F3] text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#627067] mb-1">
              <Clock className="w-3 h-3 text-[#9A6B3E]" />
              <span>TIME SLOT</span>
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD4C0] bg-[#FAF8F3] text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
            >
              <option value="Full Day Grand Wedding (09:00 AM - 11:30 PM)">
                Full Day Grand Wedding
              </option>
              <option value="Morning Auspicious Slot (09:00 AM - 04:00 PM)">
                Morning Auspicious Slot
              </option>
              <option value="Evening Reception Gala (06:00 PM - 11:30 PM)">
                Evening Reception Gala
              </option>
              <option value="Afternoon Party Slot (12:00 PM - 05:00 PM)">
                Afternoon Party Slot
              </option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#627067] mb-1">
              <Users className="w-3 h-3 text-[#9A6B3E]" />
              <span>EXPECTED GUESTS</span>
            </label>
            <input
              type="number"
              min={20}
              max={1000}
              value={expectedGuests}
              onChange={(e) => setExpectedGuests(Number(e.target.value) || 100)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD4C0] bg-[#FAF8F3] text-[#14281D] font-mono focus:outline-none focus:border-[#1E5E3A]"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#627067] mb-1">
              <Building2 className="w-3 h-3 text-[#9A6B3E]" />
              <span>HALL / LAWN ZONE</span>
            </label>
            <select
              value={hallZone}
              onChange={(e) => setHallZone(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#DCD4C0] bg-[#FAF8F3] text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
            >
              <option value="Combined AC Hall & Garden Lawn">
                Combined AC Hall & Lawn
              </option>
              <option value="Suryavanshi Royal AC Banquet Hall">
                Suryavanshi Royal AC Hall
              </option>
              <option value="Open-Air Starlit Celebration Lawn">
                Open-Air Celebration Lawn
              </option>
              <option value="VIP Banquet & Bamboo Lounge">
                VIP Banquet & Bamboo Lounge
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EFECE4]">
          <button
            type="button"
            onClick={handleTickAll}
            className="px-3.5 py-1.5 rounded-full bg-[#132A1F] hover:bg-[#1E4432] text-[#E8C595] text-xs font-semibold transition-colors cursor-pointer"
          >
            Tick All ({totalItemsCount})
          </button>
          <button
            type="button"
            onClick={handleDefaultPreset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] hover:bg-[#E6DFCF] text-[#14281D] text-xs font-medium border border-[#DCD4C0] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Default Preset</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F7F4EC] text-[#5C6B62] text-xs font-medium border border-[#DCD4C0] transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Ornate Two-Page Interactive Wedding & Party Custom Menu Card */}
      <div
        className="rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl border-2 border-[#C59B61] relative overflow-hidden mb-8"
        style={{
          backgroundColor: '#15253B',
          backgroundImage:
            'radial-gradient(#D4A977 0.85px, transparent 0.85px), radial-gradient(#D4A977 0.85px, #15253B 0.85px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      >
        {/* Card Top Title Banner */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#E6B87D] font-semibold mb-1.5">
            TFC GARDEN • OFFICIAL WEDDING & BANQUET CHECKLIST CARD
          </p>
          <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-2">
            Interactive Wedding & Party Custom Menu Card ({tickedCount} Items
            Ticked)
          </h3>
          <p className="text-xs sm:text-sm text-[#C8D3E0]">
            Click any checkbox below to customise your Welcome Drinks, Live
            Snacks, Main Course, Salad Bar, Live Stalls, Roti, Desserts & Extra
            Décor
          </p>
        </div>

        {/* PAGE 01 ARCHED CREAM SHEET */}
        <div className="bg-[#FAF3E6] rounded-t-[48px] sm:rounded-t-[80px] rounded-b-2xl border-2 border-[#C89656] p-5 sm:p-8 lg:p-10 shadow-xl mb-8">
          <div className="text-center mb-6">
            <span className="text-xs sm:text-sm font-serif italic text-[#8A4224] font-semibold">
              ✦ Page 01 — Welcome Drinks, Live Snacks, Starters, Main Course &
              Extra Setup ✦
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {/* Page 1 Left Column */}
            <div>{page1Left.map((sec) => renderMenuSectionBlock(sec))}</div>

            {/* Page 1 Right Column */}
            <div>
              {/* Decorative Circular Brown & Gold Medallions matching Screenshot 6 */}
              <div className="flex items-center justify-center gap-5 mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#6B2D17] to-[#4A1C0C] border-2 border-[#E3AC69] shadow-md flex flex-col items-center justify-center text-center p-2">
                  <Sparkles className="w-4 h-4 text-[#F3C68F] mb-1" />
                  <span className="font-serif text-xs sm:text-sm text-[#FCE6C9] leading-tight font-semibold">
                    Royal Dry
                    <br />
                    Fruits
                  </span>
                </div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#6B2D17] to-[#4A1C0C] border-2 border-[#E3AC69] shadow-md flex flex-col items-center justify-center text-center p-2">
                  <Sparkles className="w-4 h-4 text-[#F3C68F] mb-1" />
                  <span className="font-serif text-xs sm:text-sm text-[#FCE6C9] leading-tight font-semibold">
                    Tandoori &
                    <br />
                    Shahi
                  </span>
                </div>
              </div>

              {page1Right.slice(0, 3).map((sec) => renderMenuSectionBlock(sec))}

              {/* Decorative Center Text before Extra-Fresh Fruit & Dhaba */}
              <div className="text-center my-4 py-2">
                <p className="font-serif text-base sm:text-lg text-[#7A2E18] font-semibold">
                  Extra-Fresh Fruit
                </p>
                <p className="font-serif text-sm sm:text-base text-[#7A2E18]">
                  Extra Punjabi Dhaba
                </p>
              </div>

              {page1Right.slice(3).map((sec) => renderMenuSectionBlock(sec))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#E4D3B8] flex items-center justify-between text-[11px] font-serif italic text-[#8A4224]">
            <span>❃ TFC Royal Banquet & Lawn</span>
            <span>100% Pure & Fresh Preparation ❃</span>
          </div>
        </div>

        {/* PAGE 02 ARCHED CREAM SHEET */}
        <div className="bg-[#FAF3E6] rounded-t-[48px] sm:rounded-t-[80px] rounded-b-2xl border-2 border-[#C89656] p-5 sm:p-8 lg:p-10 shadow-xl">
          <div className="text-center mb-6">
            <span className="text-xs sm:text-sm font-serif italic text-[#8A4224] font-semibold">
              ✦ Page 02 — Salad Bar, Live Stalls, Raita, Indian Breads, Lagan
              Phere & Sweet Desserts ✦
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Page 2 Left Column (5 cols) */}
            <div className="md:col-span-5">
              {page2Left.map((sec) => renderMenuSectionBlock(sec))}
            </div>

            {/* Page 2 Right Column (7 cols) */}
            <div className="md:col-span-7">
              {page2Right.map((sec) => renderMenuSectionBlock(sec))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#E4D3B8] flex items-center justify-between text-[11px] font-serif italic text-[#8A4224]">
            <span>❃ Customise Your Menu</span>
            <span>WhatsApp / Call: {settings.whatsapp} ❃</span>
          </div>
        </div>
      </div>

      {/* Dark Forest Green Summary Card ("Your Customised Wedding Hall Card Summary") */}
      <div className="bg-[#0F261C] text-white rounded-3xl p-5 sm:p-8 border border-[#244736] shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="px-3 py-1 rounded-full bg-[#D4A977] text-[#14281D] text-[10px] font-bold uppercase tracking-wider">
            {selectedPreset.title.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-[#8CD7A8]">
            {bookingDate} • {timeSlot} • {expectedGuests} Guests
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-3xl text-white font-normal mb-5">
          Your Customised Wedding Hall Card Summary ({tickedCount} Items
          Selected)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5 max-h-80 overflow-y-auto pr-1">
          {selectedBySection.map((sec) => (
            <div
              key={sec.id}
              className="rounded-xl bg-[#163326] border border-[#264D3B] p-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4A977] mb-1">
                {sec.title.toUpperCase()} ({sec.items.length})
              </p>
              <p className="text-xs text-[#D7E4DC] leading-relaxed">
                {sec.items.join(', ')}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Add any extra custom instructions, stage preferences, or ritual notes..."
            className="w-full px-4 py-3 rounded-xl bg-[#153024] border border-[#2B5440] text-xs sm:text-sm text-white placeholder-[#7FA18E] focus:outline-none focus:border-[#D4A977]"
          />

          <div className="w-full py-2.5 px-4 rounded-xl bg-[#1A3528] border border-[#2E5743] text-center text-xs font-medium text-[#E5C185]">
            Note: Booking will be confirmed after payment
          </div>

          <button
            type="button"
            onClick={() =>
              onBookWeddingCard({
                presetTitle: selectedPreset.title,
                bookingDate,
                timeSlot,
                expectedGuests,
                hallZone,
                selectedItemsCount: tickedCount,
                selectedBySection,
                customNotes,
              })
            }
            className="w-full py-3.5 px-6 rounded-xl bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>BOOK WITH SELECTED CARD ITEMS</span>
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-3 px-6 rounded-xl bg-[#1E6B43] hover:bg-[#185836] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Selected Card on WhatsApp ({settings.whatsapp})</span>
          </button>
        </div>
      </div>
    </section>
  );
}
