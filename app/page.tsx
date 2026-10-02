'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  DEFAULT_SETTINGS,
  ResortSettings,
  PROPERTY_TOUR_ITEMS,
  GUEST_REVIEWS,
  GuestReview,
  ROOM_TYPES,
  RESORT_PACKAGES,
} from '@/lib/tfc-data';
import WeddingMenuCardSection from '@/components/WeddingMenuCardSection';
import RestaurantAndDeliverySection from '@/components/RestaurantAndDeliverySection';
import BookingAndSettingsModals, {
  ActiveBookingModalPayload,
} from '@/components/BookingAndSettingsModals';
import AuthModal from '@/components/AuthModal';
import { SavedRecord } from '@/app/api/reservations/route';
import {
  supabase,
  SUPABASE_SETUP_SQL,
  AuthUserProfile,
} from '@/lib/supabase';
import {
  auth as firebaseAuth,
  signOut as firebaseSignOut,
  testConnection as testFirebaseConnection,
  onAuthStateChanged,
} from '@/lib/firebase';
import {
  Bell,
  MessageCircle,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Utensils,
  Leaf,
  Bed,
  Calendar,
  Users,
  ArrowRight,
  Building2,
  Camera,
  Star,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Clock,
  Search,
  SlidersHorizontal,
  Eye,
  Wind,
  Maximize2,
  Check,
  Sun,
  Trees,
  Gift,
} from 'lucide-react';

export default function TfcGardenHomePage() {
  const [settings, setSettings] = useState<ResortSettings>(DEFAULT_SETTINGS);

  // Hero booking search state
  const [heroExperience, setHeroExperience] = useState<string>(
    'Hotel Rooms & Suites'
  );
  const [heroCheckIn, setHeroCheckIn] = useState<string>('2026-09-30');
  const [heroCheckOut, setHeroCheckOut] = useState<string>('2026-10-02');
  const [heroGuests, setHeroGuests] = useState<string>('2 Guests');

  // Property Tour filter state
  const [tourFilter, setTourFilter] = useState<string>('All Highlights');

  // Guest Reviews state
  const [reviews, setReviews] = useState<GuestReview[]>(GUEST_REVIEWS);
  const [reviewFilter, setReviewFilter] = useState<string>('All Experiences');
  const [reviewPageIndex, setReviewPageIndex] = useState<number>(0);

  // Appointment Form state
  const [apptName, setApptName] = useState<string>('');
  const [apptPhone, setApptPhone] = useState<string>('');
  const [apptEmail, setApptEmail] = useState<string>('');
  const [apptType, setApptType] = useState<string>(
    'Bamboo Room & Resort Stay Appointment'
  );
  const [apptDate, setApptDate] = useState<string>('2026-09-30');
  const [apptTime, setApptTime] = useState<string>(
    '02:00 PM Check-In / Visit'
  );
  const [apptGuests, setApptGuests] = useState<string>('2');
  const [apptNotes, setApptNotes] = useState<string>('');
  const [apptSaving, setApptSaving] = useState<boolean>(false);
  const [apptSuccessRecord, setApptSuccessRecord] =
    useState<SavedRecord | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // 4 Signature Rooms filter state
  const [roomSearch, setRoomSearch] = useState<string>('');
  const [roomCategoryFilter, setRoomCategoryFilter] =
    useState<string>('All Categories');
  const [roomMinGuests, setRoomMinGuests] = useState<number>(1);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);

  // Eco-Bamboo Sanctuary filter state
  const [bambooSearch, setBambooSearch] = useState<string>('');
  const [bambooCategoryFilter, setBambooCategoryFilter] =
    useState<string>('All Categories');

  // Packages filter state
  const [packageFilter, setPackageFilter] = useState<string>('All');

  // Modals & Saved Records state
  const [activeBooking, setActiveBooking] =
    useState<ActiveBookingModalPayload | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Login / Auth state
  const [authUser, setAuthUser] = useState<AuthUserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tfc_active_auth_user_v1');
        if (saved) return JSON.parse(saved) as AuthUserProfile;
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const applyAuthenticatedUser = (user: AuthUserProfile) => {
    setAuthUser(user);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tfc_active_auth_user_v1', JSON.stringify(user));
      } catch {
        // ignore storage errors
      }
    }
    setSettings((prev) => ({
      ...prev,
      userName: user.name,
      userEmail: user.email,
    }));
    setApptName((prev) => prev || user.name);
    setApptPhone((prev) => prev || user.phone);
    setApptEmail((prev) => prev || user.email);
  };

  const handleLogout = async () => {
    await firebaseSignOut(firebaseAuth).catch(() => {});
    await supabase.auth.signOut().catch(() => {});
    setAuthUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('tfc_active_auth_user_v1');
      } catch {
        // ignore storage errors
      }
    }
  };

  useEffect(() => {
    fetch('/api/reservations')
      .then((r) => r.json())
      .then((data) => {
        if (data.records) setSavedRecords(data.records);
      })
      .catch(() => {});

    // Test Firebase Firestore connection on initial boot
    testFirebaseConnection();

    // Listen to Firebase Auth state changes
    const unsubscribeFirebase = onAuthStateChanged(
      firebaseAuth,
      (firebaseUser) => {
        if (firebaseUser) {
          applyAuthenticatedUser({
            id: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split('@')[0] ||
              'Guest',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            role: 'guest',
          });
        }
      }
    );

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data?.session?.user) {
          const u = data.session.user;
          const meta = u.user_metadata || {};
          applyAuthenticatedUser({
            id: u.id,
            name:
              meta.full_name ||
              meta.name ||
              u.email?.split('@')[0] ||
              'Guest',
            email: u.email || '',
            phone: meta.phone || '',
            role: 'guest',
            supabaseAuthId: u.id,
          });
        }
      })
      .catch(() => {});

    return () => {
      unsubscribeFirebase();
    };
  }, []);

  const handleHeroAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroExperience === 'Eco-Bamboo Sanctuary') {
      document
        .getElementById('bamboo-sanctuary-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else if (heroExperience === 'Wedding & Party Banquet') {
      document
        .getElementById('wedding-card-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else if (heroExperience === 'Restaurant Table Reservation') {
      document
        .getElementById('restaurant-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document
        .getElementById('rooms-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Property Tour
  const filteredTourItems = useMemo(() => {
    if (tourFilter === 'All Highlights') return PROPERTY_TOUR_ITEMS;
    return PROPERTY_TOUR_ITEMS.filter((item) => item.category === tourFilter);
  }, [tourFilter]);

  // Filtered Guest Reviews
  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'All Experiences') return reviews;
    return reviews.filter((r) => r.category === reviewFilter);
  }, [reviews, reviewFilter]);

  const visibleReviewsPair = useMemo(() => {
    if (filteredReviews.length === 0) return [];
    const firstIdx = reviewPageIndex % filteredReviews.length;
    const secondIdx = (reviewPageIndex + 1) % filteredReviews.length;
    if (filteredReviews.length === 1) return [filteredReviews[0]];
    return [filteredReviews[firstIdx], filteredReviews[secondIdx]];
  }, [filteredReviews, reviewPageIndex]);

  // Appointment Form Submission (Saves directly to Supabase backend)
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptName.trim() || !apptPhone.trim()) return;
    setApptSaving(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'appointment',
          title: apptType,
          customerName: apptName,
          customerPhone: apptPhone,
          customerEmail: apptEmail,
          date: apptDate,
          timeSlot: apptTime,
          guests: apptGuests,
          amount: 0,
          paymentMethod: 'Pay at Resort / Concierge Desk',
          paymentStatus: 'CONFIRMED',
          notes: apptNotes,
        }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        let finalRecord: SavedRecord = data.record;

        // Client-side fallback insert if server-side didn't already sync
        if (!data.supabaseSynced) {
          const { error: clientInsertErr } = await supabase
            .from('appointments')
            .insert([
              {
                booking_code: finalRecord.bookingCode,
                full_name: apptName,
                phone: apptPhone,
                email: apptEmail,
                appointment_type: apptType,
                preferred_date: apptDate,
                preferred_time: apptTime,
                guests_count: parseInt(apptGuests, 10) || 2,
                special_requests: apptNotes,
                status: 'CONFIRMED',
              },
            ]);
          if (!clientInsertErr) {
            finalRecord = {
              ...finalRecord,
              supabaseSynced: true,
              supabaseTable: 'public.appointments',
            };
          }
        }

        setApptSuccessRecord(finalRecord);
        setSavedRecords((prev) => [finalRecord, ...prev]);
        setApptName('');
        setApptPhone('');
        setApptNotes('');
      }
    } finally {
      setApptSaving(false);
    }
  };

  // Filtered 4 Signature Rooms
  const filteredRooms = useMemo(() => {
    return ROOM_TYPES.filter((room) => {
      if (
        roomCategoryFilter !== 'All Categories' &&
        room.shortCategory !== roomCategoryFilter
      ) {
        return false;
      }
      if (room.maxGuests < roomMinGuests) {
        return false;
      }
      if (roomSearch.trim()) {
        const q = roomSearch.toLowerCase();
        return (
          room.name.toLowerCase().includes(q) ||
          room.viewText.toLowerCase().includes(q) ||
          room.description.toLowerCase().includes(q) ||
          room.facilities.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [roomCategoryFilter, roomMinGuests, roomSearch]);

  // Filtered Bamboo Sanctuary Rooms
  const filteredBambooRooms = useMemo(() => {
    return ROOM_TYPES.filter((r) => r.isBambooSanctuary).filter((room) => {
      if (
        bambooCategoryFilter !== 'All Categories' &&
        room.shortCategory !== bambooCategoryFilter
      ) {
        return false;
      }
      if (bambooSearch.trim()) {
        const q = bambooSearch.toLowerCase();
        return (
          room.name.toLowerCase().includes(q) ||
          room.viewText.toLowerCase().includes(q) ||
          room.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bambooCategoryFilter, bambooSearch]);

  // Filtered Packages
  const filteredPackages = useMemo(() => {
    if (packageFilter === 'All') return RESORT_PACKAGES;
    return RESORT_PACKAGES.filter((p) => p.filterCategory === packageFilter);
  }, [packageFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#14281D]">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#0F261C] text-[#E6C587] px-3 py-2 text-[11px] sm:text-xs border-b border-[#224735]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Bell className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
          <p className="truncate sm:whitespace-normal">
            <strong className="text-white font-semibold">
              Welcome to {settings.name} ({settings.address}):
            </strong>{' '}
            Handcrafted Eco Bamboo Huts, Luxury AC Suites, Grand Wedding Banquet
            Halls & Free Restaurant Table Reservations.
          </p>
        </div>
      </div>

      {/* 2. STICKY TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#E5DEC9] px-3 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left Brand Emblem + Title */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#133224] border border-[#D4A977]/40 flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-serif text-xs sm:text-sm font-bold tracking-wider text-[#D4A977]">
                TFC
              </span>
            </div>
            <div className="min-w-0">
              <span className="block font-serif text-lg sm:text-2xl font-normal tracking-tight text-[#14281D] leading-none truncate">
                {settings.name}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8C6D46] mt-1 truncate">
                {settings.address}
              </span>
            </div>
          </a>

          {/* Right Action Controls matching screenshots */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href={`https://wa.me/91${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-[#1E6B43] hover:bg-[#175435] text-white text-[11px] sm:text-xs font-mono font-semibold transition-colors whitespace-nowrap shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>

            {authUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-[#0F261C] hover:bg-[#183B2B] text-[#E8C587] border border-[#D4A977]/40 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                  <User className="w-3.5 h-3.5 text-[#D4A977]" />
                  <span className="max-w-[100px] sm:max-w-[140px] truncate">
                    {authUser.name}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white hover:bg-red-50 text-[#8B2626] border border-[#DCD4C0] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-[#0F261C] hover:bg-[#183B2B] text-[#E8C587] border border-[#D4A977]/40 text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0 text-[#D4A977]" />
                  <span>Sign Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F3EFE4] text-[#14281D] border border-[#DCD4C0] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#68756D]" />
                  <span>My Bookings</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#112A1F] hover:bg-[#1A3D2D] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0E241B] text-white pt-16 sm:pt-24 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Photo + Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tfc_hero_top_sanctuary.jpg?v=1"
            alt="TFC Garden Luxury Resort Courtyard & Bamboo Sanctuary at Twilight"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D211A]/80 via-[#0E241B]/55 to-[#0B1E16]/90" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Translucent Location Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A412A]/80 backdrop-blur-xs border border-[#D4A977]/40 text-[#F2D29B] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A977]" />
            <span>TFC GARDEN • {settings.address}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.08] tracking-tight max-w-3xl mb-4">
            Where Woven Bamboo Meets Timeless Highland Luxury.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-[#DCE7E0] max-w-2xl leading-relaxed mb-6">
            Experience {settings.name} in {settings.address} — featuring
            handcrafted bamboo garden huts, climate-crafted AC suites, grand
            wedding banquet halls, The Turban Kitchen Restaurant, and outdoor
            fun zone.
          </p>

          {/* Contact Info Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-[#E5ECE8] mb-7">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4A977] shrink-0" />
              <span>{settings.address}</span>
            </div>
            <a
              href={`https://wa.me/91${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#6EE7B7] font-mono font-semibold hover:underline"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>
            <a
              href={`tel:${settings.landline}`}
              className="flex items-center gap-1.5 font-mono font-semibold text-white hover:text-[#D4A977]"
            >
              <Phone className="w-4 h-4 text-[#D4A977] shrink-0" />
              <span>Call / Landline: {settings.landline}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1.5 font-mono text-[#E5ECE8] hover:text-[#D4A977]"
            >
              <Mail className="w-4 h-4 text-[#D4A977] shrink-0" />
              <span>{settings.email}</span>
            </a>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href="#bamboo-sanctuary-section"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] font-semibold text-xs sm:text-sm transition-colors shadow-md"
            >
              <Leaf className="w-4 h-4" />
              <span>Explore Bamboo Sanctuary</span>
            </a>
            <a
              href="#rooms-section"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/30 text-white font-semibold text-xs sm:text-sm transition-colors"
            >
              <Bed className="w-4 h-4" />
              <span>Browse All 4 Room Types</span>
            </a>
          </div>

          {/* Interactive White Availability Search Widget */}
          <form
            onSubmit={handleHeroAvailabilitySubmit}
            className="bg-white text-[#14281D] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#E5DEC9]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1.5">
                  EXPERIENCE TYPE
                </label>
                <select
                  value={heroExperience}
                  onChange={(e) => setHeroExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-medium text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                >
                  <option value="Hotel Rooms & Suites">
                    Hotel Rooms & Suites
                  </option>
                  <option value="Eco-Bamboo Sanctuary">
                    Eco-Bamboo Sanctuary
                  </option>
                  <option value="Wedding & Party Banquet">
                    Wedding & Party Banquet
                  </option>
                  <option value="Restaurant Table Reservation">
                    Restaurant Table Reservation
                  </option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9A6B3E]" />
                  <span>CHECK-IN / EVENT DATE</span>
                </label>
                <input
                  type="date"
                  value={heroCheckIn}
                  onChange={(e) => setHeroCheckIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9A6B3E]" />
                  <span>CHECK-OUT DATE</span>
                </label>
                <input
                  type="date"
                  value={heroCheckOut}
                  onChange={(e) => setHeroCheckOut(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1.5">
                  <Users className="w-3.5 h-3.5 text-[#9A6B3E]" />
                  <span>GUESTS COUNT</span>
                </label>
                <select
                  value={heroGuests}
                  onChange={(e) => setHeroGuests(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="5 Family Guests">5 Family Guests</option>
                  <option value="100–500 Banquet Guests">
                    100–500 Banquet Guests
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#184A34] hover:bg-[#123827] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>CHECK AVAILABILITY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 4. DISCOVER OUR SIGNATURE DESTINATIONS */}
      <section
        id="destinations-section"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
              COMPLETE HOSPITALITY ECOSYSTEM
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight">
              Discover Our Signature Destinations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#54635A] max-w-md">
            Seamless online booking with instant Booking IDs and WhatsApp
            Concierge vouchers.{' '}
            <strong className="text-[#14281D]">
              Booking will be confirmed after payment.
            </strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Couple & Family AC Rooms',
              kicker: 'From ₹2,499 / night',
              footerText: 'Couple Room (₹2,499) & Family Room (₹4,999)',
              image: '/images/luxury_ac_bedroom.jpg',
              href: '#rooms-section',
              icon: <Bed className="w-4 h-4 text-[#D4A977]" />,
            },
            {
              title: 'Bamboo Room & Hut Room',
              kicker: 'From ₹3,999 / night',
              footerText: 'Garden Hut Room & Eco Bamboo Room (₹3,999)',
              image: '/images/bamboo_hut_night.jpg',
              href: '#bamboo-sanctuary-section',
              icon: <Leaf className="w-4 h-4 text-[#D4A977]" />,
            },
            {
              title: 'Party & Wedding Booking',
              kicker: 'Party & Grand Wedding Packages',
              footerText: 'Party Booking & Grand Wedding Booking',
              image: '/images/wedding_stage_decor.jpg',
              href: '#wedding-card-section',
              icon: <Building2 className="w-4 h-4 text-[#D4A977]" />,
            },
            {
              title: 'The Turban Kitchen Restaurant',
              kicker: 'Zero Table Charge • 14 Tables',
              footerText: 'Free Table Reservation Across 6 Dining Zones',
              image: '/images/restaurant_vip_dining.jpg',
              href: '#restaurant-section',
              icon: <Utensils className="w-4 h-4 text-[#D4A977]" />,
            },
          ].map((dest) => (
            <a
              key={dest.title}
              href={dest.href}
              className="group rounded-2xl overflow-hidden bg-white border border-[#E5DEC9] shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#132A1F]">
                <img
                  src={dest.image}
                  alt={dest.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-xl bg-[#112A1F]/85 backdrop-blur-xs border border-white/15 flex items-center justify-center">
                  {dest.icon}
                </div>
                <div className="absolute bottom-3.5 left-4 right-4">
                  <p className="font-mono text-[11px] text-[#E6C587] mb-0.5">
                    {dest.kicker}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                    {dest.title}
                  </h3>
                </div>
              </div>
              <div className="px-4 py-3.5 flex items-center justify-between text-xs sm:text-sm text-[#54635A] group-hover:text-[#14281D]">
                <span className="truncate pr-2">{dest.footerText}</span>
                <ArrowRight className="w-4 h-4 text-[#184A34] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. EXPLORE OUR SPACES: PROPERTY TOUR */}
      <section
        id="property-tour-section"
        className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>TFC GARDEN PROPERTY TOUR</span>
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-5">
            Explore Our Spaces: AC Rooms, Banquet, Restaurant, Fun Zone & Bamboo
            Huts
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              'All Highlights',
              'AC Rooms & Suites',
              'Bamboo Huts',
              'Banquet & Wedding Halls',
              'Restaurant & Dining',
              'Garden & Fun Zone',
            ].map((tab) => {
              const active = tourFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTourFilter(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#112A1F] text-white'
                      : 'bg-white text-[#4A5950] border border-[#DCD4C0] hover:bg-[#F3EFE4]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredTourItems.map((item) => (
            <a
              key={item.id}
              href={item.targetSection}
              className="group rounded-2xl overflow-hidden bg-white border border-[#E5DEC9] shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#132A1F]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-[#112A1F]/85 backdrop-blur-xs text-[#E8C587] text-[10px] font-mono font-bold uppercase tracking-wider">
                  {item.badgeText}
                </span>
                <div className="absolute bottom-3.5 left-4 right-4">
                  <h3 className="font-serif text-lg sm:text-xl text-white font-semibold">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-3 text-xs text-[#54635A]">
                <p className="leading-relaxed">{item.description}</p>
                <ArrowRight className="w-4 h-4 text-[#184A34] shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 6. WORDS FROM OUR GUESTS AT TFC GARDEN */}
      <section
        id="reviews-section"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOMER EXPERIENCES & VERIFIED GUEST STORIES</span>
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-2">
            Words From Our Guests at TFC Garden
          </h2>
          <p className="text-sm sm:text-base text-[#54635A] max-w-2xl mb-5">
            Read authentic text-based testimonials from families, wedding hosts,
            couples, and diners who experienced TFC Garden in Sri Anandpur
            Sahib.
          </p>

          {/* Rating Badge + Share Your Experience Button */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EFE4] border border-[#E5DEC9]">
              <div className="flex items-center gap-0.5 text-[#D9822B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D9822B]" />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-[#14281D]">
                4.9 / 5.0
              </span>
              <span className="text-xs text-[#68756D]">
                ({reviews.length} Verified Reviews)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#112A1F] hover:bg-[#1C3F2F] text-[#E8C587] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>SHARE YOUR EXPERIENCE</span>
            </button>
          </div>

          {/* Filter Tabs + Carousel Pagination Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5DEC9]">
            <div className="flex flex-wrap items-center gap-2">
              {[
                'All Experiences',
                'Bamboo & Hut Stay',
                'Wedding & Celebration',
                'Family & AC Rooms',
                'Restaurant & Dining',
              ].map((tab) => {
                const active = reviewFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setReviewFilter(tab);
                      setReviewPageIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#112A1F] text-white'
                        : 'bg-white text-[#4A5950] border border-[#DCD4C0] hover:bg-[#F3EFE4]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#68756D]">
                {((reviewPageIndex % filteredReviews.length) + 1) || 1} /{' '}
                {filteredReviews.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setReviewPageIndex((prev) =>
                    prev === 0 ? filteredReviews.length - 1 : prev - 1
                  )
                }
                className="w-8 h-8 rounded-full bg-white border border-[#DCD4C0] flex items-center justify-center text-[#14281D] hover:bg-[#F3EFE4] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setReviewPageIndex(
                    (prev) => (prev + 1) % Math.max(1, filteredReviews.length)
                  )
                }
                className="w-8 h-8 rounded-full bg-[#112A1F] text-white flex items-center justify-center hover:bg-[#1C3F2F] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2 Stacked Review Cards matching Screenshot 10 */}
        <div className="space-y-5">
          {visibleReviewsPair[0] && (
            <div className="rounded-3xl bg-[#0F261C] text-white p-6 sm:p-8 border border-[#244736] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md bg-[#2A3F2B] border border-[#546E42] text-[#E8C587] text-[10px] font-mono font-bold uppercase tracking-wider">
                  {visibleReviewsPair[0].badgeText}
                </span>
                <div className="flex items-center gap-1 text-[#E8C587]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E8C587]" />
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <Quote className="w-7 h-7 text-[#6E8B7B] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold mb-2">
                    {visibleReviewsPair[0].headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C8D8CF] leading-relaxed">
                    {visibleReviewsPair[0].quote}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#214233] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-serif text-sm sm:text-base font-semibold text-[#E8C587]">
                    {visibleReviewsPair[0].author}
                  </p>
                  <p className="text-[11px] text-[#9BB2A5]">
                    {visibleReviewsPair[0].subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#163829] border border-[#2C5E47] text-[#6EE7B7] font-mono text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>
                      Verified: {visibleReviewsPair[0].verificationCode}
                    </span>
                  </span>
                  <span className="text-xs text-[#9BB2A5]">
                    {visibleReviewsPair[0].date}
                  </span>
                </div>
              </div>
            </div>
          )}

          {visibleReviewsPair[1] && (
            <div className="rounded-3xl bg-[#F3EFE4] text-[#14281D] p-6 sm:p-8 border border-[#E5DEC9]">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-md bg-white border border-[#DCD4C0] text-[#68756D] text-[10px] font-mono font-bold uppercase tracking-wider">
                  {visibleReviewsPair[1].badgeText}
                </span>
                <div className="flex items-center gap-1 text-[#D9822B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D9822B]" />
                  ))}
                </div>
              </div>

              <h3 className="font-serif text-lg sm:text-xl text-[#14281D] font-semibold mb-2">
                {visibleReviewsPair[1].headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#54635A] leading-relaxed mb-4">
                {visibleReviewsPair[1].quote}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E4DEC9]">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#14281D]">
                    {visibleReviewsPair[1].author}
                  </p>
                  <p className="text-[11px] text-[#68756D]">
                    {visibleReviewsPair[1].subtitle}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[#1E6B43] font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{visibleReviewsPair[1].verificationCode}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {filteredReviews.map((r, idx) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setReviewPageIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === reviewPageIndex % filteredReviews.length
                  ? 'w-6 bg-[#9A6B3E]'
                  : 'w-1.5 bg-[#D4CBB8]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 7. BOOK AN APPOINTMENT OR RESORT RESERVATION */}
      <section
        id="appointment-section"
        className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="rounded-3xl overflow-hidden border border-[#DCD4C0] shadow-xl bg-white">
          {/* Dark Green Top Header */}
          <div className="bg-[#0F261C] text-white p-6 sm:p-8">
            <p className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A977] mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>INSTANT RESERVATION & VISIT DESK</span>
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-2">
              Book an Appointment or The Turban Kitchen Restaurant Reservation
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C7BE] max-w-2xl mb-5">
              Schedule a wedding banquet walkthrough, reserve a bamboo cottage
              or AC room, or book a family dining table. Your appointment
              details are saved directly to our backend database.
            </p>

            <div className="space-y-1.5 text-xs text-[#DCE7E0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A977]" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#D4A977]" />
                <span>
                  WhatsApp: {settings.whatsapp} • Landline: {settings.landline}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6EE7B7] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Booking will be confirmed after payment</span>
              </div>
            </div>
          </div>

          {/* White Form Body */}
          <form onSubmit={handleAppointmentSubmit} className="p-6 sm:p-8 space-y-4">
            {apptSuccessRecord && (
              <div className="rounded-2xl bg-[#EFF7F2] border border-[#B7DFC5] p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1E6B43]">
                      ✓ Appointment Saved to Supabase Backend (ID:{' '}
                      {apptSuccessRecord.bookingCode})
                    </p>
                    <p className="text-xs text-[#54635A] mt-0.5">
                      {apptSuccessRecord.title} • {apptSuccessRecord.date} (
                      {apptSuccessRecord.timeSlot})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApptSuccessRecord(null)}
                    className="text-xs font-semibold text-[#1E6B43] underline cursor-pointer shrink-0"
                  >
                    Dismiss
                  </button>
                </div>

                {!apptSuccessRecord.supabaseSynced && (
                  <div className="rounded-xl bg-white/90 border border-[#DCD4C0] p-3 text-xs text-[#14281D] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#54635A]">
                      First-time Supabase setup: Run the table creation SQL once
                      in your Supabase SQL Editor (Project:{' '}
                      <strong className="font-mono text-[#14281D]">
                        nnoqydcdyoenfvnuvlhf
                      </strong>
                      ).
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#184A34] hover:bg-[#113625] text-white text-[11px] font-semibold cursor-pointer shrink-0"
                    >
                      {copiedSql
                        ? '✓ SQL Copied to Clipboard'
                        : 'Copy Supabase Table SQL'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={apptName}
                  onChange={(e) => setApptName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  PHONE / WHATSAPP NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={apptPhone}
                  onChange={(e) => setApptPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono text-[#14281D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={apptEmail}
                  onChange={(e) => setApptEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  APPOINTMENT / SERVICE TYPE *
                </label>
                <select
                  value={apptType}
                  onChange={(e) => setApptType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                >
                  <option value="Bamboo Room & Resort Stay Appointment">
                    Bamboo Room & Resort Stay Appointment
                  </option>
                  <option value="Wedding & Banquet Hall Walkthrough">
                    Wedding & Banquet Hall Walkthrough
                  </option>
                  <option value="Couple / Family AC Suite Reservation">
                    Couple / Family AC Suite Reservation
                  </option>
                  <option value="VIP Dining & Family Table Visit">
                    VIP Dining & Family Table Visit
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  PREFERRED DATE *
                </label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  PREFERRED TIME *
                </label>
                <select
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
                >
                  <option value="11:00 AM Morning Visit">
                    11:00 AM Morning Visit
                  </option>
                  <option value="02:00 PM Check-In / Visit">
                    02:00 PM Check-In / Visit
                  </option>
                  <option value="05:00 PM Evening Walkthrough">
                    05:00 PM Evening Walkthrough
                  </option>
                  <option value="07:30 PM Dinner & Consultation">
                    07:30 PM Dinner & Consultation
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  GUESTS COUNT
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={apptGuests}
                  onChange={(e) => setApptGuests(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm font-mono text-[#14281D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                SPECIAL REQUESTS OR EVENT NOTES
              </label>
              <input
                type="text"
                value={apptNotes}
                onChange={(e) => setApptNotes(e.target.value)}
                placeholder="Any specific room preference, wedding date inquiry, or dietary requirement..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={apptSaving}
                className="flex-1 min-w-[220px] py-3.5 px-6 rounded-xl bg-[#184A34] hover:bg-[#113625] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {apptSaving
                    ? 'Saving Appointment...'
                    : 'Confirm Appointment & Save Reservation'}
                </span>
              </button>
              <a
                href={`https://wa.me/91${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-5 rounded-xl bg-[#1E6B43] hover:bg-[#175435] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk: {settings.whatsapp}</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* 8. 4 SIGNATURE ROOM CATEGORIES: BAMBOO ROOM, HUT ROOM, COUPLE ROOM & FAMILY ROOM */}
      <section
        id="rooms-section"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
              4 SIGNATURE ROOM CATEGORIES • TFC GARDEN
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-3">
              Bamboo Room, Hut Room, Couple Room & Family Room
            </h2>
            <p className="text-sm sm:text-base text-[#54635A] max-w-2xl">
              Choose from our 4 signature accommodations: handcrafted Eco Bamboo
              Room, standalone Garden Hut Room (Heart Hut), Luxury AC Couple
              Room, and Spacious AC Family Room.{' '}
              <strong className="text-[#9A6B3E]">
                Booking will be confirmed after payment.
              </strong>
            </p>
          </div>

          {/* Min Guests & Available Now Box */}
          <div className="bg-[#F3EFE4] border border-[#E5DEC9] rounded-2xl p-4 flex flex-col gap-2.5 shrink-0 min-w-[230px]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[#54635A] font-medium">
                <Users className="w-3.5 h-3.5 text-[#9A6B3E]" />
                <span>Min Guests:</span>
              </span>
              <select
                value={roomMinGuests}
                onChange={(e) => setRoomMinGuests(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#DCD4C0] text-xs font-semibold text-[#14281D]"
              >
                <option value={1}>1+ Guests</option>
                <option value={2}>2+ Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#14281D] cursor-pointer">
              <input
                type="checkbox"
                checked={availableNowOnly}
                onChange={(e) => setAvailableNowOnly(e.target.checked)}
                className="accent-[#184A34] rounded"
              />
              <span>Available Now Only</span>
            </label>
          </div>
        </div>

        {/* Search & Category Filter Card */}
        <div className="bg-[#F3EFE4] border border-[#E5DEC9] rounded-2xl p-4 sm:p-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#8A948E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                placeholder="Search hotel rooms by name, view, category, or amenities (e.g., Jacuzzi, Balcony, Butler)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCD4C0] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
              />
            </div>
            <span className="text-xs font-mono text-[#54635A]">
              Showing <strong>{filteredRooms.length}</strong> of{' '}
              <strong>{ROOM_TYPES.length}</strong> rooms
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#68756D] mb-2">
            <SlidersHorizontal className="w-3 h-3 text-[#9A6B3E]" />
            <span>FILTER BY ROOM CATEGORY</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Categories', count: 4 },
              { label: 'Bamboo Room', count: 1 },
              { label: 'Hut Room', count: 1 },
              { label: 'Couple Room', count: 1 },
              { label: 'Family Room', count: 1 },
            ].map((cat) => {
              const active = roomCategoryFilter === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setRoomCategoryFilter(cat.label)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#184A34] text-white'
                      : 'bg-white text-[#4A5950] border border-[#DCD4C0] hover:bg-[#FAF8F3]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F3EFE4] text-[#68756D]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl overflow-hidden bg-white border border-[#E5DEC9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[#132A1F]">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15" />

                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-[#112A1F]/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {room.badge}
                  </span>
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded bg-[#1E6B43] text-white text-[10px] font-mono font-bold">
                    {room.availabilityText}
                  </span>

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-[#E5ECE8]">
                      <Eye className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                      <span className="truncate">{room.viewText}</span>
                    </span>
                    <div className="text-right shrink-0">
                      <span className="block text-[9px] uppercase tracking-wider text-[#D0DCD5]">
                        PER NIGHT
                      </span>
                      <span className="font-mono text-lg sm:text-xl font-bold text-white">
                        ₹{room.pricePerNight.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#14281D] font-normal mb-1.5">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#54635A] leading-relaxed mb-4">
                    {room.description}
                  </p>

                  {/* Specs Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EFECE4] mb-4 text-xs text-[#14281D]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#9A6B3E] shrink-0" />
                      <span className="truncate">Up to {room.maxGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#9A6B3E] shrink-0" />
                      <span className="truncate">{room.climateText}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Maximize2 className="w-3.5 h-3.5 text-[#9A6B3E] shrink-0" />
                      <span>{room.sqft} sq.ft</span>
                    </div>
                  </div>

                  {/* Room Facilities */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#68756D] mb-2">
                    ROOM FACILITIES
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-5">
                    {room.facilities.map((fac) => (
                      <div
                        key={fac}
                        className="flex items-center gap-1.5 text-xs text-[#54635A]"
                      >
                        <Check className="w-3.5 h-3.5 text-[#1E6B43] shrink-0" />
                        <span className="truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <button
                  type="button"
                  onClick={() =>
                    setActiveBooking({
                      type: 'room',
                      title: room.name,
                      subtitle: `${room.viewText} • ${room.climateText}`,
                      amount: room.pricePerNight,
                      guests: `${room.maxGuests} Guests`,
                    })
                  }
                  className="w-full py-3 px-5 rounded-xl bg-[#184A34] hover:bg-[#113625] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HAND-WOVEN BAMBOO ROOMS & GARDEN COTTAGES (DARK FOREST GREEN SECTION) */}
      <section
        id="bamboo-sanctuary-section"
        className="bg-[#0E241B] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#214233]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight max-w-3xl mb-4">
            Hand-Woven Bamboo Rooms & Garden Cottages
          </h2>
          <p className="text-sm sm:text-base text-[#B8C7BE] max-w-2xl leading-relaxed mb-8">
            Crafted from sustainably harvested Guadua bamboo, our
            cathedral-ceiling cottages blend zero-carbon organic craftsmanship
            with whisper-quiet Eco-AC climate comfort.
          </p>

          {/* 4 Feature Boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
            {[
              {
                icon: <Wind className="w-4 h-4 text-[#D4A977]" />,
                title: 'Full AC Eco-Cooling',
                desc: 'Whisper-quiet split AC climate comfort',
              },
              {
                icon: <Trees className="w-4 h-4 text-[#D4A977]" />,
                title: 'Lush Garden View',
                desc: 'Private spice garden & lotus pond decks',
              },
              {
                icon: <Users className="w-4 h-4 text-[#D4A977]" />,
                title: 'Family Cottages',
                desc: 'Bi-level bamboo villas for up to 6 guests',
              },
              {
                icon: <Sun className="w-4 h-4 text-[#D4A977]" />,
                title: 'Stay Packages',
                desc: 'Includes Ayurvedic spa & bonfire dining',
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl bg-[#142E22] border border-[#264D3B] p-4"
              >
                <div className="mb-2">{feat.icon}</div>
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-[#9BB2A5] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 2 Large Stacked Showcase Images matching Screenshot 8 */}
          <div className="space-y-4 mb-12">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#264D3B]">
              <img
                src="/images/bamboo_huts_evening_walkway.jpg?v=3"
                alt="TFC Handcrafted Garden Bamboo Huts • Evening Walkway"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-xs font-medium">
                TFC Handcrafted Garden Bamboo Huts • Evening Walkway
              </span>
            </div>

            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#264D3B]">
              <img
                src="/images/bamboo_room_interior.jpg?v=3"
                alt="Cathedral Bamboo Interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-xs font-medium">
                Cathedral Bamboo Interior
              </span>
            </div>
          </div>

          {/* Select Your Eco-Bamboo Residence Header & Filter Box */}
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Select Your Eco-Bamboo Residence
              </h3>
              <p className="text-xs text-[#9BB2A5]">
                Search by bamboo sanctuary name, view, or amenities, and filter
                by category.
              </p>
            </div>
            <span className="font-mono text-xs text-[#9BB2A5]">
              Showing <strong className="text-white">2</strong> of{' '}
              <strong className="text-white">2</strong> bamboo stays
            </span>
          </div>

          <div className="rounded-2xl bg-[#142E22] border border-[#264D3B] p-4 sm:p-5 mb-8">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-[#849E8F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bambooSearch}
                onChange={(e) => setBambooSearch(e.target.value)}
                placeholder="Search bamboo rooms & cottages by name, view, or feature (e.g., Garden View, Veranda, Heart Hut)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F241B] border border-[#29503D] text-xs sm:text-sm text-white placeholder-[#7B9687] focus:outline-none focus:border-[#D4A977]"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB2A5] mb-1.5">
                  BAMBOO CATEGORY
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'All Categories', count: 2 },
                    { label: 'Bamboo Room', count: 1 },
                    { label: 'Hut Room', count: 1 },
                  ].map((cat) => {
                    const active = bambooCategoryFilter === cat.label;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setBambooCategoryFilter(cat.label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#D4A977] text-[#14281D]'
                            : 'bg-[#183628] text-[#C6D6CD] border border-[#29503D]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="px-1.5 py-0.2 rounded bg-black/15 text-[10px] font-mono">
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 2 Bamboo Sanctuary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredBambooRooms.map((room) => {
              return (
                <div
                  key={room.id}
                  className="rounded-2xl overflow-hidden bg-[#142E22] border border-[#29503D] flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#142E22] via-black/30 to-transparent" />

                      <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-[#D4A977] text-[#14281D] text-[10px] font-mono font-bold uppercase">
                        {room.badge}
                      </span>
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded bg-black/75 text-white text-[10px] font-mono font-semibold">
                        {room.cottageCountText || '4 Cottages Open'}
                      </span>

                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-[#E8C587]">
                            {room.subtitleTag}
                          </p>
                          <h4 className="font-serif text-xl sm:text-2xl text-white font-normal">
                            {room.name}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-[10px] text-[#B8C7BE]">
                            Per Night
                          </span>
                          <span className="font-mono text-xl font-bold text-[#E8C587]">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-[#C6D6CD] leading-relaxed mb-4">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#DCE7E0] mb-4">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#D4A977]" />
                          <span>Up to {room.maxGuests} Guests</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#D4A977]" />
                          <span>{room.viewText}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono">
                          <Maximize2 className="w-3.5 h-3.5 text-[#D4A977]" />
                          <span>{room.sqft} sq.ft</span>
                        </span>
                      </div>

                      {/* Climate Info */}
                      <div className="mb-4">
                        <div className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#204835] text-[#E8C587] border border-[#D4A977] flex items-center justify-between">
                          <span>AC Eco-Cooling Included</span>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {room.facilities.map((fac) => (
                          <div
                            key={fac}
                            className="flex items-center gap-1.5 text-[11px] text-[#B8C7BE]"
                          >
                            <Check className="w-3 h-3 text-[#D4A977] shrink-0" />
                            <span className="truncate">{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          type: 'bamboo',
                          title: `${room.name} (AC Eco-Cooling)`,
                          subtitle: room.viewText,
                          amount: room.pricePerNight,
                          guests: '2 Guests',
                        })
                      }
                      className="w-full py-3 px-4 rounded-xl bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Book Bamboo Sanctuary (AC Eco-Cooling)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Curated Bamboo Stay Package • ₹16,000 Rent Banner */}
          <div className="rounded-2xl bg-[#163628] border border-[#2C5C45] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#D4A977] mb-1">
                CURATED BAMBOO STAY PACKAGE • ₹16,000 RENT
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1.5">
                TFC All-Inclusive Bamboo Stay Package (₹16,000)
              </h3>
              <p className="text-xs sm:text-sm text-[#C6D6CD]">
                Package Rent ₹16,000 — Includes Bamboo Room Stay, Dinner, Lunch,
                Morning Coffee & Breakfast.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    type: 'package',
                    title: 'TFC All-Inclusive Bamboo Stay Package',
                    subtitle:
                      'Includes Bamboo Room Stay, Morning Coffee, Breakfast, Lunch & Dinner',
                    amount: 16000,
                    guests: '2 Guests',
                  })
                }
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F3EFE4] text-[#14281D] text-xs font-bold transition-colors cursor-pointer"
              >
                Book Bamboo Stay Package • ₹16,000
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    type: 'package',
                    title: 'TFC Garden Family Stay Package',
                    subtitle:
                      '3 Days / 2 Nights • Up to 5 Guests • Fun Zone & Meals Included',
                    amount: 35500,
                    guests: '5 Guests',
                  })
                }
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F3EFE4] text-[#14281D] text-xs font-bold transition-colors cursor-pointer"
              >
                Book Family Package • ₹35,500
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. OFFICIAL TFC GARDEN WEDDING & PARTY CUSTOM MENU CARD SECTION */}
      <WeddingMenuCardSection
        settings={settings}
        onBookWeddingCard={(payload) =>
          setActiveBooking({
            type: 'wedding',
            title: `${payload.presetTitle} (${payload.selectedItemsCount} Menu Items Selected)`,
            subtitle: `${payload.hallZone} • ${payload.timeSlot}`,
            amount: 135000,
            date: payload.bookingDate,
            timeSlot: payload.timeSlot,
            guests: `${payload.expectedGuests} Guests`,
            notes: payload.customNotes,
          })
        }
      />

      {/* 11. RESTAURANT TABLE RESERVATION & SEATING ZONES SECTION */}
      <RestaurantAndDeliverySection
        settings={settings}
        onConfirmTable={(payload) =>
          setActiveBooking({
            type: 'table',
            title: `Restaurant Table ${payload.table.code} (${payload.table.type})`,
            subtitle: `Zone: ${payload.table.zone} • Free Table Reservation`,
            amount: 0,
            date: payload.date,
            timeSlot: payload.timeSlot,
            guests: payload.guests,
            notes: payload.chefRequests,
          })
        }
      />

      {/* 12. SIGNATURE RESORT & CELEBRATION PACKAGES */}
      <section
        id="packages-section"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="mb-7">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
            ALL-INCLUSIVE CURATED EXPERIENCES
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-3">
            Signature Resort & Celebration Packages
          </h2>
          <p className="text-sm sm:text-base text-[#54635A] max-w-3xl mb-5">
            Thoughtfully bundled Bamboo Stay (₹16,000), TFC Garden Family Stay
            (₹35,500), Wedding Package (₹1,35,000), and Bamboo Dining Area / VIP
            Lounge Dining Package (₹2,999).
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              'All',
              'Bamboo Stay Package',
              'Family Package',
              'Wedding Package',
              'Dining Package',
            ].map((tab) => {
              const active = packageFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPackageFilter(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#184A34] text-white'
                      : 'bg-white text-[#4A5950] border border-[#DCD4C0] hover:bg-[#F3EFE4]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Packages Grid matching Screenshots 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl overflow-hidden bg-white border border-[#E5DEC9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#132A1F]">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15" />

                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-[#112A1F]/90 text-[#E8C587] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {pkg.topLeftBadge}
                  </span>
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded bg-[#B86B35] text-white text-[10px] font-semibold">
                    {pkg.topRightBadge}
                  </span>

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                    <span className="text-xs text-[#E5ECE8]">
                      {pkg.bottomLeftMeta}
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-white shrink-0">
                      {pkg.priceFormatted}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#14281D] font-normal mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#54635A] leading-relaxed pb-4 mb-4 border-b border-[#EFECE4]">
                    {pkg.description}
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#68756D] mb-2.5">
                    PACKAGE INCLUSIONS:
                  </p>
                  <ul className="space-y-2 mb-6">
                    {pkg.inclusions.map((inc) => (
                      <li
                        key={inc}
                        className="flex items-start gap-2 text-xs text-[#14281D]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B43] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <button
                  type="button"
                  onClick={() =>
                    setActiveBooking({
                      type: 'package',
                      title: pkg.title,
                      subtitle: pkg.bottomLeftMeta,
                      amount: pkg.price,
                      guests: pkg.bottomLeftMeta,
                    })
                  }
                  className="w-full py-3 px-5 rounded-xl bg-[#184A34] hover:bg-[#113625] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>{pkg.ctaText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. DARK FOREST GREEN FOOTER (MATCHING SCREENSHOT 1) */}
      <footer className="bg-[#0F261C] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-t border-[#224735] mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#214233]">
          {/* Col 1: Brand & Address */}
          <div>
            <h3 className="font-serif text-2xl text-white font-normal mb-3">
              {settings.name}
            </h3>
            <p className="text-xs text-[#9EB5A8] leading-relaxed mb-4">
              An eco-luxury sanctuary in {settings.address} uniting handcrafted
              Guadua bamboo huts, AC suites, grand wedding banquet halls, The
              Turban Kitchen Restaurant, and fun zone.
            </p>
            <div className="space-y-2 text-xs font-mono text-[#DCE7E0]">
              <div className="flex items-start gap-2 text-[#D4A977]">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                <span>WhatsApp / Mob: {settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                <span>Landline: {settings.landline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Accommodations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A977] mb-4">
              ACCOMMODATIONS (4 ROOM TYPES)
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C8D8CF]">
              <li>
                <a href="#rooms-section" className="hover:text-white">
                  Bamboo Room
                </a>
              </li>
              <li>
                <a href="#rooms-section" className="hover:text-white">
                  Hut Room
                </a>
              </li>
              <li>
                <a href="#rooms-section" className="hover:text-white">
                  Couple Room
                </a>
              </li>
              <li>
                <a href="#rooms-section" className="hover:text-white">
                  Family Room
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Dining & Celebrations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A977] mb-4">
              DINING & CELEBRATIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C8D8CF]">
              <li>
                <a href="#wedding-card-section" className="hover:text-white">
                  Grand Wedding & Banquet Halls
                </a>
              </li>
              <li>
                <a href="#restaurant-section" className="hover:text-white">
                  The Turban Kitchen Restaurant Reservations
                </a>
              </li>
              <li>
                <a href="#packages-section" className="hover:text-white">
                  Bamboo, Family, Wedding & Dining Packages
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Concierge & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A977] mb-4">
              DIRECT CONCIERGE & CONTACT
            </h4>
            <div className="space-y-2.5 text-xs text-[#C8D8CF] mb-4">
              <p>
                Address:{' '}
                <strong className="text-white">{settings.address}</strong>
              </p>
              <p>
                Call / WhatsApp:{' '}
                <strong className="font-mono text-[#6EE7B7]">
                  {settings.whatsapp}
                </strong>
              </p>
              <p>
                The Turban Kitchen Restaurant Landline:{' '}
                <strong className="font-mono text-white">
                  {settings.landline}
                </strong>
              </p>
              <p>
                Email:{' '}
                <strong className="font-mono text-[#D4A977]">
                  {settings.email}
                </strong>
              </p>
              <p>
                UPI ID:{' '}
                <strong className="font-mono text-[#6EE7B7]">
                  {settings.upiId}
                </strong>
              </p>
            </div>
            <a
              href={`https://wa.me/91${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E6B43] hover:bg-[#175435] text-white font-mono text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 text-center text-[11px] text-[#849E8F]">
          © 2026 {settings.name} ({settings.address}) • WhatsApp:{' '}
          {settings.whatsapp} • {settings.landline} • {settings.email}
        </div>
      </footer>

      {/* FLOATING BOTTOM-RIGHT WHATSAPP PILL */}
      <a
        href={`https://wa.me/91${settings.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E6B43] hover:bg-[#175435] text-white font-mono text-xs font-bold shadow-xl border border-white/15 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp: {settings.whatsapp}</span>
      </a>

      {/* MODALS & DRAWERS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => applyAuthenticatedUser(user)}
        defaultTab={authModalTab}
      />

      <BookingAndSettingsModals
        settings={settings}
        onUpdateSettings={(newSet) => setSettings(newSet)}
        activeBooking={activeBooking}
        onCloseBooking={() => setActiveBooking(null)}
        savedRecords={savedRecords}
        onRecordSaved={(rec) => setSavedRecords((prev) => [rec, ...prev])}
        isProfileOpen={isProfileOpen}
        onCloseProfile={() => setIsProfileOpen(false)}
        isSettingsOpen={isSettingsOpen}
        onCloseSettings={() => setIsSettingsOpen(false)}
        isReviewModalOpen={isReviewModalOpen}
        onCloseReviewModal={() => setIsReviewModalOpen(false)}
        onAddReview={(rev) => setReviews((prev) => [rev, ...prev])}
        isNavDrawerOpen={isNavDrawerOpen}
        onCloseNavDrawer={() => setIsNavDrawerOpen(false)}
        authUser={authUser}
        onOpenLoginModal={() => {
          setAuthModalTab('login');
          setIsAuthModalOpen(true);
        }}
        onOpenSignupModal={() => {
          setAuthModalTab('signup');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}
