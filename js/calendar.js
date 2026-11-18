
/* ===== BARBIE WORLD - CALENDARIO DE EMOCIONES ===== */

// Elementos del calendario
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const emotionForm = document.getElementById("emotionForm");
const emotionSelect = document.getElementById("emotionSelect");
const emotionNote = document.getElementById("emotionNote");
const selectedDateText = document.getElementById("selectedDate");
const emotionMessage = document.getElementById("emotionMessage");

// Fecha actual
let currentDate = new Date();
let selectedDate = formatDate(new Date());

// Recuperar emociones guardadas
let emotions = JSON.parse(
    localStorage.getItem("barbieEmotions") || "{}"
);

// Formato de fecha YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Mostrar calendario
function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString("es-CO", {
        month: "long",
        year: "numeric"
    });

    monthYear.textContent =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Ajustar semana para comenzar en lunes
    const startingDay = (firstDay.getDay() + 6) % 7;

    // Espacios antes del primer día
    for (let i = 0; i < startingDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-empty";
        calendarDays.appendChild(empty);
    }

    // Crear los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {

        const date = new Date(year, month, day);
        const dateKey = formatDate(date);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;

        if (dateKey === selectedDate) {
            button.classList.add("selected");
        }

        if (emotions[dateKey]) {
            button.classList.add("has-emotion");
            button.title = emotions[dateKey].mood;
        }

        button.addEventListener("click", () => {
            selectedDate = dateKey;
            showSelectedEmotion();
            renderCalendar();
        });

        calendarDays.appendChild(button);
    }
}

// Mostrar la fecha y emoción seleccionadas
function showSelectedEmotion() {

    const date = new Date(selectedDate + "T12:00:00");

    selectedDateText.textContent =
        date.toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const savedEmotion = emotions[selectedDate];

    emotionSelect.value = savedEmotion
        ? savedEmotion.mood
        : "";

    emotionNote.value = savedEmotion
        ? savedEmotion.note
        : "";

    emotionMessage.textContent = savedEmotion
        ? "💗 Ya tienes un recuerdo guardado para este día."
        : "🌷 Todavía no has registrado una emoción.";
}

// Guardar emoción
emotionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const mood = emotionSelect.value;
    const note = emotionNote.value.trim();

    if (!mood || !note) {
        emotionMessage.textContent =
            "Por favor, completa todos los campos. 💕";
        return;
    }

    emotions[selectedDate] = {
        mood: mood,
        note: note
    };

    localStorage.setItem(
        "barbieEmotions",
        JSON.stringify(emotions)
    );

    emotionMessage.textContent =
        "¡Tu emoción se guardó correctamente! 💖";

    renderCalendar();
});

// Cambiar al mes anterior
prevMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();

});

// Cambiar al mes siguiente
nextMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();

});

// Iniciar calendario
renderCalendar();
showSelectedEmotion();
