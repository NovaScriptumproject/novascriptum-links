document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo-trigger");
    const container = document.getElementById("particle-container");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");

    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "fas fa-sun";
    }

    themeToggle.addEventListener("click", () => {
        let theme = "dark";
        if (document.documentElement.getAttribute("data-theme") !== "light") {
            document.documentElement.setAttribute("data-theme", "light");
            themeIcon.className = "fas fa-sun";
            theme = "light";
        } else {
            document.documentElement.removeAttribute("data-theme");
            themeIcon.className = "fas fa-moon";
            theme = "dark";
        }
        localStorage.setItem("theme", theme);
    });

    function createParticles() {
        const rect = logo.getBoundingClientRect();
        const startX = rect.left + rect.width * 0.85;
        const startY = rect.top + rect.height * 0.25;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");

            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size * 3}px`;

            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 90 + 40;
            const destinationX = Math.cos(angle) * velocity;
            const destinationY = Math.sin(angle) * velocity;

            const animation = particle.animate([
                { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 0.9 },
                { transform: `translate(${startX + destinationX}px, ${startY + destinationY}px) scale(0)`, opacity: 0 }
            ], {
                duration: Math.random() * 600 + 400,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            });

            animation.onfinish = () => {
                particle.remove();
            };
        }
    }

    logo.addEventListener("mouseenter", createParticles);
    logo.addEventListener("click", createParticles);

    const buttons = document.querySelectorAll(".link-item");
    buttons.forEach(button => {
        button.addEventListener("click", function(e) {
            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
            circle.style.position = "absolute";
            circle.style.borderRadius = "50%";
            circle.style.transform = "scale(0)";
            circle.style.background = "rgba(255, 255, 255, 0.15)";
            circle.style.animation = "ripple-effect 0.4s linear";
            circle.style.pointerEvents = "none";

            this.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 400);
        });
    });
});