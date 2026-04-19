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
  ChevronRight,
} from "lucide-react";

// Replace this with your actual Web App URL from Google Apps Script
const GOOGLE_SHEET_URL: string =
  "https://script.google.com/macros/s/AKfycbwTKGgh_07E2mkg58lztoPb3ibH4fgAq5Mmmf2ZuVDfLN1yxlAXPFjaZ0PgXGNha2vbhA/exec";

const translations: any = {
  te: {
    title: "శ్రీ అభయ ఆంజనేయ స్వామి ఎస్. సడ్లపల్లి",
    popupTitle1: "శ్రీ అభయ ఆంజనేయ స్వామి, S సడ్లపల్లి",
    popupTitle2: "",
    searchPlaceholder: "మొబైల్ నంబర్‌తో వెతకండి...",
    searchResultTitle: "మీ రాబోయే బుకింగ్‌లు:",
    noBookingsFound: "డేటా ఏదీ కనిపించలేదు.",
    selectDate: "పూజ తేదీని ఎంచుకోండి",
    devoteeDetails: "భక్తుల వివరాలు",
    devoteeName: "భక్తుని పేరు *",
    familyName: "ఇంటి పేరు *",
    fatherName: "తండ్రి పేరు",
    mobile: "మొబైల్ నంబర్ *",
    mobileLabel: "మొబైల్ నంబర్",
    gothram: "గోత్రం",
    occasion: "సందర్భం",
    confirm: "నిత్య పూజను నిర్ధారించండి",
    saving: "సేవ్ అవుతోంది...",
    success: "బుకింగ్ నిర్ధారించబడింది!",
    blessings:
      "శ్రీ అభయ ఆంజనేయ స్వామి ఆశీస్సులు మీ కుటుంబానికి ఎల్లప్పుడూ ఉండాలి, ",
    feeNotice:
      "పూజ రుసుము ₹1,000/- ను కమిటీ సభ్యులకు మాత్రమే ఇవ్వగలరని వినయపూర్వకంగా మనవి.",
    back: "మరో పూజను బుక్ చేయండి",
    noBookings: "ఈ తేదీకి ఇంకా బుకింగ్‌లు లేవు.",
    bookedDevotees: "నిత్య పూజ కార్యక్రమానికి బుక్ చేసిన భక్తులు",
    poojaLabel: "పూజ",
    dateLabel: "తేదీ",
    timeLabel: "సమయం",
    mobileAlert: "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.",
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
    phDevoteeName: "భక్తుని పేరు నమోదు చేయండి",
    phFamilyName: "ఇంటి పేరు నమోదు చేయండి",
    phFatherName: "తండ్రి పేరు నమోదు చేయండి",
    phMobile: "10-అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
    phGothram: "ఉదా. కశ్యప",
    phOccasion: "ఉదా. పుట్టినరోజు, పెళ్లిరోజు",
    nityaPooja: "నిత్య పూజ",
    timeAm: "ఉదయం 08:00",
    familySuffix: "కుటుంబం",
    bookPoojaBtn: "నిత్య పూజను బుక్ చేయండి",
    langToggle: "ENGLISH",
    viewDetails: "వివరాలు",
    backToList: "జాబితాకు తిరిగి వెళ్లండి",
  },
  en: {
    title: "SRI ABHAYA ANJANEYA SWAMY S. SADLAPALLI",
    popupTitle1: "SRI ABHAYA ANJANEYA SWAMY",
    popupTitle2: "S. SADLAPALLI",
    searchPlaceholder: "Search by mobile number...",
    searchResultTitle: "Your Upcoming Bookings:",
    noBookingsFound: "No records found.",
    selectDate: "Select Pooja Date",
    devoteeDetails: "Devotee Details",
    devoteeName: "Devotee Name *",
    familyName: "Family Name *",
    fatherName: "Father Name",
    mobile: "Mobile Number *",
    mobileLabel: "Mobile Number",
    gothram: "Gothram",
    occasion: "Occasion",
    confirm: "Confirm Nitya Pooja",
    saving: "Saving...",
    success: "Booking Confirmed!",
    blessings:
      "May Sri Abhaya Anjaneya Swamy's blessings be upon you and your family, ",
    feeNotice:
      "We humbly request you to hand over the pooja fee of ₹1,000/- only to the committee members.",
    back: "Book Another Pooja",
    noBookings: "No bookings for this date yet.",
    bookedDevotees: "Devotees Booked for Nitya Pooja",
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
    phDevoteeName: "Enter devotee name",
    phFamilyName: "Enter family name",
    phFatherName: "Enter father's name",
    phMobile: "Enter 10-digit mobile number",
    phGothram: "e.g. Kashyapa",
    phOccasion: "e.g. Birthday, Anniversary",
    nityaPooja: "Nitya Pooja",
    timeAm: "08:00 AM",
    familySuffix: "Family",
    bookPoojaBtn: "Book Nitya Pooja",
    langToggle: "తెలుగు",
    viewDetails: "Details",
    backToList: "Back to List",
  },
};

export default function App() {
  const [lang, setLang] = useState<"te" | "en">("te");
  const t = translations[lang];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<string>("calendar");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDevotee, setSelectedDevotee] = useState<any | null>(null);
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

  // FETCH DATA & NORMALIZE KEYS
  useEffect(() => {
    fetch(GOOGLE_SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        const normalizedData = data.map((row: any) => {
          const cleanRow: any = {};
          for (let key in row) {
            cleanRow[key.trim()] = row[key];
          }
          return cleanRow;
        });

        setRawBookings(normalizedData);

        const grouped: any = {};
        normalizedData.forEach((row: any) => {
          if (!row.Date) return;
          const monthDay = row.Date.split("-").slice(1).join("-");
          if (!grouped[monthDay]) grouped[monthDay] = [];

          grouped[monthDay].push({
            DevoteeName: row.DevoteeName || "N/A",
            FamilyName: row.FamilyName || "N/A",
            FatherName: row.FatherName || "N/A",
            Mobile: row.Mobile || "N/A",
            Gothram: row.Gothram || "N/A",
            Occasion: row.Occasion || "N/A",
            Date: row.Date,
          });
        });
        setBookingsMap(grouped);
      })
      .catch((err) => console.error("Error fetching sheet data:", err));
  }, []);

  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const monthIndex = parseInt(m) - 1;
    return `${parseInt(d)} ${translations[lang].months[monthIndex]}`;
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
      FamilyName: formData.familyName,
      FatherName: formData.fatherName || "N/A",
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
        [mDay]: [...(prev[mDay] || []), bookingData],
      }));
      setView("success");
    } catch (error) {
      alert("Error saving booking!");
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
      <div className="mb-8 bg-white/90 p-4 sm:p-6 rounded-2xl shadow-sm border border-orange-100">
        <h3 className="text-xl font-bold text-[#8B0000] mb-4 text-center">
          {translations[lang].months[month]} {year}
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
            const isPast = cellDate < today;
            const isTooFar =
              cellDate >
              new Date(new Date().setFullYear(today.getFullYear() + 1));
            const hasBooking = (bookingsMap[mDay] || []).length > 0;

            return (
              <button
                key={dateStr}
                disabled={isPast || isTooFar}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setIsDialogOpen(true);
                  setSelectedDevotee(null);
                }}
                className={`h-10 rounded-full text-sm font-bold transition-all
                  ${
                    selectedDate === dateStr
                      ? "bg-red-600 text-white"
                      : "text-gray-800"
                  }
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
          <div className="w-8 sm:w-10">
            {view !== "calendar" && (
              <button onClick={() => setView("calendar")} className="p-1">
                <ArrowLeft />
              </button>
            )}
          </div>
          <div className="text-center flex flex-col items-center max-w-[65%] sm:max-w-full">
            <div className="flex gap-2 text-yellow-400 text-[10px] mb-1">
              <Bell size={10} />
              <span className="font-serif">ॐ</span>
              <Bell size={10} />
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-serif font-extrabold tracking-widest leading-tight">
              {t.title}
            </h1>
          </div>
          <button
            onClick={() => setLang(lang === "te" ? "en" : "te")}
            className="bg-white/10 px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs border border-white/20 uppercase font-bold"
          >
            {t.langToggle}
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
              <div className="mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3">
                  {t.searchResultTitle}
                </h3>
                {filteredSearch.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSearch.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(b.Date);
                          setSelectedDevotee(b);
                          setIsDialogOpen(true);
                        }}
                        className="w-full flex justify-between items-center bg-white p-3 rounded-xl border border-orange-100 hover:border-red-300 transition-all text-left"
                      >
                        <span className="text-sm font-bold text-gray-900">
                          {b.DevoteeName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                            {formatDateLabel(b.Date)}
                          </span>
                          <ChevronRight size={14} className="text-gray-400" />
                        </div>
                      </button>
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
            <div className="p-6 sm:p-8 border-b border-orange-50 relative">
              <div className="absolute top-4 right-8 text-gray-100 opacity-20">
                <Flame size={80} fill="currentColor" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8B0000] mb-4">
                {t.devoteeDetails}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-800">
                  <CalendarIcon size={16} className="text-orange-400" />{" "}
                  {formatDateLabel(selectedDate)}
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-800">
                  <Clock size={16} className="text-orange-400" /> {t.timeAm} (
                  {t.nityaPooja})
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6 sm:space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.devoteeName}
                  </label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder={t.phDevoteeName}
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
                    placeholder={t.phFamilyName}
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
                    placeholder={t.phFatherName}
                    onChange={(e) =>
                      setFormData({ ...formData, fatherName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    {t.gothram}
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder={t.phGothram}
                    onChange={(e) =>
                      setFormData({ ...formData, gothram: e.target.value })
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
                    placeholder={t.phMobile}
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
                    {t.occasion}
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-orange-300"
                    placeholder={t.phOccasion}
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
          <div className="max-w-md mx-auto text-center bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border-t-8 border-green-500">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#8B0000] mb-2">
              {t.success}
            </h2>
            <p className="text-sm text-gray-700 font-medium mb-8 italic">
              {t.blessings}
              {formData.devoteeName}. 🙏
            </p>
            <div className="bg-[#FFFBF2] rounded-2xl p-6 mb-6 text-left border border-orange-100 shadow-sm">
              <div className="flex justify-between items-center py-3 border-b border-orange-100">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.poojaLabel}
                </span>
                <span className="font-bold text-red-900">{t.nityaPooja}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b border-orange-100">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.dateLabel}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatDateLabel(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  {t.timeLabel}
                </span>
                <span className="font-bold text-gray-900">{t.timeAm}</span>
              </div>
            </div>

            {/* --- NEW FEE NOTICE ADDED HERE --- */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-center shadow-sm">
              <p className="text-xs sm:text-sm text-red-800 font-medium leading-relaxed">
                {t.feeNotice}
              </p>
            </div>

            <button
              onClick={() => {
                setView("calendar");
                setSearchQuery("");
              }}
              className="w-full py-4 bg-[#8B0000] text-white font-bold rounded-xl uppercase tracking-widest text-sm"
            >
              {t.back}
            </button>
          </div>
        )}

        {isDialogOpen && selectedDate && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
              <div className="bg-[#8B0000] pt-6 pb-4 px-6 text-center relative shadow-sm border-b-4 border-yellow-500">
                {selectedDevotee && (
                  <button
                    onClick={() => setSelectedDevotee(null)}
                    className="absolute top-4 left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>

                <h2 className="text-[11px] min-[375px]:text-[12px] sm:text-sm md:text-base font-extrabold text-white mx-6 sm:mx-10 tracking-wide leading-snug">
                  <span className="block">{t.popupTitle1}</span>
                  {t.popupTitle2 && (
                    <span className="block mt-0.5 text-[10px] sm:text-xs">
                      {t.popupTitle2}
                    </span>
                  )}
                </h2>

                <p className="text-yellow-300 font-bold mt-1 text-sm tracking-widest">
                  ({formatDateLabel(selectedDate)})
                </p>
              </div>

              <div className="p-6 pt-5">
                {!selectedDevotee ? (
                  <>
                    <h4 className="font-bold text-red-800 mb-4 border-b border-orange-100 pb-2 flex items-center gap-1.5 text-[10.5px] min-[375px]:text-[12px] sm:text-sm whitespace-nowrap tracking-tight">
                      <User size={14} className="shrink-0" /> {t.bookedDevotees}
                    </h4>
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-1">
                      {(
                        bookingsMap[
                          selectedDate.split("-").slice(1).join("-")
                        ] || []
                      ).map((b: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDevotee(b)}
                          className="w-full p-3 bg-orange-50 rounded-lg flex justify-between items-center border border-orange-100 hover:border-red-300 transition-all text-left"
                        >
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {b.DevoteeName}
                            </span>
                            <span className="text-[10px] text-orange-700 font-medium italic">
                              {b.FamilyName} {t.familySuffix}
                            </span>
                          </div>
                          <ChevronRight size={16} className="text-orange-300" />
                        </button>
                      ))}
                      {!(
                        bookingsMap[
                          selectedDate.split("-").slice(1).join("-")
                        ] || []
                      ).length && (
                        <p className="text-gray-400 text-center py-4 text-sm italic">
                          {t.noBookings}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-3 mb-6">
                      <div className="flex justify-between border-b border-orange-100 pb-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.devoteeName.replace(" *", "")}
                        </span>
                        <span className="font-bold text-gray-900 text-right">
                          {selectedDevotee.DevoteeName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-orange-100 pb-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.fatherName}
                        </span>
                        <span className="font-medium text-gray-800 text-right">
                          {selectedDevotee.FatherName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-orange-100 pb-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.familyName.replace(" *", "")}
                        </span>
                        <span className="font-medium text-gray-800 text-right">
                          {selectedDevotee.FamilyName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-orange-100 pb-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.gothram}
                        </span>
                        <span className="font-medium text-gray-800 text-right">
                          {selectedDevotee.Gothram}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-orange-100 pb-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.mobileLabel}
                        </span>
                        <span className="font-medium text-gray-800 text-right">
                          {selectedDevotee.Mobile}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">
                          {t.occasion}
                        </span>
                        <span className="font-medium text-gray-800 text-right">
                          {selectedDevotee.Occasion}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDevotee(null)}
                      className="w-full py-2 text-red-700 text-sm font-bold flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={14} /> {t.backToList}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setView("form");
                  }}
                  className="w-full py-4 mt-2 bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                >
                  <Flame size={20} className="text-yellow-300" />{" "}
                  {t.bookPoojaBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
