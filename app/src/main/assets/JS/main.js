let fixedNav = document.querySelector(".header");

window.addEventListener("scroll", () => {
    window.scrollY > 100
        ? fixedNav.classList.add("active")
        : fixedNav.classList.remove("active");
});

let hadithContainer = document.querySelector(".hadith-container"),
    next = document.querySelector(".buttons .next"),
    prev = document.querySelector(".buttons .prev"),
    number = document.querySelector(".number");

let hadithIndex = parseInt(localStorage.getItem("hadithIndex")) || 1; // قراءة قيمة الحديث من localStorage
let totalHadiths = 0;

HadithChanger();

function HadithChanger() {
    fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
        .then((response) => response.json())
        .then((data) => {
            let hadiths = data.data.hadiths;
            totalHadiths = hadiths.length;
            hadithContainer.innerText = hadiths[hadithIndex - 1].arab;
            number.innerText = `${hadithIndex}/${totalHadiths}`;
        })
        .catch((error) => console.error("Error fetching hadith:", error));
}

function updateHadithIndex(newIndex) {
    hadithIndex = newIndex;
    localStorage.setItem("hadithIndex", hadithIndex); // حفظ الحديث في localStorage
    HadithChanger();
}

next.addEventListener("click", () => {
    if (hadithIndex < totalHadiths) {
        updateHadithIndex(hadithIndex + 1);
    }
});

prev.addEventListener("click", () => {
    if (hadithIndex > 1) {
        updateHadithIndex(hadithIndex - 1);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".header .bars");
    const menuIcon = menuButton.querySelector(".icon");
    const navList = document.querySelector(".header ul");
    const body = document.body;

    menuButton.addEventListener("click", () => {
        navList.classList.toggle("menu-active");

        if (navList.classList.contains("menu-active")) {
            menuIcon.classList.remove("fa-bars"); // إزالة أيقونة القائمة
            menuIcon.classList.add("fa-times"); // إضافة أيقونة الإغلاق
            body.style.overflow = "hidden"; // إيقاف التمرير في الخلفية
        } else {
            menuIcon.classList.remove("fa-times"); // إزالة أيقونة الإغلاق
            menuIcon.classList.add("fa-bars"); // إضافة أيقونة القائمة
            body.style.overflow = "auto"; // استئناف التمرير في الخلفية
        }
    });

    // إغلاق القائمة عند النقر على أي عنصر
    document.querySelectorAll(".header ul li").forEach((menuItem) => {
        menuItem.addEventListener("click", (event) => {
            event.preventDefault(); // منع السلوك الافتراضي
            navList.classList.remove("menu-active");
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
            body.style.overflow = "auto"; // استئناف التمرير

            const targetSection = document.querySelector(
                menuItem.getAttribute("data-target")
            );
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    clearLocalStorageExceptHadithIndex(); // استدعاء دالة لحذف البيانات من localStorage
});

function clearLocalStorageExceptHadithIndex() {
    // تخزين قيمة hadithIndex
    const hadithIndexValue = localStorage.getItem("hadithIndex");

    // مسح كل البيانات في localStorage
    localStorage.clear();

    // إعادة إضافة hadithIndex إلى localStorage
    if (hadithIndexValue) {
        localStorage.setItem("hadithIndex", hadithIndexValue);
    }
}

let sections = document.querySelectorAll("section"),
    links = document.querySelectorAll("header ul li");

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        let targetSection = document.querySelector(
            link.getAttribute("data-target")
        );

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
            document
                .querySelector(".header ul li.active")
                ?.classList.remove("active");
            link.classList.add("active");
        }
    });
});

function activateLink(link) {
    document.querySelector(".header ul li.active")?.classList.remove("active");
    link.classList.add("active");
}

window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
        if (pageYOffset >= section.offsetTop - 60) {
            currentSection = `#${section.getAttribute("id")}`;
        }
    });
    if (currentSection) {
        let activeLink = document.querySelector(
            `header ul li[data-target="${currentSection}"]`
        );
        if (activeLink) {
            activateLink(activeLink);
        }
    }
});

let surahsContainer = document.querySelector(".surahsContainer");
let modal = document.getElementById("modal");
let modalClose = document.querySelector(".close");
let surahName = document.getElementById("surahName");
let surahContent = document.getElementById("surahContent");

getSurahs();

function getSurahs() {
    fetch("https://api.alquran.cloud/v1/meta")
    .then((response) => response.json())
    .then((data) => {
        let surahs = data.data.surahs.references;
        surahsContainer.innerHTML = "";
        for (let i = 0; i < 114; i++) {
            surahsContainer.innerHTML += `
                <div class="surah" data-index="${i + 1}">
                    <p>${surahs[i].name}</p>
                    <p>${surahs[i].englishName}</p>
                </div>
            `;
        }
        document.querySelectorAll(".surah").forEach((surah) => {
            surah.addEventListener("click", () => {
                openSurah(surah.getAttribute("data-index"));
            });
        });
    })
    .catch((error) => console.log("Error:", error));

}

function openSurah(index) {
    function openSurah(index) {
        fetch(`https://api.alquran.cloud/v1/surah/${index}`)
            .then((response) => response.json())
            .then((data) => {
                surahName.textContent = data.data.name;
                let ayahs = data.data.ayahs
                    .map(
                        (ayah) =>
                            `<p>${ayah.text} <span class="ayah-number">(${ayah.numberInSurah})</span></p>`
                    )
                    .join("");
                surahContent.innerHTML = ayahs;
                surahContent.scrollTop = 0;
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
                loadingMessage.style.display = "none"; // إخفاء رسالة التحميل
            })
            .catch((error) => {
                console.log("Error:", error);
                loadingMessage.style.display = "none"; // إخفاء رسالة التحميل عند حدوث خطأ
            });
    }
    
}

modalClose.addEventListener("click", closeModal); // ربط علامة "X" بدالة الإغلاق

// إزالة كل الأكواد المتعلقة بحفظ موضع القراءة
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
});

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});
const apiKey = "YOUR_API_KEY"; // ضع هنا مفتاح API الخاص بك
const lat = 30.0444; // خط عرض القاهرة
const lon = 31.2357; // خط طول القاهرة
const method = 5; // الهيئة المصرية العامة للمساحة
const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=${method}&key=${apiKey}`;

// تحويل الوقت من صيغة 24 ساعة إلى 12 ساعة
function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour);
    const period = hourInt >= 12 ? "م" : "ص";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${period}`;
}

// Fetch prayer times and Hijri date from API
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const timings = data.data.timings;
        const date = data.data.date.hijri;

        // Display prayer times
        document.getElementById(
            "fajr-time"
        ).innerText = `الفجر: ${convertTo12HourFormat(timings.Fajr)}`;
        document.getElementById(
            "dhuhr-time"
        ).innerText = `الظهر: ${convertTo12HourFormat(timings.Dhuhr)}`;
        document.getElementById(
            "asr-time"
        ).innerText = `العصر: ${convertTo12HourFormat(timings.Asr)}`;
        document.getElementById(
            "maghrib-time"
        ).innerText = `المغرب: ${convertTo12HourFormat(timings.Maghrib)}`;
        document.getElementById(
            "isha-time"
        ).innerText = `العشاء: ${convertTo12HourFormat(timings.Isha)}`;

        // Display Hijri date
        document.getElementById(
            "hijri-date"
        ).innerText = `التقويم الهجري: ${date.day} ${date.month.ar} ${date.year}`;
    })
    .catch((error) => {
        console.error("Error fetching prayer times or Hijri date:", error);
    });
const bars = document.querySelector(".header .bars");
const navMenu = document.querySelector(".header ul");
const body = document.body;

// إظهار أو إخفاء القائمة عند الضغط على الأيقونة
bars.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // إيقاف أو استئناف التمرير في الخلفية
    if (navMenu.classList.contains("active")) {
        body.style.overflow = "hidden"; // إيقاف التمرير
    } else {
        body.style.overflow = "auto"; // استئناف التمرير
    }
});

// إغلاق القائمة عند النقر على أي عنصر في القائمة
document.querySelectorAll(".header ul li").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); // منع السلوك الافتراضي

        // إغلاق القائمة
        navMenu.classList.remove("active");

        // استئناف التمرير في الخلفية
        body.style.overflow = "auto";

        // التمرير السلس إلى القسم المستهدف
        const targetSection = document.querySelector(
            link.getAttribute("data-target")
        );
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
    });
});

let lastScrollTop = 0; // لتخزين قيمة آخر موضع للتمرير
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // إذا كان المستخدم يقوم بالتمرير للأسفل، إخفاء الـ navbar
        header.style.top = "-100px"; // إخفاء الـ navbar
    } else {
        // إذا كان المستخدم يقوم بالتمرير لأعلى، إظهار الـ navbar
        header.style.top = "0";
    }

    lastScrollTop = scrollTop; // تحديث قيمة آخر موضع للتمرير
});

// جلب زر الصعود
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// إضافة مستمع لحدث التمرير (scroll)
window.addEventListener("scroll", () => {
    // إذا كانت مسافة التمرير أكبر من 300px، أظهر الزر
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
});

// إضافة مستمع لحدث النقر على الزر
scrollToTopBtn.addEventListener("click", () => {
    // الصعود إلى الأعلى بسلاسة
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

let loadingMessage = document.getElementById("loadingMessage"); // عنصر رسالة التحميل

function openSurah(index) {
    // إظهار رسالة التحميل
    loadingMessage.style.display = "block";

    fetch(`https://api.alquran.cloud/v1/surah/${index}`)
        .then((response) => response.json())
        .then((data) => {
            surahName.textContent = data.data.name;
            let ayahs = data.data.ayahs
                .map(
                    (ayah) =>
                        `<p>${ayah.text} <span class="ayah-number">(${ayah.numberInSurah})</span></p>`
                )
                .join("");
            surahContent.innerHTML = ayahs;

            surahContent.scrollTop = 0;

            modal.style.display = "block";
            document.body.style.overflow = "hidden";

            // إخفاء رسالة التحميل بعد إتمام الجلب
            loadingMessage.style.display = "none";

            // إظهار زر إغلاق السورة وإخفاء زر الصعود
            scrollToTopBtn.style.display = "none";
            closeSurahBtn.style.display = "block";
        })
        .catch((error) => {
            console.log("Error:", error);
            // في حالة حدوث خطأ، إخفاء رسالة التحميل
            loadingMessage.style.display = "none";
        });
}
function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    scrollToTopBtn.style.display = "block";
    closeSurahBtn.style.display = "none";
    loadingMessage.style.display = "none"; // إخفاء رسالة التحميل عند إغلاق السورة
}
let closeSurahBtn = document.getElementById("closeSurahBtn"); // زر إغلاق السورة

closeSurahBtn.addEventListener("click", closeModal); // ربط زر إغلاق السورة بدالة إغلاق الـ modal

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal(); // استدعاء دالة إغلاق النافذة
    }
});
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal(); // استدعاء دالة إغلاق النافذة
    }
});

HadithChanger();

function HadithChanger() {
    // إظهار نص "جاري التحميل..." داخل الحاوية قبل الجلب
    hadithContainer.innerText = "جاري التحميل...";

fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
    .then((response) => response.json())
    .then((data) => {
        let hadiths = data.data.hadiths;
        totalHadiths = hadiths.length;
        hadithContainer.innerText = hadiths[hadithIndex - 1].arab;
        number.innerText = `${hadithIndex}/${totalHadiths}`;
    })
    .catch((error) => {
        console.error("Error fetching hadith:", error);
        hadithContainer.innerText = "حدث خطأ أثناء تحميل الحديث.";
    });

}

function updateHadithIndex(newIndex) {
    hadithIndex = newIndex;
    localStorage.setItem("hadithIndex", hadithIndex); // حفظ الحديث في localStorage
    HadithChanger();
}

document
    .getElementById("startBrowsingBtn")
    .addEventListener("click", function () {
        document
            .getElementById("hadith-section")
            .scrollIntoView({ behavior: "smooth" });
    });

// عند تحميل الصفحة بالكامل، نخفي شاشة التحميل
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("main-content");

    // إخفاء شاشة التحميل مع تأثير
    preloader.classList.add("hidden");

    // إظهار المحتوى الرئيسي بعد اختفاء شاشة التحميل
    setTimeout(() => {
        preloader.style.display = "none";
        mainContent.style.display = "block";
    }, 500); // تأخير لتأثير الاختفاء
});

// دالة لمنع التمرير
function preventScroll() {
    document.body.style.overflow = "hidden";
}

// دالة للسماح بالتدفق
function allowScroll() {
    document.body.style.overflow = "";
}

// عندما يبدأ التحميل
document.addEventListener("DOMContentLoaded", function () {
    preventScroll(); // منع التمرير عند تحميل الصفحة
});

// عندما ينتهي التحميل
window.addEventListener("load", function () {
    allowScroll(); // السماح بالتدفق بعد تحميل الصفحة
});



 // API mock
// API mock
const azkarData = {
    sabah: [
        "سبحان الله وبحمده",
        "الحمد لله رب العالمين",
        "لا إله إلا الله وحده لا شريك له",
        "اللهم بك أصبحنا وبك أمسينا",
        "رضيت بالله ربا وبالإسلام دينا وبمحمد صلى الله عليه وسلم نبيا",
        "اللهم إني أسألك علما نافعا ورزقا طيبا وعملا متقبلا"
    ],
    masaa: [
        "أمسينا وأمسى الملك لله",
        "اللهم بك أمسينا وبك نحيا",
        "سبحان الله العظيم",
        "أعوذ بكلمات الله التامات من شر ما خلق",
        "اللهم صل وسلم على نبينا محمد",
        "اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل"
    ],
    noom: [
        "باسمك اللهم أموت وأحيا",
        "اللهم أسلمت نفسي إليك",
        "اللهم اغفر لي وارحمني",
        "اللهم إني أسألك العافية في الدنيا والآخرة",
        "اللهم إني أعوذ بك من سوء القضاء ومن درك الشقاء ومن شماتة الأعداء",
        "اللهم إني أعوذ بك من النار"
    ]
};


// Function to toggle the visibility of the azkar list
function toggleAzkarList(event) {
    const azkarType = event.target.getAttribute('data-azkar');
    const azkarContent = document.getElementById(`${azkarType}-azkar`);

    // Toggle the display
    if (azkarContent.style.display === "none" || azkarContent.style.display === "") {
        // Close all other lists
        document.querySelectorAll('.azkar-content').forEach(content => {
            content.style.display = 'none';
        });
        // Open the clicked list
        azkarContent.style.display = "block";
    } else {
        azkarContent.style.display = "none";
    }
}

// Load the Azkar into the content
function loadAzkar() {
    for (const type in azkarData) {
        const ul = document.getElementById(`${type}-azkar`);
        azkarData[type].forEach(zekr => {
            const li = document.createElement('li');
            li.textContent = zekr;
            ul.appendChild(li);
        });
    }
}

// Event listener for title clicks
document.querySelectorAll('.azkar-title').forEach(title => {
    title.addEventListener('click', toggleAzkarList);
});

// Load Azkar initially
loadAzkar();




function playAdhan(audioId) {
    const audioElement = document.getElementById(audioId);
    if (audioElement) {
        audioElement.play()
            .then(() => console.log("الصوت يعمل بنجاح"))
            .catch((error) => console.error("خطأ في تشغيل الصوت:", error));
    }
}

// استدعاء الدالة لتشغيل الصوت
playAdhan("audio1"); playAdhan("audio2"); playAdhan("audio3"); playAdhan("audio4"); playAdhan("audio5"); 

document.addEventListener("DOMContentLoaded", () => {
    const audios = document.querySelectorAll("audio");

    // توقف جميع ملفات الصوت عند تحميل الصفحة
    audios.forEach(audio => audio.pause());

    // إضافة مستمع تشغيل على كل ملف صوتي
    audios.forEach((audio) => {
        audio.addEventListener('play', () => {
            // عندما يتم تشغيل أحد ملفات الصوت، توقف الباقي
            audios.forEach((otherAudio) => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                    otherAudio.currentTime = 0;  // إعادة التوقيت للصفر
                }
            });
        });
    });
});