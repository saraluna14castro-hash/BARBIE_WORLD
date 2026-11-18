

// ===== BARBIE DIARY =====

const diaryForm = document.getElementById("diaryForm");
const diaryTitle = document.getElementById("diaryTitle");
const diaryMood = document.getElementById("diaryMood");
const diaryContent = document.getElementById("diaryContent");

// Recuperar recuerdos
let entries = JSON.parse(
    localStorage.getItem("barbieDiary") || "[]"
);

// Guardar recuerdos
function saveEntries() {
    localStorage.setItem("barbieDiary", JSON.stringify(entries));
}

// Crear un recuerdo
diaryForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newEntry = {
        title: diaryTitle.value.trim(),
        mood: diaryMood.value,
        content: diaryContent.value.trim(),
        date: new Date().toLocaleString("es-CO")
    };

    if (!newEntry.title || !newEntry.mood || !newEntry.content) {
        alert("Completa todos los campos. 💗");
        return;
    }

    entries.unshift(newEntry);

    saveEntries();

    diaryForm.reset();

    alert("¡Tu recuerdo Barbie se guardó correctamente! 💖");
});
