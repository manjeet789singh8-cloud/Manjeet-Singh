'use client';

import React, { useState, useMemo } from 'react';
import {
  RESTAURANT_TABLES,
  DELIVERY_MENU_ITEMS,
  RestaurantTable,
  ResortSettings,
} from '@/lib/tfc-data';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
  Truck,
  Phone,
  MessageCircle,
  Search,
  Sparkles,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

interface RestaurantAndDeliverySectionProps {
  settings: ResortSettings;
  onConfirmTable: (payload: {
    table: RestaurantTable;
    date: string;
    timeSlot: string;
    guests: string;
    chefRequests: string;
  }) => void;
  onCheckoutDelivery: (payload: {
    items: { id: string; name: string; price: number; qty: number }[];
    distanceLabel: string;
    deliveryFee: number;
    subtotal: number;
    total: number;
    address: string;
    cookingNotes: string;
    preferredMethod: 'UPI / Card / COD';
  }) => void;
}

const DISTANCE_OPTIONS = [
  {
    id: '0-1',
    label: '0 – 1 km (Near Bus Stand / Town Center)',
    shortLabel: '0 – 1 km Area',
    fee: 0,
    feeText: 'FREE Delivery',
  },
  {
    id: '1-2',
    label: '1 – 2 km Radius around TFC Garden',
    shortLabel: '1 – 2 km Area',
    fee: 0,
    feeText: 'FREE Delivery',
  },
  {
    id: '2-3',
    label: '2 – 3 km Area (Sri Anandpur Sahib)',
    shortLabel: '2 – 3 km Area',
    fee: 0,
    feeText: 'FREE Delivery',
  },
  {
    id: '3-6',
    label: 'Beyond 3 km (3 – 6 km Outer Area)',
    shortLabel: '3 – 6 km Area',
    fee: 60,
    feeText: '₹60 Delivery',
  },
];

export default function RestaurantAndDeliverySection({
  settings,
  onConfirmTable,
  onCheckoutDelivery,
}: RestaurantAndDeliverySectionProps) {
  // Table reservation states
  const [resDate, setResDate] = useState<string>('2026-09-30');
  const [resTimeSlot, setResTimeSlot] = useState<string>('19:30 Dinner');
  const [resGuests, setResGuests] = useState<string>('2 Guests');
  const [tableTypeFilter, setTableTypeFilter] = useState<string>('All');
  const [seatingAreaFilter, setSeatingAreaFilter] = useState<string>('All');
  const [chefRequests, setChefRequests] = useState<string>('');
  const [selectedTableId, setSelectedTableId] = useState<string>('T-01');
  const [tablesState, setTablesState] =
    useState<RestaurantTable[]>(RESTAURANT_TABLES);

  // Delivery Menu states
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [bestsellersOnly, setBestsellersOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Dishes');

  // Default Cart matching Screenshot 3: 1x Kadai Paneer (₹270) + 2x Tandoori Butter Naan (₹90x2 = ₹180) = ₹450
  const [cart, setCart] = useState<Record<string, number>>({
    'dish-28': 1,
    'dish-38': 2,
  });

  const [selectedDistanceId, setSelectedDistanceId] = useState<string>('2-3');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    settings.address
  );
  const [cookingNotes, setCookingNotes] = useState<string>('');

  const availableTablesCount = useMemo(
    () => tablesState.filter((t) => t.status === 'AVAILABLE').length,
    [tablesState]
  );
  const reservedTablesCount = useMemo(
    () => tablesState.filter((t) => t.status === 'RESERVED').length,
    [tablesState]
  );

  const filteredTables = useMemo(() => {
    return tablesState.filter((t) => {
      if (tableTypeFilter !== 'All' && t.type !== tableTypeFilter) {
        return false;
      }
      if (seatingAreaFilter !== 'All' && t.zone !== seatingAreaFilter) {
        return false;
      }
      return true;
    });
  }, [tablesState, tableTypeFilter, seatingAreaFilter]);

  const selectedTable = useMemo(
    () =>
      tablesState.find((t) => t.id === selectedTableId) || tablesState[0],
    [tablesState, selectedTableId]
  );

  const handleConfirmSelectedTable = (tableToBook: RestaurantTable) => {
    if (tableToBook.status === 'RESERVED') return;
    setSelectedTableId(tableToBook.id);
    setTablesState((prev) =>
      prev.map((t) =>
        t.id === tableToBook.id
          ? {
              ...t,
              status: 'RESERVED',
              reservedNote: `Reserved for ${resTimeSlot}`,
            }
          : t
      )
    );
    onConfirmTable({
      table: tableToBook,
      date: resDate,
      timeSlot: resTimeSlot,
      guests: resGuests,
      chefRequests,
    });
  };

  // Delivery filtering
  const menuCategories = [
    'All Dishes',
    'Breakfast & Morning Special',
    'Soups & Shorba',
    'Tandoori & Continental Starters',
    'Chinese, Burgers, Pizza & Snacks',
    'Royal Main Course & Handi',
    'Indian Breads, Rice & Thalis',
    'Desserts & Beverages',
  ];

  const filteredDishes = useMemo(() => {
    return DELIVERY_MENU_ITEMS.filter((dish) => {
      if (
        selectedCategory !== 'All Dishes' &&
        dish.category !== selectedCategory
      ) {
        return false;
      }
      if (bestsellersOnly && !dish.isPopular) {
        return false;
      }
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, bestsellersOnly, menuSearch]);

  const handleAddDish = (dishId: string) => {
    setCart((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }));
  };

  const handleDecrementDish = (dishId: string) => {
    setCart((prev) => {
      const current = prev[dishId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return { ...prev, [dishId]: current - 1 };
    });
  };

  const cartItemsDetailed = useMemo(() => {
    return Object.entries(cart)
      .map(([dishId, qty]) => {
        const dish = DELIVERY_MENU_ITEMS.find((d) => d.id === dishId);
        if (!dish || qty <= 0) return null;
        return {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          qty,
          lineTotal: dish.price * qty,
        };
      })
      .filter(Boolean) as {
      id: string;
      name: string;
      price: number;
      qty: number;
      lineTotal: number;
    }[];
  }, [cart]);

  const totalCartItemsCount = useMemo(
    () => cartItemsDetailed.reduce((sum, item) => sum + item.qty, 0),
    [cartItemsDetailed]
  );

  const foodSubtotal = useMemo(
    () => cartItemsDetailed.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItemsDetailed]
  );

  const selectedDistanceObj =
    DISTANCE_OPTIONS.find((d) => d.id === selectedDistanceId) ||
    DISTANCE_OPTIONS[2];

  const deliveryFee =
    selectedDistanceObj.fee === 0 && foodSubtotal >= 399
      ? 0
      : selectedDistanceObj.fee === 0 && foodSubtotal > 0 && foodSubtotal < 399
      ? 40
      : selectedDistanceObj.fee;

  const totalPayable = foodSubtotal + deliveryFee;

  const handleOrderOnWhatsApp = () => {
    if (cartItemsDetailed.length === 0) return;
    const itemsLines = cartItemsDetailed
      .map((i) => `• ${i.qty}x ${i.name} — ₹${i.lineTotal}`)
      .join('\n');
    const msg = encodeURIComponent(
      `Hello *${settings.name} — The Turban Kitchen*!\nI would like to place a Home Delivery Order:\n\n${itemsLines}\n\n- *Food Subtotal:* ₹${foodSubtotal}\n- *Delivery Zone:* ${selectedDistanceObj.label}\n- *Delivery Fee:* ₹${deliveryFee}\n- *Total Payable:* ₹${totalPayable}\n- *Address:* ${deliveryAddress}\n- *Cooking Notes:* ${cookingNotes || 'Regular'}`
    );
    window.open(`https://wa.me/91${settings.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* SECTION 1: RESTAURANT TABLE RESERVATION & SEATING ZONES */}
      <section
        id="restaurant-section"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="mb-6">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
            FINE DINING & BOTANICAL GASTRONOMY
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-3">
            Restaurant Table Reservation & Seating Zones
          </h2>
          <p className="text-sm sm:text-base text-[#54635A] max-w-3xl">
            Select your preferred dining date, time slot, table category, and
            special culinary requests across our 6 distinct indoor, bamboo,
            rooftop, and garden seating areas.
          </p>
        </div>

        {/* Available / Reserved Counter Bar */}
        <div className="bg-[#F3EFE4] border border-[#E5DEC9] rounded-xl px-4 py-3 mb-7 flex items-center gap-6 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-[#14281D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E6B43]" />
            <span>Available Tables: {availableTablesCount}</span>
          </div>
          <span className="text-[#D0C7B4]">|</span>
          <div className="flex items-center gap-2 text-[#14281D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B84735]" />
            <span>Reserved Tables: {reservedTablesCount}</span>
          </div>
        </div>

        {/* 1. Configure Your Reservation Card */}
        <div className="bg-white rounded-2xl border border-[#E5DEC9] p-5 sm:p-7 shadow-xs mb-10">
          <h3 className="font-serif text-xl sm:text-2xl text-[#14281D] font-normal mb-1">
            1. Configure Your Reservation
          </h3>
          <p className="text-xs sm:text-sm text-[#68756D] mb-5">
            Choose date, dining slot, guest count, and dietary preferences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#9A6B3E]" />
                <span>DATE</span>
              </label>
              <input
                type="date"
                value={resDate}
                onChange={(e) => setResDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9A6B3E]" />
                <span>TIME SLOT</span>
              </label>
              <select
                value={resTimeSlot}
                onChange={(e) => setResTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
              >
                <option value="09:00 Breakfast">09:00 Breakfast</option>
                <option value="13:00 Lunch">13:00 Lunch</option>
                <option value="16:30 Evening High Tea">
                  16:30 Evening High Tea
                </option>
                <option value="19:30 Dinner">19:30 Dinner</option>
                <option value="21:00 Starlit Dinner">21:00 Starlit Dinner</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#9A6B3E]" />
                <span>NUMBER OF GUESTS</span>
              </label>
              <select
                value={resGuests}
                onChange={(e) => setResGuests(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
              >
                <option value="2 Guests">2 Guests</option>
                <option value="4 Guests">4 Guests</option>
                <option value="6 Guests">6 Guests</option>
                <option value="8 Guests">8 Guests</option>
                <option value="10+ VIP Group">10+ VIP Group</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
                <span>TABLE TYPE FILTER</span>
              </label>
              <select
                value={tableTypeFilter}
                onChange={(e) => setTableTypeFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
              >
                <option value="All">All</option>
                <option value="Couple Table">Couple Table</option>
                <option value="Family Table">Family Table</option>
                <option value="VIP Table">VIP Table</option>
                <option value="Outdoor Table">Outdoor Table</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
              SPECIAL SEATING AREA FILTER
            </label>
            <select
              value={seatingAreaFilter}
              onChange={(e) => setSeatingAreaFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
            >
              <option value="All">All</option>
              <option value="Bamboo Dining Area">Bamboo Dining Area</option>
              <option value="Rooftop Seating">Rooftop Seating</option>
              <option value="Indoor Seating Hall">Indoor Seating Hall</option>
              <option value="Family Seating Area">Family Seating Area</option>
              <option value="VIP Lounge">VIP Lounge</option>
              <option value="Garden Seating Area">Garden Seating Area</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#54635A] mb-1.5">
              SPECIAL FOOD & CHEF REQUESTS
            </label>
            <textarea
              rows={2}
              value={chefRequests}
              onChange={(e) => setChefRequests(e.target.value)}
              placeholder="e.g. Jain food, gluten-free, candlelit anniversary cake, kids platter..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
            />
          </div>

          {/* Selected Table Box */}
          <div className="rounded-xl bg-[#F3EFE4] border border-[#E5DEC9] p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#14281D]">
                Selected: Table {selectedTable.code}
              </span>
              <span className="text-xs font-semibold text-[#9A6B3E]">
                {selectedTable.type}
              </span>
            </div>
            <p className="text-xs text-[#54635A] mb-3">
              Zone:{' '}
              <strong className="text-[#14281D]">{selectedTable.zone}</strong> •
              Seats {selectedTable.maxGuests}
            </p>
            <button
              type="button"
              onClick={() => handleConfirmSelectedTable(selectedTable)}
              disabled={selectedTable.status === 'RESERVED'}
              className={`w-full py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
                selectedTable.status === 'RESERVED'
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#184A34] hover:bg-[#113625] text-white'
              }`}
            >
              {selectedTable.status === 'RESERVED'
                ? `${selectedTable.code} is Currently Reserved`
                : `Confirm Table ${selectedTable.code} (${selectedTable.type})`}
            </button>
          </div>
        </div>

        {/* 2. Couple, Family, VIP & Outdoor Restaurant Tables (14 Tables) */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#14281D] font-normal mb-1">
            2. Couple, Family, VIP & Outdoor Restaurant Tables (14 Tables)
          </h3>
          <p className="text-xs font-semibold text-[#1E6B43] flex items-center gap-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1E6B43]" />
            <span>Free Table Reservation (No Table Charge)</span>
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { label: 'All Tables', val: 'All' },
              { label: 'Couple Tables', val: 'Couple Table' },
              { label: 'Family Tables', val: 'Family Table' },
              { label: 'VIP Tables', val: 'VIP Table' },
              { label: 'Outdoor Tables', val: 'Outdoor Table' },
            ].map((tab) => {
              const active = tableTypeFilter === tab.val;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setTableTypeFilter(tab.val)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#112A1F] text-white'
                      : 'bg-white text-[#4A5950] border border-[#DCD4C0] hover:bg-[#F3EFE4]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 14 Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTables.map((table) => {
              const isSelected =
                table.id === selectedTableId && table.status === 'AVAILABLE';
              const isReserved = table.status === 'RESERVED';

              return (
                <div
                  key={table.id}
                  onClick={() => {
                    if (!isReserved) setSelectedTableId(table.id);
                  }}
                  className={`rounded-2xl p-5 border transition-all ${
                    isSelected
                      ? 'bg-[#0F261C] text-white border-[#1E5E3A] shadow-lg cursor-pointer'
                      : isReserved
                      ? 'bg-[#FDF8F6] text-[#14281D] border-[#EED5CE] opacity-90'
                      : 'bg-white text-[#14281D] border-[#E5DEC9] hover:border-[#B8AD96] shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                        isSelected
                          ? 'bg-[#D4A977] text-[#14281D]'
                          : isReserved
                          ? 'bg-[#C84B31] text-white'
                          : 'bg-[#F3EFE4] text-[#14281D]'
                      }`}
                    >
                      {table.code}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                        isReserved
                          ? 'text-[#C84B31]'
                          : isSelected
                          ? 'text-[#6EE7B7]'
                          : 'text-[#1E6B43]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isReserved
                            ? 'bg-[#C84B31]'
                            : isSelected
                            ? 'bg-[#6EE7B7]'
                            : 'bg-[#1E6B43]'
                        }`}
                      />
                      <span>{table.status}</span>
                    </span>
                  </div>

                  <h4 className="font-serif text-lg sm:text-xl font-semibold mb-1">
                    {table.type}
                  </h4>
                  <p
                    className={`flex items-center gap-1.5 text-xs mb-3 pb-3 border-b ${
                      isSelected
                        ? 'text-[#B8C7BE] border-[#234435]'
                        : 'text-[#68756D] border-[#F0ECE1]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                    <span>{table.zone}</span>
                  </p>

                  <ul className="space-y-1.5 mb-4 text-xs">
                    {table.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-center gap-2 ${
                          isSelected ? 'text-[#DCE7E0]' : 'text-[#54635A]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-[#D4A977] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-[#6EE7B7]' : 'text-[#1E6B43]'
                      }`}
                    >
                      Up to {table.maxGuests} Guests • No Table Charge
                    </span>

                    {isReserved ? (
                      <span className="font-mono text-xs font-semibold text-[#C84B31]">
                        {table.reservedNote || 'Reserved for Dinner'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmSelectedTable(table);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4A977] hover:bg-[#C59760] text-[#14281D]'
                            : 'bg-[#184A34] hover:bg-[#123827] text-white'
                        }`}
                      >
                        Reserve {table.code}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: TFC GARDEN & THE TURBAN KITCHEN — HOME DELIVERY MENU CARD */}
      <section
        id="delivery-menu-section"
        className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-[#0F241B] text-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#214233] shadow-2xl">
          {/* Top Status Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A3522] border border-[#6E5B33] text-[#E8C587] text-[11px] font-mono font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>FREE HOME DELIVERY WITHIN 3 KM (*MIN. ORDER ₹399/-)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163829] border border-[#2B5E46] text-[#7CE5A7] text-[11px] font-mono font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Open 7:30 AM to 11:30 PM</span>
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight mb-3">
            TFC Garden & The Turban Kitchen — Home Delivery Menu Card
          </h2>
          <p className="text-xs sm:text-sm text-[#B8C7BE] max-w-3xl leading-relaxed mb-6">
            Order fresh, hot Breakfast Paranthas, Soups, Tandoori Starters,
            Indo-Chinese, Pizza, Pasta, Royal Paneer & Dal Makhani Handis,
            Thalis, and Beverages straight from our kitchen at{' '}
            <span className="text-[#E8C587] font-medium">
              {settings.address}
            </span>
            . Enjoy{' '}
            <span className="text-[#6EE7B7] font-semibold">
              100% FREE Home Delivery within a 3 km radius
            </span>{' '}
            (Min. Order ₹399/-).
          </p>

          {/* Home Delivery Hotline Numbers Box */}
          <div className="rounded-2xl bg-[#142E22] border border-[#264D3B] p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4A977]">
                HOME DELIVERY HOTLINE NUMBERS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1E6B43] text-white font-mono text-[10px] font-bold">
                0-3 KM FREE
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <a
                href={`tel:${settings.whatsapp}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F231A] border border-[#274E3B] text-xs font-mono text-white hover:border-[#D4A977] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A977]" />
                <span>Mob: {settings.whatsapp}</span>
              </a>
              <button
                type="button"
                onClick={handleOrderOnWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E6B43] hover:bg-[#195937] text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </button>
            </div>
            <a
              href={`tel:${settings.landline}`}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#183628] text-xs font-mono text-[#D0E2D7] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#6EE7B7]" />
              <span>Landline / Tel: {settings.landline}</span>
            </a>
          </div>

          {/* Search & Bestsellers Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#849E8F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu card (e.g. Paneer, Parantha, Chaap, Pizza, Dal Makhani)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#153024] border border-[#29503D] text-xs sm:text-sm text-white placeholder-[#7B9687] focus:outline-none focus:border-[#D4A977]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBestsellersOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  bestsellersOnly
                    ? 'bg-[#D4A977] text-[#14281D] border-[#D4A977]'
                    : 'bg-[#153024] text-[#E0EAE4] border-[#29503D] hover:border-[#D4A977]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>★ Bestsellers Only</span>
              </button>
              <span className="text-xs font-mono text-[#8FA99A]">
                Showing {filteredDishes.length} of {DELIVERY_MENU_ITEMS.length}{' '}
                Dishes
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {menuCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#D4A977] text-[#14281D]'
                      : 'bg-[#153024] text-[#C6D6CD] border border-[#264D3B] hover:bg-[#1B3C2D]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[680px] overflow-y-auto pr-1">
            {filteredDishes.map((dish) => {
              const qty = cart[dish.id] || 0;
              return (
                <div
                  key={dish.id}
                  className="rounded-2xl bg-[#142E22] border border-[#264D3B] p-4 sm:p-5 flex flex-col justify-between hover:border-[#3D7259] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                      <span className="text-[#D4A977] font-medium">
                        {dish.category}
                      </span>
                      <span className="font-mono text-[#8FA99A]">
                        {dish.portion} • {dish.prepTime}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-base sm:text-lg text-white font-semibold leading-snug">
                        {dish.name}
                      </h3>
                      {dish.isPopular && (
                        <span className="px-2 py-0.5 rounded bg-[#2A3F2B] border border-[#4E6E4E] text-[#E6C485] text-[10px] font-mono font-bold shrink-0">
                          ★ POPULAR
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#9EB5A8] leading-relaxed mb-4">
                      {dish.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#214434]">
                    <span className="font-mono text-base sm:text-lg font-bold text-[#E8C587]">
                      ₹{dish.price}
                    </span>

                    {qty > 0 ? (
                      <div className="inline-flex items-center gap-2 bg-[#D4A977] text-[#14281D] rounded-lg px-2.5 py-1 font-mono text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => handleDecrementDish(dish.id)}
                          className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleAddDish(dish.id)}
                          className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddDish(dish.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4A977] hover:bg-[#C69862] text-[#14281D] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* HOME DELIVERY ORDER TRAY (WHITE CARD INSIDE DARK GREEN SECTION) */}
          <div className="bg-white text-[#14281D] rounded-2xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ECE6D8]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#184A34]" />
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#14281D]">
                    Home Delivery Order Tray
                  </h3>
                  <p className="text-[11px] text-[#68756D]">
                    Open 7:30 AM to 11:30 PM • Free within 3 km (*Min. ₹399)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-md bg-[#184A34] text-white font-mono text-xs font-bold">
                {totalCartItemsCount} Items
              </span>
            </div>

            {/* Select Delivery Distance */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-2">
                SELECT DELIVERY DISTANCE (SRI ANANDPUR SAHIB)
              </label>
              <div className="space-y-2">
                {DISTANCE_OPTIONS.map((opt) => {
                  const active = selectedDistanceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedDistanceId(opt.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#112A1F] text-white border-[#112A1F]'
                          : 'bg-white text-[#14281D] border-[#E5DEC9] hover:bg-[#FAF8F3]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          active
                            ? 'text-[#6EE7B7]'
                            : opt.fee === 0
                            ? 'text-[#1E6B43]'
                            : 'text-[#B86B28]'
                        }`}
                      >
                        {opt.feeText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address & Cooking Notes */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  DELIVERY ADDRESS & LANDMARK (NEAR BUS STAND, SRI ANANDPUR
                  SAHIB, PUNJAB)
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  SPICE LEVEL / COOKING NOTES
                </label>
                <input
                  type="text"
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  placeholder="e.g. Less spicy, Jain preparation, extra butter, cutlery..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#1E5E3A]"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="rounded-xl bg-[#F6F2E8] border border-[#E6DFCF] p-3.5 mb-4 space-y-2">
              {cartItemsDetailed.length === 0 ? (
                <p className="text-xs text-[#68756D] text-center py-2">
                  Your order tray is empty. Click &ldquo;+ Add&rdquo; on any
                  dish above to add items.
                </p>
              ) : (
                cartItemsDetailed.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs sm:text-sm text-[#14281D]"
                  >
                    <span className="truncate pr-2">
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-mono font-semibold shrink-0">
                      ₹{item.lineTotal}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Total */}
            <div className="space-y-1.5 text-xs sm:text-sm pb-4 mb-4 border-b border-[#ECE6D8]">
              <div className="flex items-center justify-between text-[#54635A]">
                <span>Food Subtotal</span>
                <span className="font-mono">₹{foodSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[#54635A]">
                <span>Delivery Fee ({selectedDistanceObj.shortLabel})</span>
                <span className="font-mono font-semibold text-[#1E6B43]">
                  {deliveryFee === 0
                    ? '₹0 (FREE WITHIN 3 KM)'
                    : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#14281D] pt-1">
                <span>Total Payable</span>
                <span className="font-mono text-base sm:text-lg">
                  ₹{totalPayable}
                </span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={cartItemsDetailed.length === 0}
                onClick={() =>
                  onCheckoutDelivery({
                    items: cartItemsDetailed,
                    distanceLabel: selectedDistanceObj.label,
                    deliveryFee,
                    subtotal: foodSubtotal,
                    total: totalPayable,
                    address: deliveryAddress,
                    cookingNotes,
                    preferredMethod: 'UPI / Card / COD',
                  })
                }
                className="w-full py-3 px-5 rounded-xl bg-[#214E38] hover:bg-[#193C2B] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#D4A977]" />
                <span>
                  Pay via UPI / Card / Cash on Delivery (₹{totalPayable} •{' '}
                  {deliveryFee === 0 ? 'FREE DELIVERY' : `₹${deliveryFee} DEL`}
                  )
                </span>
              </button>

              <button
                type="button"
                disabled={cartItemsDetailed.length === 0}
                onClick={handleOrderOnWhatsApp}
                className="w-full py-3 px-5 rounded-xl bg-[#1E6B43] hover:bg-[#175435] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp: {settings.whatsapp}</span>
              </button>
            </div>

            <div className="mt-4 text-center font-mono text-[11px] text-[#54635A] space-y-0.5">
              <p>
                UPI ID:{' '}
                <strong className="text-[#14281D]">{settings.upiId}</strong>
              </p>
              <p>
                Call Landline:{' '}
                <strong className="text-[#14281D]">{settings.landline}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
