/* =====================================================
   DATA BARANG
===================================================== */

let items = JSON.parse(
    localStorage.getItem("findYourItemItems")
) || [

    {
        id: 1,
        name: "Dompet Kulit Hitam",
        category: "Dompet & Tas",
        date: "2026-09-20",
        location: "Stasiun MRT Lebak Bulus",
        description:
            "Dompet kulit warna hitam, terdapat beberapa kartu di dalamnya.",
        icon: "👛",
        status: "Menunggu Pemilik"
    },

    {
        id: 2,
        name: "Kunci Motor",
        category: "Kunci",
        date: "2026-09-21",
        location: "Area Parkir Mall",
        description:
            "Satu set kunci motor dengan gantungan berwarna biru.",
        icon: "🔑",
        status: "Menunggu Pemilik"
    },

    {
        id: 3,
        name: "Botol Minum",
        category: "Lainnya",
        date: "2026-09-22",
        location: "Taman Kota",
        description:
            "Botol minum warna putih dengan stiker kecil di bagian depan.",
        icon: "🥤",
        status: "Menunggu Pemilik"
    },

    {
        id: 4,
        name: "Earphone Wireless",
        category: "Elektronik",
        date: "2026-09-23",
        location: "Kafe dekat kampus",
        description:
            "Earphone wireless warna putih berada di dalam charging case.",
        icon: "🎧",
        status: "Menunggu Pemilik"
    }

];


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderItems();

    updateStatistics();

    setTodayDate();

});


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {

    const homePage =
        document.getElementById("homePage");

    const reportPage =
        document.getElementById("reportPage");

    const navHome =
        document.getElementById("navHome");

    const navReport =
        document.getElementById("navReport");


    if (page === "home") {

        homePage.classList.remove("hidden");

        reportPage.classList.add("hidden");

        navHome.classList.add("active");

        navReport.classList.remove("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (page === "report") {

        homePage.classList.add("hidden");

        reportPage.classList.remove("hidden");

        navHome.classList.remove("active");

        navReport.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =====================================================
   RENDER ITEMS
===================================================== */

function renderItems(filteredItems = items) {

    const container =
        document.getElementById("itemsContainer");

    const emptyState =
        document.getElementById("emptyState");


    container.innerHTML = "";


    if (filteredItems.length === 0) {

        emptyState.classList.remove("hidden");

        return;

    }

    emptyState.classList.add("hidden");


    filteredItems.forEach(item => {

        const card =
            document.createElement("article");

        card.className = "item-card";


        card.innerHTML = `

            <div class="item-image">
                ${item.icon || "📦"}
            </div>

            <div class="item-body">

                <div class="item-category">
                    ${escapeHTML(item.category)}
                </div>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p class="item-description">
                    ${escapeHTML(item.description)}
                </p>

                <div class="item-location">
                    📍 ${escapeHTML(item.location)}
                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =====================================================
   SEARCH
===================================================== */

function searchItems() {

    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filtered =
        items.filter(item => {

            const matchesSearch =

                item.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                item.description
                    .toLowerCase()
                    .includes(searchValue)

                ||

                item.location
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                !category ||
                item.category === category;


            return matchesSearch && matchesCategory;

        });


    renderItems(filtered);

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        items.length;

    const waiting =
        items.filter(
            item => item.status === "Menunggu Pemilik"
        ).length;


    document.getElementById(
        "totalItems"
    ).textContent = total;


    document.getElementById(
        "waitingItems"
    ).textContent = waiting;


    document.getElementById(
        "returnedItems"
    ).textContent =
        items.filter(
            item => item.status === "Berhasil Dikembalikan"
        ).length;

}


/* =====================================================
   DATE
===================================================== */

function setTodayDate() {

    const input =
        document.getElementById("foundDate");

    if (!input) return;


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(today.getDate())
            .padStart(2, "0");


    input.value =
        `${year}-${month}-${day}`;

}


/* =====================================================
   REPORT FORM
===================================================== */

document
    .getElementById("reportForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("itemName")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const date =
            document
                .getElementById("foundDate")
                .value;


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const photo =
            document
                .getElementById("photo")
                .value
                .trim();


        const newItem = {

            id: Date.now(),

            name: name,

            category: category,

            date: date,

            location: location,

            description: description,

            photo: photo,

            icon: getCategoryIcon(category),

            status: "Menunggu Pemilik"

        };


        items.unshift(newItem);


        localStorage.setItem(
            "findYourItemItems",
            JSON.stringify(items)
        );


        updateStatistics();


        document
            .getElementById("reportForm")
            .reset();


        setTodayDate();


        document
            .getElementById("successModal")
            .classList.remove("hidden");

    });


/* =====================================================
   CATEGORY ICON
===================================================== */

function getCategoryIcon(category) {

    const icons = {

        "Dompet & Tas": "👛",

        "Elektronik": "🎧",

        "Kunci": "🔑",

        "Dokumen": "📄",

        "Lainnya": "📦"

    };


    return icons[category] || "📦";

}


/* =====================================================
   MODAL
===================================================== */

function closeModal() {

    document
        .getElementById("successModal")
        .classList.add("hidden");


    showPage("home");

    renderItems();

}


/* =====================================================
   ADMIN
===================================================== */

function adminLogin() {

    const password =
        prompt("Masukkan password admin:");


    if (password === null) {
        return;
    }


    /*
       Demo password.

       Untuk website production,
       autentikasi harus dilakukan
       di backend.
    */

    if (password === "admin123") {

        showToast(
            "Login admin berhasil."
        );

    } else {

        showToast(
            "Password admin salah."
        );

    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =====================================================
   BASIC HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
