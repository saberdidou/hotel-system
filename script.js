// ========== تهيئة Firebase ==========
const firebaseConfig = {
    apiKey: "AIzaSyAvYjTt7i6uemVI1kjBvr5cX2goQOxcpQc",
  authDomain: "hotel-fateh.firebaseapp.com",
  projectId: "hotel-fateh",
  storageBucket: "hotel-fateh.firebasestorage.app",
  messagingSenderId: "85068053057",
  appId: "1:85068053057:web:0c6b4f01491361ddeda4c0",
  measurementId: "G-8RV4E7SZR7"
};

// ⚠️ استبدل هذه البيانات ببيانات مشروعك من Firebase Console

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== بيانات الدخول ==========
const ADMIN_USER = "admin";
const ADMIN_PASS = "fatah123";

// ========== قائمة الغرف ==========
const ROOMS = [
    "102 F3", "103 F3", "104 F4", "105 F4",
    "106 F3", "107 F3", "108 F4", "109 F3",
    "201 F3", "202 F4", "203 F4", "204 F4",
    "205 F3", "206 F3", "207 F3", "208 F3",
    "209 F3", "210 F3"
];

// ========== تهيئة قاعدة البيانات ==========
async function initFirestore() {
    const snapshot = await db.collection("bookings").limit(1).get();
    if (snapshot.empty) {
        for (let i = 0; i < 60; i++) {
            let d = new Date();
            d.setDate(d.getDate() + i);
            let date = d.toISOString().split("T")[0];
            let data = {};
            ROOMS.forEach(room => {
                data[room] = { status: "available", customer: "", phone: "", address: "" };
            });
            await db.collection("bookings").doc(date).set(data);
        }
    }
}

// ========== قراءة الحجوزات ==========
async function getBookings() {
    const snapshot = await db.collection("bookings").get();
    let result = {};
    snapshot.forEach(doc => {
        result[doc.id] = doc.data();
    });
    return result;
}

// ========== حفظ الحجوزات ==========
async function saveBookings(bookings) {
    for (let [date, data] of Object.entries(bookings)) {
        await db.collection("bookings").doc(date).set(data);
    }
}

// ========== حجز جديد ==========
async function addBooking(date, room, fullName, phone, address, status) {
    let bookings = await getBookings();
    if (bookings[date] && bookings[date][room]?.status === "available") {
        bookings[date][room] = { status, customer: fullName, phone, address };
        await saveBookings(bookings);
        return true;
    }
    return false;
}

// ========== تحديث الحجز ==========
async function updateBooking(date, room, newStatus, fullName, phone, address) {
    let bookings = await getBookings();
    if (bookings[date] && bookings[date][room]) {
        bookings[date][room].status = newStatus;
        if (fullName !== undefined) bookings[date][room].customer = fullName;
        if (phone !== undefined) bookings[date][room].phone = phone;
        if (address !== undefined) bookings[date][room].address = address;
        if (newStatus === "available") {
            bookings[date][room].customer = "";
            bookings[date][room].phone = "";
            bookings[date][room].address = "";
        }
        await saveBookings(bookings);
        return true;
    }
    return false;
}

// ========== تغيير الغرفة ==========
async function changeRoom(date, oldRoom, newRoom, customer, phone, address) {
    let bookings = await getBookings();
    if (bookings[date] && bookings[date][oldRoom] && bookings[date][newRoom]?.status === "available") {
        let oldData = bookings[date][oldRoom];
        bookings[date][newRoom] = { status: oldData.status, customer: oldData.customer, phone: oldData.phone, address: oldData.address };
        bookings[date][oldRoom] = { status: "available", customer: "", phone: "", address: "" };
        await saveBookings(bookings);
        return true;
    }
    return false;
}

// ========== تمديد الإقامة ==========
async function extendStay(startDate, room, customer, phone, address, extraDays) {
    let bookings = await getBookings();
    let extended = 0;
    for (let i = 1; i <= extraDays; i++) {
        let d = new Date(startDate);
        d.setDate(d.getDate() + i);
        let newDate = d.toISOString().split("T")[0];
        if (bookings[newDate] && bookings[newDate][room]?.status === "available") {
            bookings[newDate][room] = { status: "checkin", customer, phone, address };
            extended++;
        }
    }
    if (extended > 0) await saveBookings(bookings);
    return extended;
}

// ========== إلغاء الحجز ==========
async function cancelBooking(date, room) {
    return await updateBooking(date, room, "available", "", "", "");
}

// ========== إحصائيات ==========
async function updateStats() {
    let bookings = await getBookings();
    let today = new Date().toISOString().split("T")[0];
    let stats = { confirmed: 0, checkin: 0, future: 0, checkout: 0, maintenance: 0 };
    if (bookings[today]) {
        ROOMS.forEach(room => {
            let s = bookings[today][room]?.status;
            if (s === "checkin") stats.checkin++;
            else if (s === "future") stats.future++;
            else if (s === "checkout") stats.checkout++;
            else if (s === "maintenance") stats.maintenance++;
        });
    }
    stats.confirmed = stats.checkin + stats.future;
    document.getElementById("statConfirmed").innerText = stats.confirmed;
    document.getElementById("statCheckin").innerText = stats.checkin;
    document.getElementById("statFuture").innerText = stats.future;
    document.getElementById("statCheckout").innerText = stats.checkout;
    document.getElementById("statMaintenance").innerText = stats.maintenance;
}

let currentStartDate = new Date();

// ========== عرض الجدول ==========
async function renderTable() {
    let bookings = await getBookings();
    let dates = [];
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentStartDate);
        d.setDate(currentStartDate.getDate() + i);
        dates.push(d);
    }
    
    let headerHtml = "<tr><th>الغرفة / التاريخ</th>";
    dates.forEach(d => {
        headerHtml += `<th>${d.toLocaleDateString("ar-EG", { weekday: "short" })} ${d.getDate()}</th>`;
    });
    headerHtml += "</table>";
    document.getElementById("tableHead").innerHTML = headerHtml;
    
    let bodyHtml = "";
    ROOMS.forEach(room => {
        bodyHtml += `<tr><td style="text-align:right; font-weight:bold;">${room}</td>`;
        dates.forEach(date => {
            let dateStr = date.toISOString().split("T")[0];
            let booking = bookings[dateStr]?.[room];
            let status = booking?.status || "available";
            let customer = booking?.customer || "";
            let phone = booking?.phone || "";
            let address = booking?.address || "";
            
            let className = "", displayText = "";
            if (status === "available") { className = "room-available"; displayText = "⬜ شاغرة"; }
            else if (status === "checkin") { className = "room-checkin"; displayText = `🟢 ${customer}`; }
            else if (status === "future") { className = "room-future"; displayText = `🔵 ${customer}`; }
            else if (status === "checkout") { className = "room-checkout"; displayText = `🔴 ${customer}`; }
            else if (status === "maintenance") { className = "room-maintenance"; displayText = "⚪ صيانة"; }
            
            let info = (status !== "available" && status !== "maintenance") ? `<small>📞 ${phone}<br>📍 ${address}</small><br>` : "";
            let btn = `<button class="action-btn" onclick='openAction("${dateStr}","${room}","${customer}","${phone}","${address}","${status}")'>تعديل</button>`;
            bodyHtml += `<td class="${className}">${displayText}<br>${info}${btn}</td>`;
        });
        bodyHtml += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = bodyHtml;
    document.getElementById("weekRange").innerHTML = `${dates[0].getDate()}/${dates[0].getMonth()+1} - ${dates[6].getDate()}/${dates[6].getMonth()+1}`;
    await updateStats();
}

// ========== المتغيرات والأحداث (بنفس الطريقة السابقة) ==========
let currentEdit = { date: "", room: "", customer: "", phone: "", address: "", status: "" };

window.openAction = function(date, room, customer, phone, address, status) {
    currentEdit = { date, room, customer, phone, address, status };
    if (status === "available") {
        document.getElementById("newRoomNumber").innerText = room;
        document.getElementById("newBookingDate").innerText = date;
        document.getElementById("customerFullName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerAddress").value = "";
        document.getElementById("newBookingModal").style.display = "flex";
    } else {
        document.getElementById("editCustomerName").innerText = customer || "—";
        document.getElementById("editRoomNumber").innerText = room;
        document.getElementById("editDate").innerText = date;
        document.getElementById("editPhone").value = phone || "";
        document.getElementById("editAddress").value = address || "";
        document.getElementById("statusSelect").value = status;
        document.getElementById("editModal").style.display = "flex";
    }
};

document.getElementById("confirmNewBooking").onclick = async () => {
    let name = document.getElementById("customerFullName").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();
    let address = document.getElementById("customerAddress").value.trim();
    if (!name || !phone) { alert("الاسم والهاتف مطلوبان"); return; }
    let today = new Date();
    let bookingDate = new Date(currentEdit.date);
    let diffDays = Math.ceil((bookingDate - today) / (1000*60*60*24));
    let status = diffDays > 3 ? "future" : "checkin";
    if (await addBooking(currentEdit.date, currentEdit.room, name, phone, address, status)) {
        alert("تم الحجز بنجاح");
        document.getElementById("newBookingModal").style.display = "none";
        await renderTable();
    } else alert("فشل الحجز");
};

document.getElementById("closeNewModal").onclick = () => document.getElementById("newBookingModal").style.display = "none";
document.getElementById("closeEditModal").onclick = () => document.getElementById("editModal").style.display = "none";
document.getElementById("doExtend").onclick = async () => {
    let days = parseInt(document.getElementById("extendDays").value);
    if (days > 0 && currentEdit.customer) {
        let extended = await extendStay(currentEdit.date, currentEdit.room, currentEdit.customer, currentEdit.phone, currentEdit.address, days);
        alert(`تم تمديد ${extended} يوم`);
        document.getElementById("editModal").style.display = "none";
        await renderTable();
    } else alert("لا يمكن التمديد");
};
document.getElementById("doChangeRoom").onclick = async () => {
    let newRoom = document.getElementById("changeRoomSelect").value;
    if (!newRoom) { alert("اختر غرفة"); return; }
    if (await changeRoom(currentEdit.date, currentEdit.room, newRoom, currentEdit.customer, currentEdit.phone, currentEdit.address)) {
        alert("تم تغيير الغرفة");
        document.getElementById("editModal").style.display = "none";
        await renderTable();
    } else alert("لا يمكن التغيير");
};
document.getElementById("updateStatusBtn").onclick = async () => {
    let newStatus = document.getElementById("statusSelect").value;
    let newPhone = document.getElementById("editPhone").value;
    let newAddress = document.getElementById("editAddress").value;
    if (await updateBooking(currentEdit.date, currentEdit.room, newStatus, currentEdit.customer, newPhone, newAddress)) {
        alert("تم تحديث الحالة");
        document.getElementById("editModal").style.display = "none";
        await renderTable();
    }
};
document.getElementById("cancelBookingBtn").onclick = async () => {
    if (confirm("إلغاء الحجز نهائياً؟")) {
        await cancelBooking(currentEdit.date, currentEdit.room);
        alert("تم الإلغاء");
        document.getElementById("editModal").style.display = "none";
        await renderTable();
    }
};
document.getElementById("prevWeek").onclick = () => { currentStartDate.setDate(currentStartDate.getDate() - 7); renderTable(); };
document.getElementById("nextWeek").onclick = () => { currentStartDate.setDate(currentStartDate.getDate() + 7); renderTable(); };
document.getElementById("resetAll").onclick = async () => {
    if (confirm("حذف كل الحجوزات نهائياً؟")) {
        let bookings = await getBookings();
        for (let date in bookings) {
            ROOMS.forEach(room => {
                bookings[date][room] = { status: "available", customer: "", phone: "", address: "" };
            });
        }
        await saveBookings(bookings);
        await renderTable();
        alert("تم إعادة التعيين");
    }
};

// ========== تسجيل الدخول ==========
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        let u = document.getElementById("username").value;
        let p = document.getElementById("password").value;
        if (u === ADMIN_USER && p === ADMIN_PASS) {
            localStorage.setItem("loggedIn", "yes");
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("loginError").innerText = "بيانات خاطئة";
        }
    });
}

// ========== لوحة التحكم ==========
if (window.location.pathname.includes("dashboard.html")) {
    if (localStorage.getItem("loggedIn") !== "yes") window.location.href = "index.html";
    await initFirestore();
    await renderTable();
    document.getElementById("todayDate").innerText = new Date().toLocaleDateString("ar-EG");
    document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem("loggedIn"); window.location.href = "index.html"; };
    
    // تحديث قائمة الغرف المتاحة في نافذة التعديل
    setInterval(async () => {
        let bookings = await getBookings();
        let select = document.getElementById("changeRoomSelect");
        if (select && currentEdit.date && currentEdit.room) {
            select.innerHTML = '<option value="">اختر غرفة</option>';
            ROOMS.forEach(r => {
                if (r !== currentEdit.room && bookings[currentEdit.date] && bookings[currentEdit.date][r]?.status === "available") {
                    select.innerHTML += `<option value="${r}">${r}</option>`;
                }
            });
        }
    }, 2000);
}