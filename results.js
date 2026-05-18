const data = JSON.parse(localStorage.getItem("quizResults"));

// --------------------
// SAFETY CHECK (IMPORTANT)
// --------------------
if (!data) {
  document.body.innerHTML = "<h2 style='text-align:center'>אין תוצאות</h2>";
  throw new Error("No quiz data found");
}

const words = data.words;
const results = data.results;

const correctCount = results.filter(Boolean).length;
const total = results.length;
const percent = Math.round((correctCount / total) * 100);

// --------------------
// ELEMENTS
// --------------------
const summaryBox = document.getElementById("summaryBox");
const summaryText = document.getElementById("summaryText");
const scoreCircle = document.getElementById("scoreCircle");
const container = document.getElementById("resultsContainer");

// --------------------
// SUMMARY SECTION (like ASP.NET animation)
// --------------------
summaryText.innerText = `נכונות: ${correctCount} מתוך ${total}`;
summaryBox.classList.add("show");

// animate score circle
animateScore(0, percent);

// --------------------
// BUILD RESULTS TABLE
// --------------------
const table = document.createElement("table");
table.className = "results-table";

const tbody = document.createElement("tbody");

words.forEach((q, i) => {

  const isCorrect = results[i];

  const row = document.createElement("tr");
  row.className = "result-row";

  row.innerHTML = `
    <!-- Word -->
    <td class="result-cell word-cell">
      ${q.word}
    </td>

    <!-- Status -->
    <td class="result-cell">
      <span class="status-badge ${isCorrect ? "status-correct" : "status-wrong"}">
        ${isCorrect ? "✓ נכון" : "✗ שגוי"}
      </span>
    </td>

    <!-- User Answer -->
    <td class="result-cell">
      <div class="answer-box">
        <span class="${isCorrect ? "" : "wrong-val"}">
          בניין: ${q.user?.num ?? "-"} | זמן: ${q.user?.time ?? "-"}
        </span>
        <span class="${isCorrect ? "" : "wrong-val"}">
          גוף: ${q.user?.pronoun ?? "-"} | שורש: ${q.user?.root ?? "-"}
        </span>
      </div>
    </td>

    <!-- Correct Answer -->
    <td class="result-cell">
      ${
        isCorrect
          ? "<span style='color:#27ae60; font-size:1.5em;'>⭐</span>"
          : `
            <div class="answer-box">
              <span class="correct-val">בניין: ${q.binyanNumber}</span>
              <span class="correct-val">זמן: ${q.binyanTime}</span>
              <span class="correct-val">גוף: ${q.binyanPronoun}</span>
              <span class="correct-val">שורש: ${q.binyanRoot}</span>
            </div>
          `
      }
    </td>
  `;

  tbody.appendChild(row);

  // stagger animation (like ASP.NET)
  setTimeout(() => {
    row.classList.add("show");
  }, i * 120 + 300);
});

table.appendChild(tbody);
container.appendChild(table);

// --------------------
// SCORE ANIMATION (smooth counter)
// --------------------
function animateScore(start, end) {
  let current = start;

  const interval = setInterval(() => {
    scoreCircle.innerText = current + "%";

    if (current >= end) {
      clearInterval(interval);
    }

    current++;
  }, 15);

  // ensure circle appears like ASP.NET fade-in
  setTimeout(() => {
    scoreCircle.classList.add("show");
  }, 150);
}
document.getElementById("restartQuizBtn").addEventListener("click", () => {
  // מוחק את התוצאות הישנות
  localStorage.removeItem("quizResults");

  // מעביר לחידון חדש
  window.location.href = "index.html";
});
