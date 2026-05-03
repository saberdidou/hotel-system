# 📋 دليل النشر الكامل — إقامة فاتح
## من VSCode إلى الإنترنت خطوة بخطوة

---

## 📁 هيكل المشروع
```
residence-fateh/
├── index.html          ← الملف الرئيسي
├── style.css           ← التصميم
├── assets/
│   └── logo.png        ← اللوغو
└── GUIDE.md            ← هذا الدليل
```

---

## 🔥 الخطوة 1: إنشاء مشروع Firebase

### 1.1 — إنشاء الحساب
1. اذهب إلى: **https://firebase.google.com**
2. اضغط **Get started** → سجّل دخول بحساب Google
3. اضغط **Create a project**
4. اسم المشروع: `residence-fateh`
5. Google Analytics: اضغط **Continue** ثم **Create project**

### 1.2 — إنشاء قاعدة البيانات (Firestore)
1. من القائمة الجانبية: **Build → Firestore Database**
2. اضغط **Create database**
3. اختر **Start in test mode** (مؤقتاً)
4. اختر المنطقة: `europe-west1` (الأقرب للجزائر)
5. اضغط **Done**

### 1.3 — إنشاء Authentication
1. من القائمة الجانبية: **Build → Authentication**
2. اضغط **Get started**
3. اختر **Email/Password** → فعّله → **Save**
4. اذهب إلى **Users** → اضغط **Add user**:
   - Email: `admin@fateh-hotel.com`
   - Password: (اختر كلمة مرور قوية)
   - اضغط **Add user**
5. كرر لإضافة مستخدم ثانٍ:
   - Email: `fateh@fateh-hotel.com`
   - Password: (اختر كلمة مرور)

### 1.4 — الحصول على إعدادات Firebase
1. من **Project settings** (ترس الإعدادات)
2. مرر للأسفل → **Your apps** → اضغط **</>** (Web app)
3. اسم التطبيق: `fateh-web`
4. **لا تفعّل** Firebase Hosting
5. اضغط **Register app**
6. **انسخ** الكود الذي يظهر — يبدو هكذا:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "residence-fateh-xxx.firebaseapp.com",
  projectId: "residence-fateh-xxx",
  storageBucket: "residence-fateh-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 1.5 — لصق الإعدادات في الكود
1. افتح `index.html` في VSCode
2. ابحث عن هذا السطر:
   ```
   apiKey: "PASTE_YOUR_API_KEY_HERE",
   ```
3. **استبدل كل القيم** بالقيم التي نسختها من Firebase

---

## 🔒 الخطوة 2: قواعد الأمان (Firestore Rules)

1. في Firebase → **Firestore Database** → **Rules**
2. **احذف** النص الموجود وضع هذا:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{booking} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. اضغط **Publish**

هذا يعني: فقط المستخدمون الذين سجّلوا دخولهم يمكنهم قراءة وكتابة البيانات.

---

## 🐙 الخطوة 3: رفع الكود على GitHub

### 3.1 — إنشاء حساب GitHub
1. اذهب إلى: **https://github.com**
2. اضغط **Sign up** → أنشئ حساباً مجانياً

### 3.2 — إنشاء Repository
1. اضغط **New repository** (أو الزر +)
2. اسم المشروع: `residence-fateh`
3. اختر **Public**
4. اضغط **Create repository**

### 3.3 — رفع الملفات
1. في صفحة الـ Repository → اضغط **uploading an existing file**
2. **اسحب وأفلت** جميع ملفات المشروع:
   - `index.html`
   - `style.css`
   - مجلد `assets/` (مع `logo.png` بداخله)
3. اضغط **Commit changes**

---

## 🚀 الخطوة 4: النشر على Vercel

### 4.1 — إنشاء حساب Vercel
1. اذهب إلى: **https://vercel.com**
2. اضغط **Sign Up** → اختر **Continue with GitHub**
3. سجّل دخولك بنفس حساب GitHub

### 4.2 — نشر المشروع
1. اضغط **New Project**
2. ستظهر قائمة بـ repositories → ابحث عن `residence-fateh`
3. اضغط **Import**
4. الإعدادات:
   - Framework Preset: **Other**
   - Root Directory: `/`
5. اضغط **Deploy**
6. انتظر دقيقة...

### 4.3 — رابط الموقع 🎉
ستحصل على رابط مثل:
```
https://residence-fateh.vercel.app
```
**هذا الرابط يعمل 24/7 مجاناً من أي هاتف أو كمبيوتر في العالم!**

---

## 🔄 الخطوة 5: التحديث في المستقبل

كلما أردت تعديل الكود:
1. عدّل الملفات في VSCode
2. ارفعها على GitHub (Commit changes)
3. Vercel **تحدّث تلقائياً** خلال ثوانٍ!

---

## 🛡️ نصائح أمان مهمة

### تغيير كلمة المرور
- اذهب إلى Firebase Authentication → Users
- اضغط على المستخدم → **Reset password**

### منع الوصول غير المصرح به
- في Firestore Rules، تأكد من أن القاعدة `request.auth != null` موجودة

### النسخ الاحتياطي
- Firebase يحفظ البيانات تلقائياً على خوادم Google
- يمكنك التصدير من: Firestore → **Export data**

---

## 🆘 مشاكل شائعة وحلولها

| المشكلة | الحل |
|---------|------|
| "Firebase: Error (auth/wrong-password)" | تحقق من كلمة المرور في Firebase Auth |
| "Missing or insufficient permissions" | تحقق من Firestore Rules |
| اللوغو لا يظهر | تأكد أن `logo.png` موجود في مجلد `assets/` |
| البيانات لا تُحفظ | تحقق من إعدادات `firebaseConfig` |

---

## 📞 معلومات الفندق في النظام
- **الاسم:** مجمع نسيب للعطل الداخلية
- **RÉSIDENCE FATEH TOURISME**
- **العنوان:** Cité 176 logements, zone urbaine ouest, Biskra
- **هاتف:** 0555009760 · 0555009758 · 0555009761
- **فاكس:** 033500954 · 023201086
- **البريد:** fatehresidence@gmail.com

---

*تم إنشاء هذا النظام خصيصاً لإقامة فاتح — جميع البيانات محفوظة على Firebase (Google)*
