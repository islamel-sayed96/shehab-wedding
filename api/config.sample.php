<?php
// انسخ الملف ده على السيرفر باسم config.php وغيّر القيم.
// الملف config.php مش بيترفع على GitHub (موجود في .gitignore)، فكلمة السر بتفضل سرية.
return [
    // كلمة سر صفحة المتابعة: api/admin.php?key=كلمة_السر  (١٢ حرف على الأقل)
    'admin_key' => 'CHANGE-ME-to-a-long-secret',
    // أي كلام عشوائي، بيستخدم لإخفاء عناوين IP في الملف
    'salt' => 'CHANGE-ME-random-text',
];
