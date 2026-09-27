# Shehab & Rahma — دعوة زفاف

دعوة زفاف تفاعلية لشهاب ورحمة، الإثنين ١٩ أكتوبر ٢٠٢٦، قاعات حياة للحفلات.

## الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` | هيكل الصفحة |
| `assets/js/config.js` | **كل بيانات الفرح**: الأسماء، الميعاد، القاعة، إيميل الردود، الأغنية |
| `assets/css/style.css` | الألوان والشكل |
| `assets/js/app.js` | الحركات، الظرف، الموسيقى، العداد، تأكيد الحضور |
| `assets/audio/song.mp3` | الأغنية (ارفعها بالاسم ده) |
| `favicon.svg`, `apple-touch-icon.png` | أيقونة الدعوة |

## التعديل

كل التعديلات العادية في `assets/js/config.js` بس:

- `rsvpEmail`: الإيميل اللي هتوصله ردود الضيوف (أول رد هيبعتلك إيميل تفعيل من FormSubmit، اضغط Activate مرة واحدة).
- `whatsapp`: رقم احتياطي للردود بالصيغة الدولية بدون `+`.
- `musicUrl`: مسار الأغنية.
- `autoScrollSpeed`: سرعة النزول التلقائي (0 لإيقافه).

## النشر على GitHub Pages

Settings ← Pages ← Deploy from a branch ← `main` و `/ (root)` ← Save.
اللينك: `https://islamel-sayed96.github.io/shehab-wedding/`
