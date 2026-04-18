import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  Bell,
  Flame,
  X,
  Search,
} from "lucide-react";

// Replace this with your actual Web App URL from Google Apps Script
const GOOGLE_SHEET_URL: string =
  "https://script.google.com/macros/s/AKfycbwTKGgh_07E2mkg58lztoPb3ibH4fgAq5Mmmf2ZuVDfLN1yxlAXPFjaZ0PgXGNha2vbhA/exec";

// --- Translations ---
const translations: any = {
  te: {
    title: "SRI ABHAYA ANJANEYA SWAMY",
    location: "S. SADLAPALLI",
    searchPlaceholder: "మొబైల్ సంఖ్యతో వెతకండి...",
    searchResultTitle: "మీ రాబోయే బుకింగ్‌లు:",
    noBookingsFound: "డేటా ఏదీ కనిపించలేదు.",
    selectDate: "పూజ తేదీని ఎంచుకోండి",
    devoteeDetails: "Devotee Details",
    devoteeName: "Devotee Name *",
    familyName: "Family Name *",
    fatherName: "Father Name",
    mobile: "Mobile Number *",
    gothram: "Gothram",
    occasion: "Occasion",
    confirm: "Confirm Nitya Pooja",
    saving: "Saving...",
    success: "Booking Confirmed!",
    blessings:
      "శ్రీ అభయ ఆంజనేయ స్వామి ఆశీస్సులు మీ కుటుంబానికి ఎల్లప్పుడూ ఉండాలి, ",
    back: "మరో బుకింగ్ చేయండి",
    noBookings: "ఈ తేదీకి ఇంకా బుకింగ్‌లు లేవు.",
    bookedDevotees: "బుక్ చేసుకున్న భక్తులు",
    poojaLabel: "POOJA",
    dateLabel: "DATE",
    timeLabel: "TIME",
    mobileAlert: "దయచేసి 10 అంకెల మొబైల్ సంఖ్యను నమోదు చేయండి.",
    days: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
    months: [
      "జనవరి",
      "ఫిబ్రవరి",
      "మార్చి",
      "ఏప్రిల్",
      "మే",
      "జూన్",
      "జూలై",
      "ఆగస్టు",
      "సెప్టెంబర్",
      "అక్టోబర్",
      "నవంబర్",
      "డిసెంబర్",
    ],
  },
  en: {
    title: "SRI ABHAYA ANJANEYA SWAMY",
    location: "S. SADLAPALLI",
    searchPlaceholder: "Search by mobile number...",
    searchResultTitle: "Your Upcoming Bookings:",
    noBookingsFound: "No records found.",
    selectDate: "Select Pooja Date",
    devoteeDetails: "Devotee Details",
    devoteeName: "Devotee Name *",
    familyName: "Family Name *",
    fatherName: "Father Name",
    mobile: "Mobile Number *",
    gothram: "Gothram",
    occasion: "Occasion",
    confirm: "Confirm Nitya Pooja",
    saving: "Saving...",
    success: "Booking Confirmed!",
    blessings:
      "May Sri Abhaya Anjaneya Swamy's blessings be upon you and your family, ",
    back: "Book Another Pooja",
    noBookings: "No bookings for this date yet.",
    bookedDevotees: "Nitya Pooja Devotees",
    poojaLabel: "POOJA",
    dateLabel: "DATE",
    timeLabel: "TIME",
    mobileAlert: "Please enter a valid 10-digit mobile number.",
    days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: [
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
    ],
  },
};

export default function App() {
  const [lang, setLang] = useState<"te" | "en">("te");
  const t = translations[lang];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<string>("calendar");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [rawBookings, setRawBookings] = useState<any[]>([]);
  const [bookingsMap, setBookingsMap] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    devoteeName: "",
    familyName: "",
    fatherName: "",
    mobile: "",
    gothram: "",
    occasion: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetch(GOOGLE_SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setRawBookings(data);
        const grouped: any = {};
        data.forEach((row: any) => {
          if (!row.Date) return;
          const monthDay = row.Date.split("-").slice(1).join("-");
          if (!grouped[monthDay]) grouped[monthDay] = [];
          grouped[monthDay].push({
            devoteeName: row.DevoteeName,
            familyName: row.FamilyName,
          });
        });
        setBookingsMap(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const monthIndex = parseInt(m) - 1;
    return lang === "te"
      ? `${parseInt(d)} ${translations.te.months[monthIndex]}`
      : `${parseInt(d)} ${translations.en.months[monthIndex]}`;
  };

  const generateRollingYear = () => {
    const months = [];
    let curMonth = today.getMonth();
    let curYear = today.getFullYear();
    for (let i = 0; i < 13; i++) {
      months.push({ year: curYear, month: curMonth });
      curMonth++;
      if (curMonth > 11) {
        curMonth = 0;
        curYear++;
      }
    }
    return months;
  };

  const filteredSearch = rawBookings.filter(
    (b) =>
      searchQuery.length === 10 &&
      b.Mobile &&
      b.Mobile.toString().includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mobile.length !== 10) {
      alert(t.mobileAlert);
      return;
    }
    if (!selectedDate) return;
    setIsSubmitting(true);

    const bookingData = {
      Date: selectedDate,
      DevoteeName: formData.devoteeName,
      FatherName: formData.fatherName || "N/A",
      FamilyName: formData.familyName,
      Mobile: formData.mobile,
      Gothram: formData.gothram || "N/A",
      Occasion: formData.occasion || "N/A",
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(bookingData),
      });
      const mDay = selectedDate.split("-").slice(1).join("-");
      setBookingsMap((prev: any) => ({
        ...prev,
        [mDay]: [
          ...(prev[mDay] || []),
          {
            devoteeName: formData.devoteeName,
            familyName: formData.familyName,
          },
        ],
      }));
      setView("success");
    } catch (error) {
      alert("Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const MonthGrid = ({ year, month }: { year: number; month: number }) => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    const firstDay = new Date(year, month, 1).getDay();
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="mb-8 bg-white/90 p-6 rounded-2xl shadow-sm border border-orange-100">
        <h3 className="text-xl font-bold text-[#8B0000] mb-4 text-center">
          {lang === "te"
            ? translations.te.months[month]
            : translations.en.months[month]}{" "}
          {year}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {t.days.map((d: string) => (
            <div key={d} className="text-[10px] font-bold text-orange-800">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => (
            <div key={`b-${b}`}></div>
          ))}
          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const mDay = `${String(month + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);
            const oneYearOut = new Date(today);
            oneYearOut.setFullYear(today.getFullYear() + 1);

            const isPast = cellDate < today;
            const isTooFar = cellDate > oneYearOut;
            const hasBooking = (bookingsMap[mDay] || []).length > 0;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                disabled={isPast || isTooFar}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setIsDialogOpen(true);
                }}
                className={`h-10 rounded-full text-sm font-bold transition-all
                  ${isSelected ? "bg-red-600 text-white" : "text-gray-800"}
                  ${
                    isPast || isTooFar
                      ? "opacity-20 cursor-not-allowed"
                      : "hover:bg-orange-50"
                  }
                  ${
                    hasBooking && !isPast && !isTooFar
                      ? "border-2 border-green-500"
                      : ""
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-12 font-sans selection:bg-orange-200">
      <header className="bg-[#8B0000] text-white sticky top-0 z-50 border-b-4 border-yellow-500 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="w-10">
            {view !== "calendar" && (
              <button onClick={() => setView("calendar")}>
                <ArrowLeft />
              </button>
            )}
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="flex gap-2 text-yellow-400 text-[10px] mb-1">
              <Bell size={10} />
              <span className="font-serif">ॐ</span>
              <Bell size={10} />
            </div>
            <h1 className="text-lg font-serif font-extrabold tracking-widest">
              {t.title}
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

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {view === "calendar" && (
          <div>
            <div className="flex bg-white border border-orange-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
              <Search className="text-orange-300 mr-2" />
              <input
                type="tel"
                maxLength={10}
                placeholder={t.searchPlaceholder}
                className="w-full outline-none text-sm"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>

            {searchQuery.length === 10 && (
              <div className="mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3">
                  {t.searchResultTitle}
                </h3>
                {filteredSearch.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSearch.map((b, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white p-3 rounded-xl border border-orange-100"
                      >
                        <span className="text-sm font-bold text-gray-900">
                          {b.DevoteeName}
                        </span>
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                          {formatDateLabel(b.Date)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    {t.noBookingsFound}
                  </p>
                )}
              </div>
            )}

            <h2 className="text-xl font-bold text-[#8B0000] text-center mb-6">
              {t.selectDate}
            </h2>
            {generateRollingYear().map((m, i) => (
              <MonthGrid key={i} year={m.year} month={m.month} />
            ))}
          </div>
        )}

        {view === "form" && (
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-orange-50 relative">
              <div className="absolute top-4 right-8 text-gray-100 opacity-20">
                <Flame size={80} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#8B0000] mb-4">
                {t.devoteeDetails}
              </h2>
              <div className="flex gap-4">
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 text-sm font-bold text-orange-800">
                  <CalendarIcon size={16} className="text-orange-400" />{" "}
                  {formatDateLabel(selectedDate)}
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 text-sm font-bold text-orange-800">
                  <Clock size={16} className="text-orange-400" /> 08:00 AM
                  (Nitya Pooja)
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.devoteeName}
                  </label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="Enter devotee name"
                    onChange={(e) =>
                      setFormData({ ...formData, devoteeName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.familyName}
                  </label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="Enter family name"
                    onChange={(e) =>
                      setFormData({ ...formData, familyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.fatherName}
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="Enter father's name"
                    onChange={(e) =>
                      setFormData({ ...formData, fatherName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.mobile}
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="Enter 10-digit mobile number"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.gothram}
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="e.g. Kashyapa"
                    onChange={(e) =>
                      setFormData({ ...formData, gothram: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.occasion}
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder="e.g. Birthday, Anniversary"
                    onChange={(e) =>
                      setFormData({ ...formData, occasion: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                disabled={isSubmitting}
                className="w-full py-5 bg-[#8B0000] text-white font-bold rounded-xl shadow-lg hover:bg-red-900 transition-all uppercase tracking-widest"
              >
                {isSubmitting ? t.saving : t.confirm}
              </button>
            </form>
          </div>
        )}

        {view === "success" && (
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-green-500 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#8B0000] mb-2">
              {t.success}
            </h2>
            <p className="text-sm text-gray-700 font-medium mb-8 italic">
              {t.blessings}
              {formData.devoteeName}. 🙏
            </p>

            {/* --- RECEIPT BOX --- */}
            <div className="bg-[#FFFBF2] rounded-2xl p-6 mb-8 text-left border border-orange-100 shadow-sm">
              <div className="flex justify-between items-center py-3 border-b border-orange-100">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.poojaLabel}
                </span>
                <span className="font-bold text-red-900">Nitya Pooja</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b border-orange-100">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.dateLabel}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatDateLabel(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.timeLabel}
                </span>
                <span className="font-bold text-gray-900">08:00 AM</span>
              </div>
            </div>

            <button
              onClick={() => {
                setView("calendar");
                setSearchQuery("");
              }}
              className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-xl uppercase tracking-widest"
            >
              {t.back}
            </button>
          </div>
        )}

        {isDialogOpen && selectedDate && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-red-800 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">{formatDateLabel(selectedDate)}</h3>
                <button onClick={() => setIsDialogOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-red-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <User size={16} /> {t.bookedDevotees}
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
                  {(
                    bookingsMap[selectedDate.split("-").slice(1).join("-")] ||
                    []
                  ).map((b: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 bg-orange-50 rounded-lg flex justify-between items-center border border-orange-100"
                    >
                      <span className="font-bold text-gray-900">
                        {b.devoteeName}
                      </span>
                      <span className="text-xs text-orange-700 font-medium italic">
                        {b.familyName} Family
                      </span>
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
                    setView("form");
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
