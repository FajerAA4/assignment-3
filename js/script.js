// Dark/Light Theme Toggle
let visitTimerId = null;

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    // Save preference in localStorage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}
// Apply saved theme
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
    // Initialize page features
    updateGreeting();
    loadQuote();
    applyFilter();
    setupContactForm();
    loadWeather();
    setupAuth();
    setupProjectToggle();
    setupNameMemory();
    startVisitTimer();

    // Add event listeners
    const searchInput  = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");
    const levelSelect  = document.getElementById("levelSelect");
    const sortSelect   = document.getElementById("sortSelect");

    searchInput.addEventListener("input", applyFilter);
    filterSelect.addEventListener("change", applyFilter);
    if (levelSelect) levelSelect.addEventListener("change", applyFilter);
    if (sortSelect) sortSelect.addEventListener("change", applyFilter);

});

//function for the Greeting message based on time of day
function updateGreeting() {
    const greetText = document.getElementById("greet-text");
    const hour = new Date().getHours();
    const name = localStorage.getItem("visitorName");
    let greeting = "";

    if (hour < 12) {
        greeting= "Good Morning! 🌅 ";
    } else if (hour < 18) {
        greeting = "Good Afternoon! ☀️";
    } else {
        greeting = "Good Evening! 🌙 ";
    }
    // If name exists, attach it
    if (name) {
        greetText.textContent = `${greeting}, ${name}!`;
    } else {
        greetText.textContent = `${greeting}!`;
    }
}
// Fetch quote API
async function loadQuote() {
    let quoteSection = document.getElementById("quote");
    if (!quoteSection) {
        quoteSection = document.createElement("p");
        quoteSection.id = "quote";
        quoteSection.style.textAlign = "center";
        quoteSection.style.fontStyle = "italic";
        document.getElementById("greeting").appendChild(quoteSection);
    }

    //loading state
    quoteSection.innerHTML = `
        <span class="spinner" style="
            display:inline-block;
            width:16px; height:16px;
            border:2px solid #ccc;
            border-top:2px solid #e91e63;
            border-radius:50%;
            animation: spin 0.8s linear infinite;
            vertical-align:middle;
            margin-right:6px;
        "></span>
        Loading quote...
    `;

    try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        if (!res.ok) throw new Error("Failed to fetch quote");
        const data = await res.json();
        quoteSection.textContent = `"${data.quote}" — ${data.author}`;
    } catch (error) {
        // --- Requirement 2: friendly error + retry button ---
        quoteSection.innerHTML = `
            ⚠️ Could not load quote.<br>
            <button onclick="loadQuote()" style="
                background:#e91e63;
                color:#fff;
                border:none;
                border-radius:5px;
                padding:5px 10px;
                cursor:pointer;
                margin-top:5px;">Retry</button>
        `;
    }
}

// Project List
const projects = [
    { title: "Single Cycle CPU", tag: "hardware",level: "advanced", date: "2025-04-10",img: "assets/img_1.webp", desc: "Built a CPU using Logisim for COE301." },
    { title: "Event Management App", tag: "app",level: "beginner", date: "2025-5-01", desc: "Designed a Figma prototype for SWE206.",img: "assets/img.webp"},
    { title: "UI Components Library", tag: "implemenation",level: "intermediate", date: "2025-11-2", desc: "Created a MYSQL database and a simple UI." ,img: "assets/img_2.webp"}
];


function renderProjects(list) {
    const container = document.getElementById("projectList");
    container.innerHTML = "";

    if (list.length === 0) {
        document.getElementById("emptyMessage").style.display = "block";
        return;
    }
    document.getElementById("emptyMessage").style.display = "none";

    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <img src="${p.img}" loading="lazy" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <p><strong>Level:</strong> ${p.level}</p>
            <button class="tag" onclick="alert('Feature coming soon!')">${p.tag}</button>
    `;
        container.appendChild(card);
    });
}


//Apply Filter and Search
function applyFilter() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filterTag = document.getElementById("filterSelect").value;
    const levelFilter = document.getElementById("levelSelect")
        ? document.getElementById("levelSelect").value
        : "all";
    const sortBy = document.getElementById("sortSelect")
        ? document.getElementById("sortSelect").value
        : "newest";

    // 1) filter by tag + level + search
    let filtered = projects.filter(p =>
        (filterTag === "all" || p.tag === filterTag) &&
        (levelFilter === "all" || p.level === levelFilter) &&
        (p.title.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm))
    );

    // 2) sort result
    filtered.sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "oldest") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === "title-az") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "title-za") {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    // 3) update message depending on level
    const hint = document.getElementById("projectHint");
    if (hint) {
        if (levelFilter === "beginner") {
            hint.textContent = "Showing beginner-friendly projects — great place to start! 🌱";
        } else if (levelFilter === "intermediate") {
            hint.textContent = "Showing intermediate projects — some experience recommended. 💡";
        } else if (levelFilter === "advanced") {
            hint.textContent = "Showing advanced projects — deep technical work. 🚀";
        } else {
            hint.textContent = "Showing all projects (mixed levels).";
        }
    }

    renderProjects(filtered);
}

//Contact form validation and confirmation
function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const feedback = document.getElementById("formFeedback");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        feedback.className = "";
        feedback.style.display = "none";

        if (
            nameInput.value.trim() === "" ||
            emailInput.value.trim() === "" ||
            messageInput.value.trim() === ""
        ) {
            feedback.textContent = "⚠️ Please fill in all fields.";
            feedback.className = "error";
            feedback.style.display = "block";
            return;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            feedback.textContent = "❌ Please enter a valid email address.";
            feedback.style.display = "block";
            return;
        }

        // Success message
        feedback.className = "success";
        feedback.textContent = "✅ Message sent successfully!";
        feedback.style.display = "block";

        // Reset form
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";

        // Fade-out after 4 seconds
        setTimeout(() => {
            feedback.style.transition = "opacity 1s";
            feedback.style.opacity = "0";
        }, 4000);
    });
}
async function loadWeather() {
    const weatherBox = document.getElementById("weather-box");
    if (!weatherBox) return;

    weatherBox.innerHTML = "Loading weather...";

    const apiKey = "d51f2f00c3b137ccfd135bd8f9dd50aa";
    const city = "Dammam";

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");

        const data = await res.json();

        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;

        weatherBox.innerHTML = `
            <h3>🌤️ Weather in ${city}</h3>
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind} m/s</p>
        `;
    } catch (err) {
        console.error(err);
        weatherBox.innerHTML = `
            ⚠️ Unable to load weather info.<br><br>
            <button onclick="loadWeather()" 
                style="padding:10px 20px; border:none; border-radius:20px;
                background: linear-gradient(90deg, #e91e63, #6a1b9a);
                color:white; cursor:pointer;">
                Retry
            </button>
        `;
    }
}
function startVisitTimer() {
    const timerEl = document.getElementById("visit-timer");
    if (!timerEl) return;

    let seconds = 0;
    if (visitTimerId) clearInterval(visitTimerId);

    visitTimerId =setInterval(() => {
        seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
        timerEl.textContent = mins === 0
            ? `You have been on this page for ${secs} seconds.`
            : `You have been on this page for ${mins} min ${secs} sec.`;

    }, 1000);
}
function setupAuth() {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const status = document.getElementById("loginStatus");

    function updateUI() {
        const user = localStorage.getItem("userLoggedIn");

        if (user === "true") {
            status.textContent = "You are logged in ✔️";
            loginBtn.style.display = "none";
            logoutBtn.style.display = "inline-block";
        } else {
            status.textContent = "You are logged out ❌";
            loginBtn.style.display = "inline-block";
            logoutBtn.style.display = "none";
        }
    }

    loginBtn.addEventListener("click", () => {
        localStorage.setItem("userLoggedIn", "true");
        updateUI();
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.setItem("userLoggedIn", "false");
        if (visitTimerId) clearInterval(visitTimerId);
        document.getElementById("visit-timer").textContent = "You have just arrived ";
        localStorage.removeItem("visitorName");
        updateGreeting();

        const input = document.getElementById("saveNameInput");
        if (input) input.value = "";
        updateUI();
    });


    updateUI();
}
function setupProjectToggle() {
    const btn = document.getElementById("toggleProjectsBtn");
    const section = document.getElementById("projects");

    // Load saved state
    const hidden = localStorage.getItem("projectsHidden") === "true";

    if (hidden) {
        section.style.display = "none";
        btn.textContent = "Show Projects";
    }

    btn.addEventListener("click", () => {
        const isHidden = section.style.display === "none";

        if (isHidden) {
            section.style.display = "block";
            btn.textContent = "Hide Projects";
            localStorage.setItem("projectsHidden", "false");
        } else {
            section.style.display = "none";
            btn.textContent = "Show Projects";
            localStorage.setItem("projectsHidden", "true");
        }
    });
}
function setupNameMemory() {
    const input = document.getElementById("saveNameInput");
    const btn = document.getElementById("saveNameBtn");
    const savedName = localStorage.getItem("visitorName");

    // Show old name
    if (savedName) {
        updateGreeting();
    }

    btn.addEventListener("click", () => {
        const name = input.value.trim();
        if (name.length < 1) return;

        localStorage.setItem("visitorName", name);
        updateGreeting();
        input.value = "";
    });
}

