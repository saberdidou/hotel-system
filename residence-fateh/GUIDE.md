# دليل النشر الكامل — إقامة فاتح
## من الصفر إلى الإنترنت — خطوة بخطوة

---

## هيكل المشروع
```
residence-fateh/
├── index.html     ← الموقع الكامل
├── style.css      ← التصميم
├── GUIDE.md       ← هذا الدليل
└── assets/
    └── logo.png   ← لوغو الفندق
```

---

## الخطوة 1 — تحميل VSCode

1. اذهب إلى: https://code.visualstudio.com
2. اضغط الزر الأزرق Download for Windows
3. افتح الملف وثبته (Next → Next → Install → Finish)
4. افتح VSCode
5. اضغط File ← Open Folder
6. اختر مجلد residence-fateh

---

## الخطوة 2 — Firebase (قاعدة البيانات)

### 2.1 إنشاء الحساب
1. اذهب: https://firebase.google.com
2. اضغط Get started
3. سجل دخول بـ Gmail
4. اضغط Create a project
5. اسم المشروع: residence-fateh
6. اضغط Continue ← Continue ← Create project ← Continue

### 2.2 إنشاء قاعدة البيانات
1. القائمة اليسرى: Build ← Firestore Database
2. اضغط Create database
3. اختر Start in test mode
4. اضغط Next
5. اختر المنطقة: europe-west1
6. اضغط Enable
7. انتظر دقيقة

### 2.3 قواعد الأمان
1. اضغط تبويب Rules
2. احذف كل النص الموجود
3. الصق هذا:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{booking} {
      allow read, write: if request.auth != null;
    }
  }
}

4. اضغط Publish

### 2.4 تفعيل تسجيل الدخول
1. القائمة اليسرى: Build ← Authentication
2. اضغط Get started
3. اضغط Email/Password
4. فعل المفتاح الأول
5. اضغط Save

### 2.5 إضافة المستخدمين
1. اضغط تبويب Users
2. اضغط Add user
3. Email: admin@fateh-hotel.com
   Password: اختر كلمة مرور قوية مثلاً Fateh@2024
4. اضغط Add user
(كرر لإضافة مستخدم ثانٍ إذا أردت)

### 2.6 نسخ إعدادات Firebase
1. اضغط أيقونة الترس بجانب Project Overview
2. اضغط Project settings
3. مرر للأسفل إلى Your apps
4. اضغط أيقونة </> (Web)
5. App nickname: fateh-web
6. لا تضع علامة على Firebase Hosting
7. اضغط Register app
8. انسخ الكود الذي يظهر (firebaseConfig)
9. اضغط Continue to console

---

## الخطوة 3 — تعديل الكود في VSCode

1. افتح ملف index.html في VSCode
2. اضغط Ctrl+F وابحث عن: PASTE_YOUR_API_KEY_HERE
3. ستجد هذا الجزء:

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};

4. احذف هذه الأسطر واستبدلها بالإعدادات التي نسختها من Firebase
5. احفظ: Ctrl+S

---

## الخطوة 4 — رفع الكود على GitHub

### 4.1 إنشاء حساب
1. اذهب: https://github.com
2. اضغط Sign up
3. أدخل البريد الإلكتروني واسم المستخدم وكلمة المرور
4. تحقق من بريدك (أدخل الكود المرسل)

### 4.2 إنشاء مستودع
1. اضغط الزر الأخضر New (أو + في الأعلى)
2. Repository name: residence-fateh
3. اختر Public
4. اضغط Create repository

### 4.3 رفع الملفات
1. اضغط على رابط uploading an existing file
2. افتح مجلد residence-fateh على جهازك
3. اضغط Ctrl+A لتحديد كل الملفات والمجلدات
4. اسحبها وأفلتها في نافذة GitHub
5. انتظر حتى يكتمل الرفع
6. في الأسفل اكتب: first upload
7. اضغط Commit changes

---

## الخطوة 5 — النشر على Vercel (مجاناً)

### 5.1 إنشاء حساب
1. اذهب: https://vercel.com
2. اضغط Sign Up
3. اضغط Continue with GitHub
4. اضغط Authorize Vercel

### 5.2 نشر المشروع
1. اضغط Add New ← Project
2. ابحث عن residence-fateh واضغط Import
3. Framework Preset: اختر Other
4. اضغط Deploy
5. انتظر دقيقتين...

### 5.3 رابطك جاهز
ستحصل على رابط مثل:
https://residence-fateh.vercel.app

احفظ هذا الرابط — يمكنك فتحه من أي هاتف أو كمبيوتر!

---

## تسجيل الدخول للمرة الأولى

1. افتح رابط موقعك
2. اسم المستخدم: admin
3. كلمة المرور: الكلمة التي اخترتها في Firebase Auth
4. اضغط دخول

---

## مشاكل شائعة وحلولها

كلمة مرور غير صحيحة:
← تحقق من Firebase Auth وتأكد من البريد وكلمة المرور

البيانات لا تُحفظ:
← تحقق من أن firebaseConfig في index.html صحيح

اللوغو لا يظهر:
← تأكد أن logo.png موجود داخل مجلد assets

الموقع لا يفتح:
← افتح Vercel Dashboard وتحقق من أنه deployed

---

## التكلفة: 0 دج — كل شيء مجاني 100%

Firebase: 50,000 قراءة يومياً مجاناً
GitHub: مستودعات عامة مجانية
Vercel: استضافة مجانية 24/7
