/* ==========================================================================
   LOADER
   ========================================================================== */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        if (loader) loader.style.opacity = "0";
        setTimeout(() => {
            if (loader) loader.style.display = "none";
        }, 500);
    }, 1200);
});

/* ==========================================================================
   PROGRESS BAR
   ========================================================================== */
window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    const pb = document.getElementById("progressBar");
    if (pb) pb.style.width = scrolled + "%";
});

/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
const hiddenElements = document.querySelectorAll(".hidden");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

hiddenElements.forEach(el => observer.observe(el));

/* ==========================================================================
   COUNTERS ANIMATION
   ========================================================================== */
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute("data-target");
            let current = 0;
            const increment = target / 100;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

/* ==========================================================================
   TEAM SWIPER INITIALIZATION
   ========================================================================== */
let swiper;

function initSwiper(isRtl = false) {
    if (swiper) {
        swiper.destroy(true, false); 
    }

    swiper = new Swiper(".teamSwiper", {
        rtl: isRtl,
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev"
        },
        breakpoints: {
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1.2 }
        }
    });
}

// تشغيل السوايبير لأول مرة
initSwiper(false);

/* ==========================================================================
   LANGUAGE TOGGLE SYSTEM
   ========================================================================== */
let arabic = false;
const langBtn = document.getElementById("langBtn");

if (langBtn) {
    langBtn.addEventListener("click", () => {
        arabic = !arabic;

        const title = document.getElementById("hero-title");
        const translatableElements = document.querySelectorAll(".translate-me");

        if (arabic) {
            document.body.dir = "rtl";
            langBtn.innerText = "EN";

            if (title && title.getAttribute("data-ar")) title.innerText = title.getAttribute("data-ar");

            translatableElements.forEach(el => {
                if (el.getAttribute("data-ar")) {
                    el.textContent = el.getAttribute("data-ar");
                }
            });

            initSwiper(true);

        } else {
            document.body.dir = "ltr";
            langBtn.innerText = "AR";

            if (title && title.getAttribute("data-en")) title.innerText = title.getAttribute("data-en");

            translatableElements.forEach(el => {
                if (el.getAttribute("data-en")) {
                    el.textContent = el.getAttribute("data-en");
                }
            });

            initSwiper(false);
        }
    });
}

/* ==========================================================================
   GSAP HERO ANIMATIONS (تأمين الأنيميشن في حال غياب العناصر)
   ========================================================================== */
if (document.querySelector(".hero-badge")) gsap.from(".hero-badge", { opacity: 0, y: -50, duration: 1 });
if (document.getElementById("hero-title")) gsap.from("#hero-title", { opacity: 0, y: 100, duration: 1.5 });
if (document.getElementById("hero-desc")) gsap.from("#hero-desc", { opacity: 0, y: 100, delay: 0.4, duration: 1.5 });
if (document.querySelector(".hero-buttons")) gsap.from(".hero-buttons", { opacity: 0, y: 100, delay: 0.8, duration: 1.5 });

/* ==========================================================================
   GSAP SCROLLTRIGGER FOR SECTIONS
   ========================================================================== */
gsap.utils.toArray(".section-title").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%"
        },
        opacity: 0,
        y: 80,
        duration: 1
    });
});

if (document.querySelector(".stat-box")) {
    gsap.from(".stat-box", {
        scrollTrigger: {
            trigger: ".stats",
            start: "top 75%"
        },
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1
    });
}

if (document.querySelector(".project-card")) {
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: "#projects",
            start: "top 75%"
        },
        opacity: 0,
        y: 150,
        stagger: 0.25,
        duration: 1
    });
}

/* ==========================================================================
   FLOATING GLOW EFFECT
   ========================================================================== */
document.addEventListener("mousemove", (e) => {
    const glow1 = document.querySelector(".glow1");
    const glow2 = document.querySelector(".glow2");
    if (!glow1 || !glow2) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    glow1.style.transform = `translate(${x * 80}px, ${y * 80}px)`;
    glow2.style.transform = `translate(${-x * 80}px, ${-y * 80}px)`;
});

/* ==========================================================================
   HERO TEXT CHANGE LOOP (فقط إذا كان العنوان ظاهراً في الـ HTML)
   ========================================================================== */
const heroTexts = [
    "Turning Ideas Into Digital Solutions",
    "Creating Modern Experiences",
    "Building Future Technologies",
    "Elite Digital Innovation"
];
let currentText = 0;

if (document.getElementById("hero-title")) {
    setInterval(() => {
        if (document.body.dir === "rtl") return;

        currentText++;
        if (currentText >= heroTexts.length) currentText = 0;

        gsap.to("#hero-title", {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
                const titleElement = document.getElementById("hero-title");
                if (titleElement) {
                    titleElement.innerText = heroTexts[currentText];
                    gsap.to("#hero-title", { opacity: 1, duration: 0.4 });
                }
            }
        });
    }, 5000);
}

/* ==========================================================================
   PARALLAX SCROLL EFFECT ON HERO
   ========================================================================== */
if (document.querySelector(".hero-content")) {
    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;
        gsap.to(".hero-content", { y: scroll * 0.2, duration: 0.3 });
    });
}

/* ==========================================================================
   RANDOM FLOATING BACKGROUND ICONS
   ========================================================================== */
const icons = ["💻", "🚀", "⚡", "🌐", "📱", "🖥️"];

for (let i = 0; i < 15; i++) {
    const icon = document.createElement("div");
    icon.classList.add("floating-icon");
    icon.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    icon.style.left = Math.random() * 100 + "%";
    icon.style.animationDuration = (8 + Math.random() * 10) + "s";
    document.body.appendChild(icon);
}