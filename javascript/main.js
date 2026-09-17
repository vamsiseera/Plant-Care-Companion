/* =========================================
   PLANT CARE COMPANION
   GLOBAL INTERACTIONS
========================================= */


/* Mouse-following glow */

const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow) {

    document.addEventListener("mousemove", function (event) {

        cursorGlow.style.left = event.clientX + "px";
        cursorGlow.style.top = event.clientY + "px";

    });

}


/* =========================================
   FLOATING PARTICLES
========================================= */

const particleContainer =
    document.getElementById("particles");

if (particleContainer) {

    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement("div");

        particle.classList.add("particle");

        const size =
            Math.random() * 3 + 1;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.animationDuration =
            Math.random() * 12 + 10 + "s";

        particle.style.animationDelay =
            Math.random() * 10 + "s";

        particleContainer.appendChild(particle);

    }

}