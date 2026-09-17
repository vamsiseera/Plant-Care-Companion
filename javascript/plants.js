/* =========================================
   PLANT CARE COMPANION
   MY PLANTS + ADD PLANT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       TOAST
    ========================================= */

    function showToast(message) {

        let toast = document.getElementById("plantsToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "plantsToast";
            toast.className = "plants-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.plantsToastTimer);

        window.plantsToastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }


    /* =========================================
       LOCAL STORAGE
    ========================================= */

    function getPlants() {

        try {
            return JSON.parse(
                localStorage.getItem("plantCarePlants")
            ) || [];
        } catch (error) {
            return [];
        }
    }


    function savePlants(plants) {

        localStorage.setItem(
            "plantCarePlants",
            JSON.stringify(plants)
        );
    }


    /* =========================================
       DATE HELPERS
    ========================================= */

    function formatDate(dateString) {

        if (!dateString) {
            return "Not available";
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    function getNextWatering(plant) {

        if (!plant.lastWatered) {
            return null;
        }

        const date = new Date(plant.lastWatered);

        const frequency =
            parseInt(plant.frequency, 10) || 7;

        date.setDate(
            date.getDate() + frequency
        );

        return date;
    }


    function getPlantStatus(plant) {

        const next = getNextWatering(plant);

        if (!next) {
            return {
                text: "Schedule not set",
                type: "pending"
            };
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        next.setHours(0, 0, 0, 0);

        const difference =
            Math.ceil(
                (next - today) /
                (1000 * 60 * 60 * 24)
            );

        if (difference < 0) {

            return {
                text: "Needs water",
                type: "needs-water"
            };

        }

        if (difference === 0) {

            return {
                text: "Water today",
                type: "needs-water"
            };

        }

        if (difference === 1) {

            return {
                text: "Water tomorrow",
                type: "soon"
            };

        }

        return {
            text: "Water in " + difference + " days",
            type: "healthy"
        };
    }


    /* =========================================
       PLANT ICON
    ========================================= */

    function getPlantIcon(species) {

        const value =
            String(species || "").toLowerCase();

        if (value.includes("aloe")) {
            return "🌵";
        }

        if (value.includes("rose")) {
            return "🌹";
        }

        if (value.includes("snake")) {
            return "🌿";
        }

        if (value.includes("peace")) {
            return "🌱";
        }

        if (value.includes("money")) {
            return "🍃";
        }

        return "🪴";
    }


    /* =========================================
       RENDER MY PLANTS
    ========================================= */

    function renderPlants() {

        const plantsGrid =
            document.querySelector(".plants-grid");

        if (!plantsGrid) {
            return;
        }

        const plants = getPlants();

        /*
         * Keep the existing demo cards when
         * there are no newly-added plants.
         */
        if (plants.length === 0) {
            updateStats();
            return;
        }


        plantsGrid.innerHTML = "";


        plants.forEach(function (plant) {

            const status =
                getPlantStatus(plant);

            const next =
                getNextWatering(plant);

            const card =
                document.createElement("article");

            card.className = "plant-card";

            card.dataset.status =
                status.type;


            card.innerHTML = `
                <div class="plant-card-image">
                    <div class="plant-visual">
                        ${getPlantIcon(plant.species)}
                    </div>

                    <button
                        class="plant-menu"
                        type="button"
                        aria-label="Plant options">
                        ⋮
                    </button>
                </div>

                <div class="plant-card-content">

                    <div class="plant-card-header">
                        <div>
                            <h3>${escapeHTML(plant.name)}</h3>
                            <p>${escapeHTML(plant.species)}</p>
                        </div>
                    </div>

                    <div class="plant-details">

                        <div class="plant-detail">
                            <span>💧</span>
                            <div>
                                <small>Water</small>
                                <strong>
                                    ${plant.waterAmount || 250} ml
                                </strong>
                            </div>
                        </div>

                        <div class="plant-detail">
                            <span>◷</span>
                            <div>
                                <small>Next watering</small>
                                <strong>
                                    ${next
                                        ? formatDate(next)
                                        : "Not set"}
                                </strong>
                            </div>
                        </div>

                    </div>

                    <div class="plant-status ${status.type}">
                        ${status.text}
                    </div>

                    <button
                        class="water-button ${status.type === "needs-water" ? "" : "watered"}"
                        type="button"
                        ${status.type === "needs-water" ? "" : "disabled"}>
                        ${status.type === "needs-water"
                            ? "💧 Water Plant"
                            : "✓ Watered"}
                    </button>

                </div>
            `;


            plantsGrid.appendChild(card);


            /* WATER BUTTON */

            const waterButton =
                card.querySelector(".water-button");

            waterButton.addEventListener(
                "click",
                function () {

                    markPlantWatered(
                        plant.id
                    );

                }
            );


            /* MENU */

            const menuButton =
                card.querySelector(".plant-menu");

            menuButton.addEventListener(
                "click",
                function () {

                    showToast(
                        plant.name +
                        " options are ready."
                    );

                }
            );

        });


        updateStats();
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
       MARK PLANT WATERED
    ========================================= */

    function markPlantWatered(id) {

        const plants = getPlants();

        const plant =
            plants.find(function (item) {
                return String(item.id) === String(id);
            });

        if (!plant) {
            return;
        }


        plant.lastWatered =
            new Date().toISOString().split("T")[0];


        savePlants(plants);

        showToast(
            "💧 " +
            plant.name +
            " watered successfully!"
        );


        renderPlants();
    }


    /* =========================================
       STATS
    ========================================= */

    function updateStats() {

        const plants =
            getPlants();

        const total =
            plants.length;


        let needsWater = 0;
        let healthy = 0;


        plants.forEach(function (plant) {

            const status =
                getPlantStatus(plant);

            if (
                status.type === "needs-water"
            ) {
                needsWater++;
            } else {
                healthy++;
            }

        });


        /*
         * Only update counters when the page
         * provides matching data attributes.
         */

        const totalElement =
            document.querySelector(
                "[data-total-plants]"
            );

        const waterElement =
            document.querySelector(
                "[data-needs-water]"
            );

        const healthyElement =
            document.querySelector(
                "[data-healthy-plants]"
            );


        if (totalElement) {
            totalElement.textContent = total;
        }

        if (waterElement) {
            waterElement.textContent = needsWater;
        }

        if (healthyElement) {
            healthyElement.textContent = healthy;
        }
    }


    /* =========================================
       SEARCH
    ========================================= */

    const searchInput =
        document.getElementById("plantSearch");

    const filterButtons =
        document.querySelectorAll(".filter-button");

    let activeFilter = "all";


    function applyFilters() {

        const cards =
            document.querySelectorAll(".plant-card");

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        cards.forEach(function (card) {

            const text =
                card.textContent.toLowerCase();

            const status =
                card.dataset.status || "all";


            const matchesSearch =
                text.includes(search);


            const matchesFilter =
                activeFilter === "all" ||
                status === activeFilter;


            card.style.display =
                matchesSearch && matchesFilter
                    ? ""
                    : "none";

        });
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (item) {
                        item.classList.remove("active");
                    }
                );

                button.classList.add("active");

                activeFilter =
                    button.dataset.filter || "all";

                applyFilters();

            }
        );

    });


    /* =========================================
       VIEW CONTROLS
    ========================================= */

    const gridViewButton =
        document.getElementById("gridView");

    const listViewButton =
        document.getElementById("listView");

    const plantsGrid =
        document.querySelector(".plants-grid");


    if (
        gridViewButton &&
        listViewButton &&
        plantsGrid
    ) {

        gridViewButton.addEventListener(
            "click",
            function () {

                plantsGrid.classList.remove(
                    "list-view"
                );

                gridViewButton.classList.add(
                    "active"
                );

                listViewButton.classList.remove(
                    "active"
                );

            }
        );


        listViewButton.addEventListener(
            "click",
            function () {

                plantsGrid.classList.add(
                    "list-view"
                );

                listViewButton.classList.add(
                    "active"
                );

                gridViewButton.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =========================================
       ADD PLANT PAGE
    ========================================= */

    const plantForm =
        document.getElementById("plantForm");

    const plantName =
        document.getElementById("plantName");

    const species =
        document.getElementById("species");

    const lastWatered =
        document.getElementById("lastWatered");

    const frequency =
        document.getElementById("frequency");

    const frequencyOptions =
        document.querySelectorAll(
            ".frequency-option"
        );

    const waterSlider =
        document.getElementById("waterSlider");

    const waterAmount =
        document.getElementById("waterAmount");

    const savePlantButton =
        document.getElementById("savePlantButton");


    /* =========================================
       SPECIES
    ========================================= */

    function getSpeciesName(value) {

        const names = {

            money: "Money Plant",

            aloe: "Aloe Vera",

            rose: "Rose",

            snake: "Snake Plant",

            peace: "Peace Lily",

            other: "Other Plant"

        };

        return names[value] || "Other Plant";
    }


    /* =========================================
       FREQUENCY
    ========================================= */

    frequencyOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                frequencyOptions.forEach(
                    function (item) {
                        item.classList.remove("active");
                    }
                );

                option.classList.add("active");

                if (frequency) {
                    frequency.value =
                        option.dataset.days;
                }

                updatePlantPreview();

            }
        );

    });


    /* =========================================
       SLIDER
    ========================================= */

    if (waterSlider && waterAmount) {

        waterSlider.addEventListener(
            "input",
            function () {

                waterAmount.textContent =
                    waterSlider.value + " ml";

                updatePlantPreview();

            }
        );

    }


    /* =========================================
       NEXT WATERING
    ========================================= */

    function calculateNextWatering() {

        if (
            !lastWatered ||
            !lastWatered.value
        ) {
            return null;
        }

        const date =
            new Date(lastWatered.value);

        const days =
            parseInt(
                frequency
                    ? frequency.value
                    : 7,
                10
            ) || 7;

        date.setDate(
            date.getDate() + days
        );

        return date;
    }


    /* =========================================
       PREVIEW
    ========================================= */

    function updatePlantPreview() {

        const previewPlant =
            document.getElementById(
                "previewPlant"
            );

        const nextWatering =
            document.getElementById(
                "nextWatering"
            );

        const previewLastWatered =
            document.getElementById(
                "previewLastWatered"
            );

        const previewFrequency =
            document.getElementById(
                "previewFrequency"
            );

        const previewAmount =
            document.getElementById(
                "previewAmount"
            );


        if (previewPlant) {

            if (
                plantName &&
                plantName.value.trim()
            ) {

                previewPlant.textContent =
                    plantName.value.trim();

            } else if (
                species &&
                species.value
            ) {

                previewPlant.textContent =
                    getSpeciesName(
                        species.value
                    );

            } else {

                previewPlant.textContent =
                    "Your Plant";

            }

        }


        if (previewLastWatered) {

            previewLastWatered.textContent =
                lastWatered &&
                lastWatered.value
                    ? formatDate(
                        lastWatered.value
                    )
                    : "Not selected";

        }


        if (previewFrequency) {

            previewFrequency.textContent =
                (frequency
                    ? frequency.value
                    : 7) +
                " days";

        }


        if (previewAmount) {

            previewAmount.textContent =
                (waterSlider
                    ? waterSlider.value
                    : 250) +
                " ml";

        }


        if (nextWatering) {

            const next =
                calculateNextWatering();

            nextWatering.textContent =
                next
                    ? formatDate(next)
                    : "Select watering date";

        }

    }


    if (plantName) {
        plantName.addEventListener(
            "input",
            updatePlantPreview
        );
    }


    if (species) {
        species.addEventListener(
            "change",
            updatePlantPreview
        );
    }


    if (lastWatered) {
        lastWatered.addEventListener(
            "change",
            updatePlantPreview
        );
    }


    /* =========================================
       DEFAULT DATE
    ========================================= */

    if (
        lastWatered &&
        !lastWatered.value
    ) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        lastWatered.value =
            `${year}-${month}-${day}`;

    }


    /* =========================================
       SAVE NEW PLANT
    ========================================= */

    if (plantForm) {

        plantForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    plantName
                        ? plantName.value.trim()
                        : "";


                const selectedSpecies =
                    species
                        ? species.value
                        : "";


                const wateredDate =
                    lastWatered
                        ? lastWatered.value
                        : "";


                if (!name) {

                    showToast(
                        "Please enter your plant name."
                    );

                    plantName?.focus();

                    return;
                }


                if (!selectedSpecies) {

                    showToast(
                        "Please select a plant species."
                    );

                    species?.focus();

                    return;
                }


                if (!wateredDate) {

                    showToast(
                        "Please select the last watered date."
                    );

                    lastWatered?.focus();

                    return;
                }


                const plantData = {

                    id: Date.now(),

                    name: name,

                    species:
                        getSpeciesName(
                            selectedSpecies
                        ),

                    lastWatered:
                        wateredDate,

                    frequency:
                        frequency
                            ? parseInt(
                                frequency.value,
                                10
                            ) || 7
                            : 7,

                    waterAmount:
                        waterSlider
                            ? parseInt(
                                waterSlider.value,
                                10
                            ) || 250
                            : 250,

                    createdAt:
                        new Date().toISOString()

                };


                const plants =
                    getPlants();


                plants.push(
                    plantData
                );


                savePlants(
                    plants
                );


                if (savePlantButton) {

                    savePlantButton.disabled =
                        true;

                    savePlantButton.textContent =
                        "✓ Plant Added";

                }


                showToast(
                    "🌱 " +
                    name +
                    " added successfully!"
                );


                setTimeout(function () {

                    window.location.href =
                        "plants.html";

                }, 900);

            }
        );

    }


    /* =========================================
       SEARCH SHORTCUT
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "/" &&
                searchInput &&
                document.activeElement.tagName !== "INPUT"
            ) {

                event.preventDefault();

                searchInput.focus();

            }


            if (
                event.key === "Escape" &&
                searchInput
            ) {

                searchInput.blur();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    renderPlants();

    updatePlantPreview();

    document.body.classList.add(
        "plants-ready"
    );


    console.log(
        "🌱 Plant Care Companion Plants loaded."
    );

});