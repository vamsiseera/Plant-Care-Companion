/* =========================================
   PLANT CARE COMPANION
   LOGIN EXPERIENCE
========================================= */


/* =========================================
   LOGIN FORM
========================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email")?.value.trim();

        const password =
            document.getElementById("password")?.value.trim();


        /* Basic validation */

        if (!email || !password) {

            showLoginMessage(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showLoginMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        /* Login animation */

        const button =
            loginForm.querySelector("button[type='submit']");

        if (button) {

            button.disabled = true;

            button.dataset.originalText =
                button.innerHTML;

            button.innerHTML =
                `<span class="login-spinner"></span> Signing in...`;
        }


        /*
            Demo login

            Later this will connect to the
            real Spring Boot backend.
        */

        setTimeout(function () {

            showLoginMessage(
                "Welcome back! Opening your garden...",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);


        }, 900);

    });

}


/* =========================================
   SHOW LOGIN MESSAGE
========================================= */

function showLoginMessage(message, type) {

    let messageBox =
        document.getElementById("loginMessage");


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "loginMessage";

        const form =
            document.getElementById("loginForm");

        if (form) {
            form.prepend(messageBox);
        }
    }


    messageBox.textContent =
        message;

    messageBox.className =
        "login-message " + type;


    /* Small animation */

    messageBox.style.animation =
        "none";

    requestAnimationFrame(function () {

        messageBox.style.animation =
            "loginMessageIn 0.3s ease";

    });

}


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

const passwordToggle =
    document.getElementById("passwordToggle");

const passwordInput =
    document.getElementById("password");


if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener(
        "click",
        function () {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword ? "text" : "password";


            passwordToggle.textContent =
                isPassword ? "Hide" : "Show";

        }
    );

}


/* =========================================
   INPUT FOCUS EFFECT
========================================= */

const loginInputs =
    document.querySelectorAll(
        ".login-form input"
    );


loginInputs.forEach(function (input) {

    input.addEventListener(
        "focus",
        function () {

            input.parentElement?.classList.add(
                "input-focused"
            );

        }
    );


    input.addEventListener(
        "blur",
        function () {

            input.parentElement?.classList.remove(
                "input-focused"
            );

        }
    );

});


/* =========================================
   ENTER KEY
========================================= */

loginInputs.forEach(function (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                loginForm?.requestSubmit();

            }

        }
    );

});


/* =========================================
   PAGE READY
========================================= */

document.body.classList.add(
    "login-ready"
);

console.log(
    "🌱 Plant Care Companion Login loaded."
);