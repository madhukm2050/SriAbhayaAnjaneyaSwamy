import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle,
  ArrowLeft,
  Info,
  Bell,
  Flame,
  X,
} from "lucide-react";

// --- Configuration & Mock Data ---
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function App() {
  // --- State ---
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD'
  const [view, setView] = useState("calendar"); // 'calendar', 'form', 'success'
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls the date details dialog

  // In-memory database of bookings to prevent double booking.
  // Format: { "YYYY-MM-DD": [{ devoteeName: "Name", familyName: "Family" }] }
  const [bookings, setBookings] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    devoteeName: "",
    familyName: "",
    fatherName: "",
    occasion: "",
    gothram: "",
    recurrence: "One Time",
    mobile: "",
    instructions: "",
  });

  // --- Utilities ---
  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, parseInt(month) - 1, day);
    return `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]}`;
  };

  // Generate the 12 months from January to December
  const generate12Months = () => {
    const months = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      months.push({ year: currentYear, month: i });
    }
    return months;
  };

  const twelveMonths = generate12Months();

  // --- Handlers ---
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to our "database"
    setBookings((prev) => {
      const newBookings = { ...prev };
      const [yearStr, monthStr, dayStr] = selectedDate.split("-");
      const startYear = parseInt(yearStr);

      const newBookingRecord = {
        id: Date.now(),
        devoteeName: formData.devoteeName,
        familyName: formData.familyName,
      };

      if (formData.recurrence === "Yearly") {
        // Book for the selected year and the next 10 upcoming years
        for (let i = 0; i <= 10; i++) {
          const futureDate = `${startYear + i}-${monthStr}-${dayStr}`;
          const dayBookings = newBookings[futureDate] || [];
          newBookings[futureDate] = [...dayBookings, newBookingRecord];
        }
      } else {
        // One Time booking
        const dayBookings = newBookings[selectedDate] || [];
        newBookings[selectedDate] = [...dayBookings, newBookingRecord];
      }

      return newBookings;
    });

    setView("success");
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setFormData({
      devoteeName: "",
      familyName: "",
      fatherName: "",
      occasion: "",
      gothram: "",
      recurrence: "One Time",
      mobile: "",
      instructions: "",
    });
    setView("calendar");
  };

  // --- Components ---

  const MonthGrid = ({ year, month }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const todayStr = getTodayStr();

    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="mb-8 bg-white/90 p-6 rounded-2xl shadow-sm border border-orange-100">
        <h3 className="text-xl font-bold text-[#8B0000] mb-4 text-center">
          {lang === "te"
            ? translations.te.months[month]
            : translations.en.months[month]}{" "}
          {year}
        </h3>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-xs font-bold text-orange-800 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="h-10 sm:h-12 rounded-lg"></div>
          ))}
          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            const isSelected = selectedDate === dateStr;

            // Check if there are any bookings on this date to show a visual indicator
            const dayBookings = bookings[dateStr] || [];
            const hasBooking = dayBookings.length > 0;

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                className={`
                  relative h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300
                  ${
                    !isSelected
                      ? "text-gray-800 hover:bg-orange-100 hover:text-red-700 hover:shadow-inner active:scale-95 cursor-pointer border border-transparent hover:border-orange-200"
                      : ""
                  }
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-md shadow-red-500/40 border border-red-700"
                      : "bg-orange-50/50"
                  }
                `}
              >
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"></span>
                )}
                {hasBooking && !isSelected && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"
                    title="Booking exists on this date"
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-sans selection:bg-orange-300 selection:text-red-900 pb-12 relative">
      {/* Decorative background pattern (subtle) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B0000] via-[#CC3300] to-[#8B0000] text-white sticky top-0 z-50 shadow-xl border-b-4 border-yellow-500">
        <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-center relative">
          {view !== "calendar" && view !== "success" && (
            <button
              onClick={() => setView("calendar")}
              className="absolute left-4 p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-yellow-100" />
            </button>
          )}
          <div className="flex flex-col items-center justify-center pt-1">
            <span className="text-yellow-300 text-xs sm:text-sm mb-0.5 font-serif flex items-center gap-2">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4" /> ॐ{" "}
              <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-400 drop-shadow-sm uppercase text-center">
              Sri Abhaya Anjaneya Swamy
            </h1>
          </div>
          <button
            onClick={() => setLang(lang === "te" ? "en" : "te")}
            className="bg-white/10 px-3 py-1 rounded text-xs border border-white/20 uppercase font-bold"
          >
            {lang === "te" ? "English" : "తెలుగు"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8 sm:pt-10 relative z-10">
        {/* VIEW: CALENDAR */}
        {view === "calendar" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-3 px-6 py-2 bg-orange-100/80 rounded-full border border-orange-200 mb-2 shadow-sm">
                <Flame className="text-orange-600 w-5 h-5 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8B0000]">
                  Select Date For Nitya Pooja
                </h2>
                <Flame className="text-orange-600 w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Scrollable 12 Month View */}
            <div className="space-y-8">
              {twelveMonths.map((m, index) => (
                <MonthGrid key={index} year={m.year} month={m.month} />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: BOOKING FORM */}
        {view === "form" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 border-b-2 border-orange-200 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#8B0000] mb-2 relative z-10">
                  Devotee Details
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-orange-900 font-semibold relative z-10">
                  <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-orange-200">
                    <CalendarIcon className="w-4 h-4 text-orange-600" />{" "}
                    {formatDate(selectedDate)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-orange-200">
                    <Clock className="w-4 h-4 text-orange-600" /> 07:00 AM
                    (Nitya Pooja)
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Devotee Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="devoteeName"
                      value={formData.devoteeName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Enter devotee name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Family Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="familyName"
                      value={formData.familyName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Enter family name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Father Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Gothram
                    </label>
                    <input
                      type="text"
                      name="gothram"
                      value={formData.gothram}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. Kashyapa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Occasion
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. Birthday, Anniversary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Recurrence *
                  </label>
                  <select
                    required
                    name="recurrence"
                    value={formData.recurrence}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  >
                    <option value="One Time">One Time</option>
                    <option value="Yearly">Yearly (All Upcoming Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Additional Instructions or request
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                    placeholder="Any specific instructions for the pooja..."
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-red-900/20 text-lg font-bold text-white bg-gradient-to-r from-[#8B0000] to-red-600 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-[0.98] uppercase tracking-wider"
                  >
                    Confirm Booking
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1 font-medium">
                    <Info className="w-4 h-4 text-orange-400" /> No payment
                    required at this step.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {view === "success" && (
          <div className="animate-in zoom-in-95 duration-500 max-w-md mx-auto mt-10">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-500/20 overflow-hidden text-center p-8 sm:p-10 relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 via-emerald-600 to-green-500"></div>

              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6 border-4 border-green-100 shadow-inner">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-[#8B0000] mb-3">
                Booking Confirmed!
              </h2>
              <p className="text-orange-900 font-medium mb-8">
                May Sri Abhaya Anjaneya Swamy's blessings be upon you and your
                family, {formData.devoteeName}. 🙏
              </p>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 text-left border border-orange-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none">
                  <Bell className="w-32 h-32 transform translate-x-8 translate-y-8" />
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-200/60 relative z-10">
                  <span className="text-orange-800/70 text-sm font-semibold uppercase tracking-wider">
                    Pooja
                  </span>
                  <span className="font-bold text-[#8B0000] text-lg">
                    Nitya Pooja
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-200/60 relative z-10">
                  <span className="text-orange-800/70 text-sm font-semibold uppercase tracking-wider">
                    Date
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-200/60 relative z-10">
                  <span className="text-orange-800/70 text-sm font-semibold uppercase tracking-wider">
                    Recurrence
                  </span>
                  <span className="font-bold text-gray-900">
                    {formData.recurrence === "Yearly"
                      ? "Every Year"
                      : "One Time"}
                  </span>
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-orange-800/70 text-sm font-semibold uppercase tracking-wider">
                    Time
                  </span>
                  <span className="font-bold text-gray-900">07:00 AM</span>
                </div>
              </div>

              <button
                onClick={resetBooking}
                className="w-full py-4 bg-gradient-to-r from-[#8B0000] to-red-700 text-yellow-50 font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/20 active:scale-[0.98] focus:ring-4 focus:ring-red-200 outline-none uppercase tracking-wide text-sm"
              >
                Book Another Pooja
              </button>
            </div>
          </div>
        )}

        {isDialogOpen && selectedDate && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-[#8B0000] to-red-700 p-4 flex justify-between items-center shadow-md relative z-10">
                <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-yellow-300" />
                  {formatDate(selectedDate)}
                </h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-red-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-[#FFF8E7]">
                <h4 className="font-bold text-[#8B0000] mb-3 pb-2 border-b border-orange-200 flex items-center gap-2">
                  <User className="w-4 h-4" /> Devotees Booked
                </h4>

                <div className="max-h-[40vh] overflow-y-auto mb-6 space-y-2 pr-1">
                  {bookings[selectedDate] &&
                  bookings[selectedDate].length > 0 ? (
                    bookings[selectedDate].map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-orange-100 shadow-sm"
                      >
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {b.devoteeName}
                          </span>
                          <span className="text-gray-500 text-xs font-medium">
                            {b.familyName} Family
                          </span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-orange-200">
                      <Info className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        No bookings for this date yet.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Be the first to book a Nitya Pooja.
                      </p>
                    </div>
                  ))}
                  {!(
                    bookingsMap[selectedDate.split("-").slice(1).join("-")] ||
                    []
                  ).length && (
                    <p className="text-gray-400 text-center py-4 text-sm italic">
                      {t.noBookings}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setView('form');
                  }}
                  className="w-full py-4 bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Flame size={20} className="text-yellow-300" /> Book Nitya
                  Pooja
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
