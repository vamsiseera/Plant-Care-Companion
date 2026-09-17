function waterPlant() {

    const button = document.querySelector(".primary-action");

    button.innerHTML = "✓ Plant Watered";

    button.style.opacity = "0.65";

    button.disabled = true;

    const insightTitle =
        document.querySelector(".insight h3");

    const insightText =
        document.querySelector(".insight p");

    insightTitle.innerText =
        "Great! Your Money Plant has been watered.";

    insightText.innerText =
        "The smart schedule will now calculate the next watering date from today's care activity.";

}


function editPlant() {

    alert(
        "Edit Plant\n\nThe editing form will be connected to the backend in the next stage."
    );

}