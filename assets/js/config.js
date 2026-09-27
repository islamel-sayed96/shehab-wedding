/* ════════════════════════════════════════════════════════════
   عدّل بيانات الدعوة من هنا
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  groom: "شهاب",
  bride: "رحمة",
  groomEn: "Shehab",
  brideEn: "Rahma",
  mono: "S & R",
  // موعد الحفل (+03:00 = توقيت القاهرة الصيفي، ساري حتى آخر خميس في أكتوبر)
  date: "2026-10-19T20:00:00+03:00",
  endDate: "2026-10-20T00:00:00+03:00",
  rsvpBy: "2026-10-12T00:00:00+03:00",
  venueName: "قاعات حياة للحفلات",
  venueNameEn: "Hayat Banquet Halls",
  venueAddress: "شارع مصطفى كامل، بجوار ترعة البرنس",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Hayat+Banquet+Halls",
  mapEmbed: "https://www.google.com/maps?q=Hayat+Banquet+Halls&output=embed",
  // الإيميل اللي هتوصله ردود الضيوف ورسائلهم (عن طريق خدمة FormSubmit المجانية).
  // أول رد هيوصلك إيميل تفعيل من FormSubmit، اضغط Activate مرة واحدة بس.
  rsvpEmail: "",
  // رقم واتساب احتياطي بالصيغة الدولية بدون + (يُستخدم لو الإيميل مش متسجل أو الإرسال فشل)
  whatsapp: "",
  hashtag: "#Shehab_Rahma",
  // أغنية الدعوة: عامر منيب – "من أول يوم في لقانا".
  // ارفع ملف الأغنية بالاسم ده بالظبط: assets/audio/song.mp3
  // لو الملف مش موجود، الزفة الشرقية المدمجة هتشتغل بدالها تلقائياً.
  musicUrl: "assets/audio/song.mp3",
  // سرعة النزول التلقائي بعد فتح الدعوة (بكسل في الثانية)، 0 لإيقافه
  autoScrollSpeed: 42
};
