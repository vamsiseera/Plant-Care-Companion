/* =========================================
   PLANT CARE COMPANION
   SMART SCHEDULE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const storageKey = "plantCarePlants";

    const scheduleList =
        document.getElementById("scheduleList");

    const calendarGrid =
        document.getElementById("calendarGrid");

    const monthTitle =
        document.getElementById("monthTitle");

    const todayButton =
        document.getElementById("todayButton");

    const notificationButton =
        document.getElementById("notificationButton");


    /* =========================================
       STORAGE
    ========================================= */

    function getPlants() {

        try {

            return JSON.parse(
                localStorage.getItem(storageKey)
            ) || [];

        } catch (error) {

            return [];

        }
    }


    /* =========================================
       TOAST
    ========================================= */

    function showToast(message) {

        let toast =
            document.getElementById("scheduleToast");

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "scheduleToast";

            toast.className =
                "schedule-toast";

            document.body.appendChild(toast);
        }

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            window.scheduleToastTimer
        );

        window.scheduleToastTimer =
            setTimeout(function () {

                toast.classList.remove("show");

            }, 2500);
    }


    /* =========================================
       DATE HELPERS
    ========================================= */

    function startOfDay(date) {

        const result =
            new Date(date);

        result.setHours(
            0, 0, 0, 0
        );

        return result;
    }


    function getNextWatering(plant) {

        if (!plant.lastWatered) {
            return null;
        }

        const date =
            new Date(plant.lastWatered);

        const frequency =
            parseInt(
                plant.frequency,
                10
            ) || 7;

        date.setDate(
            date.getDate() + frequency
        );

        return startOfDay(date);
    }


    function formatDate(date) {

        if (!date) {
            return "Not scheduled";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    function getDayDifference(date) {

        const today =
            startOfDay(new Date());

        return Math.round(
            (
                startOfDay(date) -
                today
            ) /
            (1000 * 60 * 60 * 24)
        );
    }


    /* =========================================
       STATUS
    ========================================= */

    function getStatus(date) {

        if (!date) {

            return {
                text: "Not scheduled",
                className: "pending"
            };

        }

        const difference =
            getDayDifference(date);


        if (difference < 0) {

            return {
                text: "Overdue",
                className: "overdue"
            };

        }


        if (difference === 0) {

            return {
                text: "Water today",
                className: "today"
            };

        }


        if (difference === 1) {

            return {
                text: "Tomorrow",
                className: "soon"
            };

        }


        return {
            text: "In " + difference + " days",
            className: "upcoming"
        };

    }


    /* =========================================
       CREATE SCHEDULE DATA
    ========================================= */

    function buildSchedule() {

        const plants =
            getPlants();

        const schedules = [];


        plants.forEach(function (plant) {

            const next =
                getNextWatering(plant);

            if (next) {

                schedules.push({

                    plant: plant,

                    date: next,

                    status:
                        getStatus(next)

                });

            }

        });


        schedules.sort(function (a, b) {

            return a.date - b.date;

        });


        return schedules;
    }


    /* =========================================
       RENDER SCHEDULE LIST
    ========================================= */

    function renderScheduleList() {

        if (!scheduleList) {
            return;
        }

        const schedules =
            buildSchedule();


        /*
         * If there are no user-created plants,
         * keep the existing demo content.
         */

        if (schedules.length === 0) {
            return;
        }


        scheduleList.innerHTML = "";


        schedules.forEach(function (item) {

            const row =
                document.createElement("div");

            row.className =
                "schedule-item";


            row.innerHTML = `

                <div class="schedule-item-date">

                    <strong>
                        ${item.date.toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric"
                            }
                        )}
                    </strong>

                    <span>
                        ${item.date.toLocaleDateString(
                            "en-IN",
                            {
                                month: "short"
                            }
                        )}
                    </span>

                </div>


                <div class="schedule-item-info">

                    <div class="schedule-plant-icon">
                        🌱
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                item.plant.name
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                item.plant.species ||
                                "Plant"
                            )}
                            ·
                            ${item.plant.waterAmount || 250}
                            ml
                        </p>

                    </div>

                </div>


                <div class="
                    schedule-status
                    ${item.status.className}
                ">
                    ${item.status.text}
                </div>


                <button
                    class="schedule-water-button"
                    type="button"
                    data-id="${item.plant.id}">
                    💧 Water
                </button>

            `;


            scheduleList.appendChild(row);

        });


        /* WATER BUTTONS */

        scheduleList
            .querySelectorAll(
                ".schedule-water-button"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        markWatered(
                            button.dataset.id
                        );

                    }
                );

            });

    }


    /* =========================================
       WATER PLANT
    ========================================= */

    function markWatered(id) {

        const plants =
            getPlants();


        const plant =
            plants.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!plant) {
            return;
        }


        plant.lastWatered =
            new Date()
                .toISOString()
                .split("T")[0];


        localStorage.setItem(
            storageKey,
            JSON.stringify(plants)
        );


        showToast(
            "💧 " +
            plant.name +
            " watered successfully!"
        );


        renderScheduleList();

        renderCalendar();

        updateStatistics();

    }


    /* =========================================
       CALENDAR
    ========================================= */

    let currentMonth =
        new Date().getMonth();

    let currentYear =
        new Date().getFullYear();


    function renderCalendar() {

        if (!calendarGrid) {
            return;
        }


        const firstDay =
            new Date(
                currentYear,
                currentMonth,
                1
            );


        const lastDay =
            new Date(
                currentYear,
                currentMonth + 1,
                0
            );


        const firstWeekday =
            firstDay.getDay();


        const totalDays =
            lastDay.getDate();


        if (monthTitle) {

            monthTitle.textContent =
                firstDay.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        calendarGrid.innerHTML = "";


        /* WEEK DAYS */

        const weekdays = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];


        weekdays.forEach(function (day) {

            const element =
                document.createElement("div");

            element.className =
                "calendar-weekday";

            element.textContent =
                day;

            calendarGrid.appendChild(
                element
            );

        });


        /* EMPTY DAYS */

        for (
            let i = 0;
            i < firstWeekday;
            i++
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "calendar-day empty";

            calendarGrid.appendChild(
                empty
            );

        }


        const schedules =
            buildSchedule();


        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {

            const date =
                startOfDay(
                    new Date(
                        currentYear,
                        currentMonth,
                        day
                    )
                );


            const cell =
                document.createElement("div");

            cell.className =
                "calendar-day";


            const isToday =
                date.getTime() ===
                startOfDay(
                    new Date()
                ).getTime();


            if (isToday) {

                cell.classList.add(
                    "today"
                );

            }


            const number =
                document.createElement("span");

            number.className =
                "calendar-number";

            number.textContent =
                day;

            cell.appendChild(
                number
            );


            /* FIND PLANTS ON THIS DATE */

            schedules
                .filter(function (item) {

                    return item.date.getTime() ===
                        date.getTime();

                })
                .forEach(function (item) {

                    const event =
                        document.createElement("div");

                    event.className =
                        "calendar-event";

                    event.textContent =
                        item.plant.name;

                    event.title =
                        item.plant.name +
                        " needs watering";


                    cell.appendChild(
                        event
                    );

                });


            calendarGrid.appendChild(
                cell
            );

        }

    }


    /* =========================================
       STATISTICS
    ========================================= */

    function updateStatistics() {

        const schedules =
            buildSchedule();


        const todayCount =
            schedules.filter(function (item) {

                return getDayDifference(
                    item.date
                ) === 0;

            }).length;


        const upcomingCount =
            schedules.filter(function (item) {

                const difference =
                    getDayDifference(
                        item.date
                    );

                return (
                    difference > 0 &&
                    difference <= 7
                );

            }).length;


        const overdueCount =
            schedules.filter(function (item) {

                return getDayDifference(
                    item.date
                ) < 0;

            }).length;


        const todayElement =
            document.querySelector(
                "[data-schedule-today]"
            );

        const upcomingElement =
            document.querySelector(
                "[data-schedule-upcoming]"
            );

        const overdueElement =
            document.querySelector(
                "[data-schedule-overdue]"
            );


        if (todayElement) {
            todayElement.textContent =
                todayCount;
        }

        if (upcomingElement) {
            upcomingElement.textContent =
                upcomingCount;
        }

        if (overdueElement) {
            overdueElement.textContent =
                overdueCount;
        }

    }


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================
       TODAY BUTTON
    ========================================= */

    if (todayButton) {

        todayButton.addEventListener(
            "click",
            function () {

                const now =
                    new Date();

                currentMonth =
                    now.getMonth();

                currentYear =
                    now.getFullYear();

                renderCalendar();

                showToast(
                    "📅 Calendar returned to today."
                );

            }
        );

    }


    /* =========================================
       MONTH NAVIGATION
    ========================================= */

    const previousMonth =
        document.getElementById(
            "previousMonth"
        );

    const nextMonth =
        document.getElementById(
            "nextMonth"
        );


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            function () {

                currentMonth--;

                if (currentMonth < 0) {

                    currentMonth = 11;
                    currentYear--;

                }

                renderCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            function () {

                currentMonth++;

                if (currentMonth > 11) {

                    currentMonth = 0;
                    currentYear++;

                }

                renderCalendar();

            }
        );

    }


    /* =========================================
       NOTIFICATIONS
    ========================================= */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                const schedules =
                    buildSchedule();

                const today =
                    schedules.filter(
                        function (item) {

                            return getDayDifference(
                                item.date
                            ) === 0;

                        }
                    );


                if (today.length > 0) {

                    showToast(
                        "🔔 " +
                        today.length +
                        " plant(s) need watering today."
                    );

                } else {

                    showToast(
                        "🌱 No plants need watering today."
                    );

                }

            }
        );

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    /* =========================================
       CLOSE SIDEBAR
    ========================================= */

    if (sidebar) {

        sidebar
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        sidebar.classList.remove(
                            "open"
                        );

                    }
                );

            });

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    renderScheduleList();

    renderCalendar();

    updateStatistics();

    document.body.classList.add(
        "schedule-ready"
    );


    console.log(
        "🌱 Smart Schedule loaded."
    );

});