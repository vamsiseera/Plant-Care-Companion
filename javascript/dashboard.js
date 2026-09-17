/* =========================================
   PLANT CARE COMPANION
   DASHBOARD EXPERIENCE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       DYNAMIC GREETING
    ========================================= */

    const greetingElement =
        document.querySelector(".greeting");

    if (greetingElement) {

        const hour = new Date().getHours();

        let greeting = "Good evening";

        if (hour >= 5 && hour < 12) {
            greeting = "Good morning";
        } else if (hour >= 12 && hour < 17) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        greetingElement.textContent = greeting;
    }


    /* =========================================
       CURRENT DATE
    ========================================= */

    const dateElements =
        document.querySelectorAll(
            "#currentDate, .current-date, [data-current-date]"
        );

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    dateElements.forEach(function (element) {
        element.textContent = formattedDate;
    });


    /* =========================================
       CURSOR GLOW
    ========================================= */

    const cursorGlow =
        document.getElementById("dashboardCursorGlow");

    if (cursorGlow) {

        document.addEventListener("mousemove", function (event) {

            cursorGlow.style.left =
                event.clientX + "px";

            cursorGlow.style.top =
                event.clientY + "px";

        });

    }


    /* =========================================
       ANIMATED COUNTERS
    ========================================= */

    const counters =
        document.querySelectorAll(".counter");

    counters.forEach(function (counter) {

        const target =
            parseInt(counter.dataset.target || counter.textContent, 10);

        if (isNaN(target)) {
            return;
        }

        let current = 0;

        const duration = 900;

        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress =
                Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            current =
                Math.floor(target * eased);

            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);

    });


    /* =========================================
       WATER BUTTONS
    ========================================= */

    const waterButtons =
        document.querySelectorAll(".water-button");

    waterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (button.classList.contains("watered")) {
                showDashboardToast("This plant is already watered 🌱");
                return;
            }

            button.classList.add("watered");

            button.textContent = "✓ Watered";

            button.disabled = true;

            const card =
                button.closest(
                    ".plant-card, .dashboard-plant-card, .plant-item"
                );

            if (card) {

                const status =
                    card.querySelector(
                        ".plant-status, .status, .water-status"
                    );

                if (status) {
                    status.textContent = "Watered today";
                }

            }

            showDashboardToast(
                "🌱 Plant watered successfully!"
            );

        });

    });


    /* =========================================
       BUTTON RIPPLE
    ========================================= */

    document.querySelectorAll("button").forEach(function (button) {

        button.addEventListener("click", function (event) {

            const ripple =
                document.createElement("span");

            ripple.className = "button-ripple";

            const rect =
                button.getBoundingClientRect();

            const size =
                Math.max(rect.width, rect.height);

            ripple.style.width = size + "px";
            ripple.style.height = size + "px";

            ripple.style.left =
                event.clientX - rect.left - size / 2 + "px";

            ripple.style.top =
                event.clientY - rect.top - size / 2 + "px";

            button.appendChild(ripple);

            setTimeout(function () {
                ripple.remove();
            }, 600);

        });

    });


    /* =========================================
       FLOATING PARTICLES
    ========================================= */

    const particlesContainer =
        document.getElementById("dashboardParticles");

    if (particlesContainer) {

        for (let i = 0; i < 18; i++) {

            const particle =
                document.createElement("span");

            particle.className =
                "dashboard-particle";

            particle.style.left =
                Math.random() * 100 + "%";

            particle.style.top =
                Math.random() * 100 + "%";

            particle.style.animationDelay =
                Math.random() * 5 + "s";

            particle.style.animationDuration =
                5 + Math.random() * 6 + "s";

            particlesContainer.appendChild(particle);

        }

    }


    /* =========================================
       HERO PLANT PARALLAX
    ========================================= */

    const heroPlant =
        document.querySelector(".hero-plant");

    if (heroPlant) {

        document.addEventListener("mousemove", function (event) {

            const x =
                (event.clientX / window.innerWidth - 0.5) * 10;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 10;

            heroPlant.style.transform =
                `translate(${x}px, ${y}px)`;

        });

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    if (menuButton && sidebar) {

        menuButton.addEventListener("click", function () {

            sidebar.classList.toggle("open");

        });

    }


    /* =========================================
       CLOSE MOBILE SIDEBAR
    ========================================= */

    if (sidebar) {

        sidebar.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                sidebar.classList.remove("open");

            });

        });

    }


    /* =========================================
       NOTIFICATIONS
    ========================================= */

    const notificationButton =
        document.getElementById("notificationButton");

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                showDashboardToast(
                    "🔔 No new plant care notifications."
                );

            }
        );

    }


    /* =========================================
       NAVIGATION FEEDBACK
    ========================================= */

    document.querySelectorAll(".sidebar a").forEach(function (link) {

        link.addEventListener("click", function () {

            link.classList.add("nav-clicked");

            setTimeout(function () {
                link.classList.remove("nav-clicked");
            }, 250);

        });

    });


    /* =========================================
       PAGE READY
    ========================================= */

    document.body.classList.add("dashboard-ready");

});


/* =========================================
   DASHBOARD TOAST
========================================= */

function showDashboardToast(message) {

    let toast =
        document.getElementById("dashboardToast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "dashboardToast";

        toast.className =
            "dashboard-toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.dashboardToastTimer);

    window.dashboardToastTimer =
        setTimeout(function () {

            toast.classList.remove("show");

        }, 2500);

}