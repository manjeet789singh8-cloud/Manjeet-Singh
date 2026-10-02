'use client';

import React, { useState, useMemo } from 'react';
import {
  RESTAURANT_TABLES,
  RestaurantTable,
  ResortSettings,
} from '@/lib/tfc-data';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
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
}

export default function RestaurantAndDeliverySection({
  onConfirmTable,
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

  return (
    <section
      id="restaurant-section"
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B3E] mb-2">
          THE TURBAN KITCHEN RESTAURANT • FINE DINING
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#14281D] font-normal leading-tight mb-3">
          The Turban Kitchen Restaurant — Table Reservation & Seating Zones
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
  );
}
