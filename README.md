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
| `api/wishes.php` | حفظ الردود ورسائل التهنئة وعرضها في الموقع (PHP) |
| `api/admin.php` | صفحة متابعة الحضور للعروسين |
| `api/config.sample.php` | نموذج ملف الإعدادات (كلمة سر صفحة المتابعة) |
| `.htaccess` | ضغط الملفات والكاش على هوستنجر |
| `favicon.svg`, `apple-touch-icon.png` | أيقونة الدعوة |
| `og-image.jpg` | صورة الدعوة اللي بتظهر فوق اللينك في واتساب وفيسبوك وتليجرام (1200×630) |
| `assets/img/` | ملمس الورق |

## التعديل

كل التعديلات العادية في `assets/js/config.js` بس:

- `rsvpEmail`: الإيميل اللي هتوصله ردود الضيوف (أول رد هيبعتلك إيميل تفعيل من FormSubmit، اضغط Activate مرة واحدة).
- `whatsapp`: رقم احتياطي للردود بالصيغة الدولية بدون `+`.
- `musicUrl`: مسار الأغنية.
- `autoScrollSpeed`: سرعة النزول التلقائي (0 لإيقافه).

## النشر على GitHub Pages

Settings ← Pages ← Deploy from a branch ← `main` و `/ (root)` ← Save.
اللينك: `https://islamel-sayed96.github.io/shehab-wedding/` (نسخة تجريبية، الموقع الأساسي: `https://shehab-rahma.online/`)

## مشاركة اللينك

لما تبعت اللينك على واتساب هيظهر كارت فيه صورة الدعوة والعنوان والوصف.
واتساب بيحفظ المعاينة، فلو بعت اللينك قبل كده وظهر من غير صورة، ابعته المرة دي كده عشان يعيد القراءة:

```
https://shehab-rahma.online/?v=2
```

## الرفع على هوستنجر

رسائل التهنئة وصفحة المتابعة محتاجين PHP، فبيشتغلوا على هوستنجر بس (مش GitHub Pages).
على GitHub Pages الموقع بيشتغل عادي، وقسم رسائل التهنئة بيستخبى، والردود بتروح على الإيميل.

1. **hPanel → Websites → Manage → Advanced → Git**
   - Repository: `https://github.com/islamel-sayed96/shehab-wedding.git`
   - Branch: `main`، و Directory: سيبه فاضي (يعني `public_html`، ولازم يكون فاضي قبل أول مرة)
   - Create، وبعدين **Deploy**. وفعّل **Auto Deployment** عشان أي تعديل على GitHub ينزل لوحده.
2. **File Manager → public_html/api**: انسخ `config.sample.php` باسم `config.php`، وغيّر `admin_key` لكلمة سر طويلة (١٢ حرف على الأقل).
3. **SSL**: من hPanel فعّل SSL للدومين و Force HTTPS.
4. صفحة المتابعة: `https://الدومين/api/admin.php?key=كلمة_السر`
   فيها إجمالي الحضور، مين جاي ومين معتذر، كل الرسايل، إخفاء أو حذف أي رسالة، وتحميل الردود Excel.

الردود متخزنة في `api/data/wishes.json` على السيرفر (مش بيترفع على GitHub، ومفيش حد يقدر يفتحه من المتصفح).

لو نقلت الموقع لدومين جديد، غيّر اللينكات في أول `index.html` (`og:url` و `og:image` و `canonical`) للدومين الجديد عشان صورة المعاينة تظهر.
