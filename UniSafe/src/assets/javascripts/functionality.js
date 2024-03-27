//HAMBURGER FUNCTION

const hamburger = document.querySelector(".divhamb");

hamburger.addEventListener("click", mobileMenu);
    //HAMBURGER functionality linked to Head Component
    function mobileMenu() {
        hamburger.classList.toggle("active");
    }