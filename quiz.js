let currentIndex = 0;
let results = [];

// we will shuffle a copy so original stays safe
let quizPool = [];

const totalQuestions = 10; // you can change this if needed

// -----------------------------
// Shuffle function
// -----------------------------
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// -----------------------------
// Load next question
// -----------------------------
function loadQuestion() {

  document.getElementById("correctNum").innerText = "";
  document.getElementById("correctPronoun").innerText = "";
  document.getElementById("correctTime").innerText = "";
  document.getElementById("correctRoot").innerText = "";
  
  const q = quizPool[currentIndex];

  // reset styles
  const inputs = [
    document.getElementById("binyanNum"),
    document.getElementById("binyanPronoun"),
    document.getElementById("binyanTime"),
    document.getElementById("root")
  ];

  inputs.forEach(el => {
    el.classList.remove("correct", "wrong");
  });
  document.querySelectorAll(".correct-answer").forEach(el => el.remove());
  // reset values
  document.getElementById("binyanNum").value = "";
  document.getElementById("binyanPronoun").selectedIndex = 0;
  document.getElementById("binyanTime").selectedIndex = 0;
  document.getElementById("root").value = "";

  // show word
  document.getElementById("arabW").innerText = q.word;

  updateProgress();
}

// -----------------------------
// Check answer
// -----------------------------
function checkAnswer() {
  const q = quizPool[currentIndex];

  const num = document.getElementById("binyanNum");
  const pronoun = document.getElementById("binyanPronoun");
  const time = document.getElementById("binyanTime");
  const root = document.getElementById("root");

  let correct = true;

  // save user answers
  q.user = {
    num: num.value,
    pronoun: pronoun.value,
    time: time.value,
    root: root.value
  };

  // ---------------- NUMBER ----------------
  if (Number(num.value) !== q.binyanNumber) {
    num.classList.add("wrong");
    correct = false;

    showCorrectAnswer(num, `נכון: ${q.binyanNumber}`);
  } else {
    num.classList.add("correct");
  }

  // ---------------- PRONOUN ----------------
  if (pronoun.value !== q.binyanPronoun) {
    pronoun.classList.add("wrong");
    correct = false;

    showCorrectAnswer(pronoun, `נכון: ${q.binyanPronoun}`);
  } else {
    pronoun.classList.add("correct");
  }

  // ---------------- TIME ----------------
  if (time.value !== q.binyanTime) {
    time.classList.add("wrong");
    correct = false;

    showCorrectAnswer(time, `נכון: ${q.binyanTime}`);
  } else {
    time.classList.add("correct");
  }

  // ---------------- ROOT ----------------
  if (root.value !== q.binyanRoot) {
    root.classList.add("wrong");
    correct = false;

    showCorrectAnswer(root, `נכון: ${q.binyanRoot}`);
  } else {
    root.classList.add("correct");
  }

  results[currentIndex] = correct;

  return correct;
}
function showCorrectAnswer(element, text) {

  const old = element.parentElement.querySelector(".correct-answer");

  if (old) old.remove();

  const div = document.createElement("div");

  div.className = "correct-answer";

  div.innerText = text;

  element.parentElement.appendChild(div);
}

// -----------------------------
// Button handler (check / next)
// -----------------------------
function next() {
  const btn = document.getElementById("btnNext");

  const num = document.getElementById("binyanNum");
  const pronoun = document.getElementById("binyanPronoun");
  const time = document.getElementById("binyanTime");
  const root = document.getElementById("root");

  // -----------------------------
  // בדיקת מילוי שדות
  // -----------------------------
  if (
    num.value === "" ||
    pronoun.value === "בחר" ||
    time.value === "בחר" ||
    root.value.trim() === ""
  ) {
    return;
  }

  // -----------------------------
  // שלב 1: בדיקה
  // -----------------------------
  if (btn.dataset.state !== "checked") {
    checkAnswer();
    btn.innerText = "המשך";
    btn.dataset.state = "checked";
    return;
  }

  // -----------------------------
  // שלב 2: מעבר שאלה
  // -----------------------------
  currentIndex++;

  if (currentIndex >= quizPool.length) {
    localStorage.setItem("quizResults", JSON.stringify({
      words: quizPool,
      results: results
    }));

    window.location.href = "results.html";
    return;
  }

  btn.innerText = "בדוק תשובה";
  btn.dataset.state = "";

  loadQuestion();
}

// -----------------------------
// Progress bar
// -----------------------------
function updateProgress() {
  const percent = ((currentIndex + 1) / quizPool.length) * 100;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `${currentIndex + 1} / ${quizPool.length}`;
}

// -----------------------------
// Final screen (simple)
// -----------------------------
function showResults() {
  const score = results.filter(Boolean).length;

  document.querySelector(".questionContainer").innerHTML = `
    <h2 style="text-align:center">סיימת את הבוחן 🎉</h2>
    <p style="text-align:center">ציון: ${score} / ${quizPool.length}</p>
  `;
}

// -----------------------------
// Start quiz
// -----------------------------
window.addEventListener("load", () => {
  quizPool = shuffle([...words]).slice(0, totalQuestions);

  currentIndex = 0;
  results = [];

  document.getElementById("btnNext").addEventListener("click", next);

  loadQuestion();
});
