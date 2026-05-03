// هذا مثال لكود الربط (استبدله بالكود الخاص بك من Firebase)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDS5Tqo28G3BqegvLh5B5C4TrGErXF4lBE",
  authDomain: "residence-fateh.firebaseapp.com",
  projectId: "residence-fateh",
  storageBucket: "residence-fateh.firebasestorage.app",
  messagingSenderId: "586535049957",
  appId: "1:586535049957:web:fa579692dbf6cda9bd120c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دالة لجلب الحجوزات وعرضها في الجدول
async function loadBookings() {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // هنا نكتب كود لإضافة البيانات للجدول في HTML
    });
}

loadBookings();