'use client';

import React, { useState } from 'react';
import { ResortSettings, GuestReview } from '@/lib/tfc-data';
import { SavedRecord } from '@/app/api/reservations/route';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  Phone,
  Calendar,
  Users,
  Sparkles,
  User,
  Settings,
  Star,
  Copy,
  Check,
  CreditCard,
  Wallet,
  Building2,
  Utensils,
  Bed,
  Leaf,
  Gift,
} from 'lucide-react';

export interface ActiveBookingModalPayload {
  type:
    | 'room'
    | 'bamboo'
    | 'wedding'
    | 'table'
    | 'delivery'
    | 'package'
    | 'appointment';
  title: string;
  subtitle?: string;
  amount: number;
  date?: string;
  timeSlot?: string;
  guests?: number | string;
  notes?: string;
  preferredMethod?: string;
}

interface BookingAndSettingsModalsProps {
  settings: ResortSettings;
  onUpdateSettings: (newSettings: ResortSettings) => void;
  activeBooking: ActiveBookingModalPayload | null;
  onCloseBooking: () => void;
  savedRecords: SavedRecord[];
  onRecordSaved: (rec: SavedRecord) => void;
  isProfileOpen: boolean;
  onCloseProfile: () => void;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  isReviewModalOpen: boolean;
  onCloseReviewModal: () => void;
  onAddReview: (rev: GuestReview) => void;
  isNavDrawerOpen: boolean;
  onCloseNavDrawer: () => void;
}

export default function BookingAndSettingsModals({
  settings,
  onUpdateSettings,
  activeBooking,
  onCloseBooking,
  savedRecords,
  onRecordSaved,
  isProfileOpen,
  onCloseProfile,
  isSettingsOpen,
  onCloseSettings,
  isReviewModalOpen,
  onCloseReviewModal,
  onAddReview,
  isNavDrawerOpen,
  onCloseNavDrawer,
}: BookingAndSettingsModalsProps) {
  // Booking modal state
  const [customerName, setCustomerName] = useState<string>(settings.userName);
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [customerEmail, setCustomerEmail] = useState<string>(
    settings.userEmail
  );
  const [bookingDate, setBookingDate] = useState<string>(
    activeBooking?.date || '2026-09-30'
  );
  const [guestsCount, setGuestsCount] = useState<string>(
    String(activeBooking?.guests || '2 Guests')
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    activeBooking?.preferredMethod || `Direct UPI Transfer (${settings.upiId})`
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedRecord, setConfirmedRecord] = useState<SavedRecord | null>(
    null
  );
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Settings form state
  const [formSettings, setFormSettings] = useState<ResortSettings>(settings);

  // Review form state
  const [revCategory, setRevCategory] =
    useState<GuestReview['category']>('Bamboo & Hut Stay');
  const [revHeadline, setRevHeadline] = useState<string>('');
  const [revQuote, setRevQuote] = useState<string>('');
  const [revAuthor, setRevAuthor] = useState<string>(settings.userName);
  const [revCity, setRevCity] = useState<string>('Sri Anandpur Sahib');

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeBooking.type,
          title: activeBooking.title,
          customerName,
          customerPhone,
          customerEmail,
          date: activeBooking.date || bookingDate,
          timeSlot: activeBooking.timeSlot || 'Standard Check-In (12:00 PM)',
          guests: activeBooking.guests || guestsCount,
          amount: activeBooking.amount,
          paymentMethod:
            activeBooking.amount === 0
              ? 'Free Table Reservation'
              : paymentMethod,
          paymentStatus:
            activeBooking.amount === 0 ? 'FREE_RESERVATION' : 'CONFIRMED',
          notes: activeBooking.notes || activeBooking.subtitle || '',
        }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setConfirmedRecord(data.record);
        onRecordSaved(data.record);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseBookingModal = () => {
    setConfirmedRecord(null);
    onCloseBooking();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revHeadline.trim() || !revQuote.trim()) return;
    const code = `TFC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRev: GuestReview = {
      id: `rev-${Date.now()}`,
      category: revCategory,
      badgeText: revCategory.toUpperCase(),
      headline: `“${revHeadline.replace(/^["“]|["”]$/g, '')}”`,
      quote: revQuote,
      author: revAuthor || 'Verified Guest',
      subtitle: `${revCity} • ${revCategory}`,
      verificationCode: code,
      date: 'September 2026',
      rating: 5,
    };
    onAddReview(newRev);
    setRevHeadline('');
    setRevQuote('');
    onCloseReviewModal();
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    onCloseSettings();
  };

  return (
    <>
      {/* 1. UNIVERSAL BOOKING & PAYMENT MODAL */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-[#14281D] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DEC9] my-8">
            <div className="bg-[#0F261C] text-white p-5 sm:p-6 flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#D4A977] text-[#14281D] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  {activeBooking.type.toUpperCase()} RESERVATION DESK
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                  {activeBooking.title}
                </h3>
                {activeBooking.subtitle && (
                  <p className="text-xs text-[#A9C2B5] mt-1">
                    {activeBooking.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseBookingModal}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmedRecord ? (
              <div className="p-6 space-y-4">
                <div className="rounded-2xl bg-[#EFF7F2] border border-[#B7DFC5] p-4 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#1E6B43] mx-auto mb-2" />
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#1E6B43] font-bold">
                    OFFICIAL BOOKING VOUCHER GENERATED
                  </p>
                  <h4 className="font-serif text-2xl font-bold text-[#14281D] mt-0.5">
                    Booking ID: {confirmedRecord.bookingCode}
                  </h4>
                  <p className="text-xs text-[#54635A] mt-1">
                    {confirmedRecord.title}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF8F3] border border-[#E5DEC9] p-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#68756D]">Guest Name:</span>
                    <span className="font-semibold">
                      {confirmedRecord.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756D]">Phone / WhatsApp:</span>
                    <span className="font-mono font-semibold">
                      {confirmedRecord.customerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756D]">Date / Slot:</span>
                    <span className="font-mono">
                      {confirmedRecord.date}{' '}
                      {confirmedRecord.timeSlot
                        ? `• ${confirmedRecord.timeSlot}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756D]">Total Amount:</span>
                    <span className="font-mono font-bold text-[#1E6B43]">
                      {confirmedRecord.amount && confirmedRecord.amount > 0
                        ? `₹${confirmedRecord.amount.toLocaleString('en-IN')}`
                        : '₹0 (Free Table Reservation)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756D]">Payment Mode:</span>
                    <span className="font-medium">
                      {confirmedRecord.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hello *${settings.name}*!\nHere is my official booking voucher:\n- *Booking ID:* ${confirmedRecord.bookingCode}\n- *Service:* ${confirmedRecord.title}\n- *Guest:* ${confirmedRecord.customerName} (${confirmedRecord.customerPhone})\n- *Date:* ${confirmedRecord.date}\n- *Amount:* ₹${confirmedRecord.amount || 0}\n- *Payment:* ${confirmedRecord.paymentMethod}`
                      );
                      window.open(
                        `https://wa.me/91${settings.whatsapp}?text=${msg}`,
                        '_blank'
                      );
                    }}
                    className="w-full py-3 px-5 rounded-xl bg-[#1E6B43] hover:bg-[#175435] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      Send Voucher on WhatsApp ({settings.whatsapp})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseBookingModal}
                    className="w-full py-2.5 px-5 rounded-xl bg-[#F3EFE4] hover:bg-[#E5DEC9] text-[#14281D] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Done & Return to TFC Garden
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBookingSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                      PHONE / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono text-[#14281D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                      CHECK-IN / EVENT DATE
                    </label>
                    <input
                      type="date"
                      value={activeBooking.date || bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                      GUESTS COUNT
                    </label>
                    <input
                      type="text"
                      value={activeBooking.guests || guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                    />
                  </div>
                </div>

                {activeBooking.amount > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1.5">
                      SELECT PAYMENT METHOD (BOOKING CONFIRMED AFTER PAYMENT)
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: `Direct UPI Transfer (${settings.upiId})`,
                          icon: <Wallet className="w-4 h-4 text-[#1E6B43]" />,
                          label: `Direct UPI ID: ${settings.upiId} (GPay, PhonePe, Paytm)`,
                        },
                        {
                          id: 'Credit / Debit Card or NetBanking',
                          icon: <CreditCard className="w-4 h-4 text-[#2563EB]" />,
                          label: 'Credit / Debit Card or Bank Transfer',
                        },
                        {
                          id: 'Pay at Resort / Cash on Delivery',
                          icon: <ShieldCheck className="w-4 h-4 text-[#9A6B3E]" />,
                          label: 'Pay at TFC Garden Reception / Cash on Delivery',
                        },
                      ].map((pm) => (
                        <label
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                            paymentMethod === pm.id
                              ? 'bg-[#EFF7F2] border-[#1E6B43] text-[#14281D]'
                              : 'bg-[#FAF8F3] border-[#E5DEC9] text-[#54635A]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === pm.id}
                            onChange={() => setPaymentMethod(pm.id)}
                            className="accent-[#1E6B43]"
                          />
                          {pm.icon}
                          <span className="flex-1">{pm.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* UPI Quick Copy Bar */}
                    <div className="mt-2.5 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F3EFE4] border border-[#E5DEC9] text-xs">
                      <span className="font-mono text-[#14281D]">
                        Official UPI: <strong>{settings.upiId}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="inline-flex items-center gap-1 text-[#1E6B43] font-semibold cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-[#0F261C] text-white p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#A9C2B5]">
                      TOTAL PAYABLE AMOUNT
                    </p>
                    <p className="font-mono text-xl font-bold text-[#E8C587]">
                      {activeBooking.amount > 0
                        ? `₹${activeBooking.amount.toLocaleString('en-IN')}`
                        : '₹0 (No Table Charge)'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-3 rounded-xl bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {submitting
                      ? 'Confirming...'
                      : activeBooking.amount > 0
                      ? 'Pay & Confirm Booking'
                      : 'Confirm Free Reservation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. SHARE YOUR EXPERIENCE (GUEST REVIEW MODAL) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#14281D] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5DEC9]">
            <div className="bg-[#0F261C] text-white p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4A977]">
                  VERIFIED GUEST STORY
                </p>
                <h3 className="font-serif text-xl text-white">
                  Share Your Experience at TFC Garden
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseReviewModal}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  EXPERIENCE CATEGORY
                </label>
                <select
                  value={revCategory}
                  onChange={(e) =>
                    setRevCategory(e.target.value as GuestReview['category'])
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                >
                  <option value="Bamboo & Hut Stay">Bamboo & Hut Stay</option>
                  <option value="Wedding & Celebration">
                    Wedding & Celebration
                  </option>
                  <option value="Family & AC Rooms">Family & AC Rooms</option>
                  <option value="Restaurant & Food Delivery">
                    Restaurant & Food Delivery
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    CITY / TOWN
                  </label>
                  <input
                    type="text"
                    required
                    value={revCity}
                    onChange={(e) => setRevCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  REVIEW HEADLINE *
                </label>
                <input
                  type="text"
                  required
                  value={revHeadline}
                  onChange={(e) => setRevHeadline(e.target.value)}
                  placeholder="e.g. Magical bamboo stay & delicious Turban Kitchen food"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  YOUR STORY *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revQuote}
                  onChange={(e) => setRevQuote(e.target.value)}
                  placeholder="Tell fellow guests about the bamboo huts, AC suites, wedding lawn, or food delivery..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#184A34] hover:bg-[#113625] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Star className="w-4 h-4 text-[#E8C587] fill-[#E8C587]" />
                <span>Publish Verified Guest Review</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. USER PROFILE & MY BOOKINGS MODAL ("Manjeet Singh") */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#14281D] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5DEC9]">
            <div className="bg-[#0F261C] text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#D4A977] text-[#14281D] font-serif font-bold text-lg flex items-center justify-center">
                  {settings.userName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white">
                    {settings.userName}
                  </h3>
                  <p className="text-xs text-[#A9C2B5]">{settings.userEmail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseProfile}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-serif text-lg font-semibold text-[#14281D]">
                  My Bookings, Orders & Reservations ({savedRecords.length})
                </h4>
                <span className="text-[11px] font-mono text-[#1E6B43] font-semibold">
                  ● Synced with Backend
                </span>
              </div>

              {savedRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl bg-[#FAF8F3] border border-[#E5DEC9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#184A34] text-white font-mono text-[10px] font-bold">
                        {rec.bookingCode}
                      </span>
                      <span className="text-[11px] font-semibold uppercase text-[#9A6B3E]">
                        {rec.type}
                      </span>
                    </div>
                    <h5 className="font-serif text-base font-semibold text-[#14281D]">
                      {rec.title}
                    </h5>
                    <p className="text-xs text-[#68756D]">
                      Date: {rec.date} • Guests: {rec.guests} •{' '}
                      {rec.paymentMethod}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-mono text-sm font-bold text-[#1E6B43]">
                      {rec.amount && rec.amount > 0
                        ? `₹${rec.amount.toLocaleString('en-IN')}`
                        : 'Free Reservation'}
                    </p>
                    <span className="inline-block text-[10px] font-mono text-[#1E6B43] font-semibold">
                      ✓ {rec.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. RESORT SETTINGS MODAL ("Settings") */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#14281D] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DEC9]">
            <div className="bg-[#0F261C] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-[#D4A977]" />
                <div>
                  <h3 className="font-serif text-xl text-white">
                    TFC Garden Concierge & Property Settings
                  </h3>
                  <p className="text-xs text-[#A9C2B5]">
                    Configure property contact details, WhatsApp hotline & UPI ID
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseSettings}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSettingsSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  RESORT BRAND NAME
                </label>
                <input
                  type="text"
                  value={formSettings.name}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  RESORT ADDRESS & LANDMARK
                </label>
                <input
                  type="text"
                  value={formSettings.address}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    WHATSAPP / MOBILE
                  </label>
                  <input
                    type="text"
                    value={formSettings.whatsapp}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        whatsapp: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    LANDLINE NUMBER
                  </label>
                  <input
                    type="text"
                    value={formSettings.landline}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        landline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    OFFICIAL EMAIL
                  </label>
                  <input
                    type="email"
                    value={formSettings.email}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    MERCHANT UPI ID
                  </label>
                  <input
                    type="text"
                    value={formSettings.upiId}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        upiId: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseSettings}
                  className="px-4 py-2 rounded-xl border border-[#DCD4C0] text-xs font-semibold text-[#54635A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#184A34] hover:bg-[#113625] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Property Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. QUICK NAVIGATION DRAWER (HAMBURGER MENU) */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-[#0F261C] text-white w-80 max-w-full h-full p-6 flex flex-col justify-between shadow-2xl border-l border-[#244736]">
            <div>
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#244736]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#184A34] border border-[#D4A977]/50 flex items-center justify-center font-serif text-xs font-bold text-[#D4A977]">
                    TFC
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold leading-none">
                      {settings.name}
                    </p>
                    <p className="text-[10px] text-[#D4A977] uppercase tracking-wider mt-0.5">
                      Sri Anandpur Sahib
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseNavDrawer}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {[
                  {
                    label: 'Signature Destinations',
                    href: '#destinations-section',
                    icon: <Sparkles className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Property Tour & Spaces',
                    href: '#property-tour-section',
                    icon: <Building2 className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Guest Reviews & Stories',
                    href: '#reviews-section',
                    icon: <Star className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Book Appointment / Visit Desk',
                    href: '#appointment-section',
                    icon: <Calendar className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: '4 Signature Room Categories',
                    href: '#rooms-section',
                    icon: <Bed className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Eco-Bamboo Huts & Cottages',
                    href: '#bamboo-sanctuary-section',
                    icon: <Leaf className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Interactive Wedding Menu Card',
                    href: '#wedding-card-section',
                    icon: <Sparkles className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Restaurant Table Reservation',
                    href: '#restaurant-section',
                    icon: <Utensils className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'Home Delivery Menu (3 km Free)',
                    href: '#delivery-menu-section',
                    icon: <Utensils className="w-4 h-4 text-[#D4A977]" />,
                  },
                  {
                    label: 'All-Inclusive Resort Packages',
                    href: '#packages-section',
                    icon: <Gift className="w-4 h-4 text-[#D4A977]" />,
                  },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onCloseNavDrawer}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#DCE7E0] hover:bg-[#183A2B] hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#244736] space-y-2">
              <a
                href={`https://wa.me/91${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#175435] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
              <a
                href={`tel:${settings.landline}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#163527] text-[#D4A977] text-xs font-mono flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {settings.landline}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
