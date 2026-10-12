/* Personalize this file whenever you want to update the birthday experience. */
const BIRTHDAY = "2026-10-19";
const INITIAL_MEETS = 13;
const TOTAL_MEETS = 100;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const home = $("#home");
const chapters = $$(".chapter");
const chapterNav = $("#chapterNav");
const chapterMenu = $("#chapterMenu");
const chapterMenuBtn = $("#chapterMenuBtn");
const progressFill = $("#progressFill");
const chapterCount = $("#chapterCount");
const toast = $("#toast");
let currentChapter = 0;
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 3600);
}

function showHome() {
  currentChapter = 0;
  home.hidden = false;
  home.classList.add("active");
  chapters.forEach(ch => { ch.hidden = true; ch.classList.remove("active"); });
  chapterNav.hidden = true;
  chapterMenu.hidden = true;
  chapterMenuBtn.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showChapter(number) {
  const n = Math.min(10, Math.max(1, Number(number)));
  home.hidden = true;
  home.classList.remove("active");
  chapters.forEach(ch => {
    const active = ch.id === `chapter-${n}`;
    ch.hidden = !active;
    ch.classList.toggle("active", active);
  });
  currentChapter = n;
  chapterNav.hidden = false;
  chapterCount.textContent = `${String(n).padStart(2, "0")} / 10`;
  progressFill.style.width = `${n * 10}%`;
  chapterMenu.hidden = true;
  chapterMenuBtn.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
  const activeChapter = $(`#chapter-${n}`);
  if (activeChapter) {
    const heading = $("h2", activeChapter);
    if (heading) heading.setAttribute("tabindex", "-1");
  }
}

$("#beginBtn").addEventListener("click", () => showChapter(1));
$("#homeBtn").addEventListener("click", showHome);
$$("[data-next]").forEach(button => button.addEventListener("click", () => showChapter(button.dataset.next)));
chapterMenuBtn.addEventListener("click", () => {
  const opening = chapterMenu.hidden;
  chapterMenu.hidden = !opening;
  chapterMenuBtn.setAttribute("aria-expanded", String(opening));
});
$$("[data-chapter]", chapterMenu).forEach(button => button.addEventListener("click", () => showChapter(button.dataset.chapter)));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !chapterMenu.hidden) {
    chapterMenu.hidden = true;
    chapterMenuBtn.setAttribute("aria-expanded", "false");
  }
});

// Birthday cake: blow out the candles and reveal the wish.
const cake = $("#birthdayCake");
function blowCandles() {
  cake.classList.add("blown");
  $("#wishReveal").hidden = false;
  $(".cake-instruction").textContent = "Wish made. May the universe be gentle with you, Shona. ♡";
  createHeartBurst(cake.getBoundingClientRect());
}
cake.addEventListener("click", blowCandles);
cake.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); blowCandles(); }
});

// Love letter opening.
$("#openLetterBtn").addEventListener("click", event => {
  const button = event.currentTarget;
  const letter = $("#loveLetter");
  const opening = letter.hidden;
  letter.hidden = !opening;
  button.classList.toggle("opened", opening);
  button.setAttribute("aria-expanded", String(opening));
  $(".envelope-hint").textContent = opening ? "your letter is open ♡" : "click to open your letter";
  if (opening && window.innerWidth < 850) setTimeout(() => letter.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
});

// Clickable reasons.
$$(".reason-card").forEach(card => card.addEventListener("click", () => {
  $$(".reason-card").forEach(item => item.classList.toggle("opened", item === card));
  $("#reasonReveal").innerHTML = `<span class="reveal-heart">♡</span><p>${escapeHTML(card.dataset.reason)}</p>`;
}));

// 100-meets tracker. Only the count is asserted; meet names/dates aren't invented.
const meetGrid = $("#meetGrid");
for (let i = 1; i <= TOTAL_MEETS; i++) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = `meet-dot${i <= INITIAL_MEETS ? " completed" : ""}`;
  dot.textContent = i <= INITIAL_MEETS ? "♥" : "·";
  dot.setAttribute("aria-label", i <= INITIAL_MEETS ? `Meet ${i}, completed. Add its memory in script.js when ready.` : `Meet ${i}, waiting to happen.`);
  dot.title = i <= INITIAL_MEETS ? `Meet ${i} — memory details can be added later` : `Meet ${i} — a future memory`;
  dot.addEventListener("click", () => {
    if (i <= INITIAL_MEETS) showToast(`Meet ${i} is part of your story already. Add its photo or memory whenever you're ready. ♡`);
    else showToast(`Meet ${i} is waiting to become a memory. One more adventure together, Shona. ♡`);
  });
  meetGrid.appendChild(dot);
}
function updateMeetCount(count) {
  const safeCount = Math.min(TOTAL_MEETS, Math.max(0, Number(count) || 0));
  $("#meetCount").textContent = safeCount;
  const percent = Math.round(safeCount / TOTAL_MEETS * 100);
  $("#meetProgressFill").style.width = `${percent}%`;
  $("#meetProgress").setAttribute("aria-valuenow", safeCount);
  $("#progressPercent").textContent = `${percent}% complete`;
  $("#remainingCount").textContent = `${TOTAL_MEETS - safeCount} to go ♡`;
  $$(".meet-dot").forEach((dot, index) => {
    const complete = index < safeCount;
    dot.classList.toggle("completed", complete);
    dot.textContent = complete ? "♥" : "·";
    dot.setAttribute("aria-label", complete ? `Meet ${index + 1}, completed.` : `Meet ${index + 1}, waiting to happen.`);
  });
}
// To update the tracker later, change INITIAL_MEETS above and the HTML progressbar initial value.
updateMeetCount(INITIAL_MEETS);

// Gift reveal.
$("#giftBox").addEventListener("click", event => {
  const button = event.currentTarget;
  const opening = $("#giftMessage").hidden;
  $("#giftMessage").hidden = !opening;
  button.classList.toggle("opened", opening);
  button.setAttribute("aria-expanded", String(opening));
  $(".gift-hint", button).textContent = opening ? "surprise unlocked ♡" : "tap to unwrap your surprise";
  if (opening) createHeartBurst(button.getBoundingClientRect());
});

// Couple quiz: sample questions are intentionally easy to edit.
const quizQuestions = [
  {
    question: "What's our very important little mission?",
    options: ["Become professional nap experts", "100 meets before long distance", "Eat every dessert in the world"],
    answer: 1,
    correct: "Correct, Baby! Thirteen little chapters down, and so many more memories to make. ♡",
    wrong: "Cute guess! But our mission is 100 meets before long distance. We have memories to collect! ♡"
  },
  {
    question: "What's one of my favorite things about our little world?",
    options: ["We have to act cool all the time", "We can be completely ourselves together", "We never tell silly jokes"],
    answer: 1,
    correct: "Yes! I love that I can be my most ridiculous self with you and still feel completely loved. ♡",
    wrong: "It's that we can be completely ourselves together. Weirdness and all, Shona. ♡"
  },
  {
    question: "What can turn an ordinary day into a favorite memory?",
    options: ["Being together", "A perfect weather forecast", "A very serious spreadsheet"],
    answer: 0,
    correct: "Exactly. No matter what we do, being with you makes everything better. ♡",
    wrong: "My answer is being with you. You have a way of making ordinary moments feel special. ♡"
  },
  {
    question: "What's the real prize for finishing this quiz?",
    options: ["A formal certificate", "Unlimited bragging rights", "More kisses from your boy"],
    answer: 2,
    correct: "Absolutely correct. Redeemable for an unreasonable number of kisses. ♡",
    wrong: "Nice try! The prize is more kisses from your boy. This prize is non-negotiable. ♡"
  }
];
let quizIndex = 0;
let quizAnswered = false;
function renderQuiz() {
  const q = quizQuestions[quizIndex];
  $("#quizStep").textContent = `QUESTION ${quizIndex + 1} OF ${quizQuestions.length}`;
  $("#quizProgressFill").style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  $("#quizQuestion").textContent = q.question;
  $("#quizOptions").innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(index));
    $("#quizOptions").appendChild(button);
  });
  $("#quizFeedback").hidden = true;
  $("#quizNext").hidden = true;
  $("#quizNext").textContent = quizIndex === quizQuestions.length - 1 ? "See your result ♡" : "Next question ♡";
  quizAnswered = false;
}
function answerQuiz(index) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = quizQuestions[quizIndex];
  const buttons = $$("#quizOptions button");
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) button.classList.add("correct");
    else if (i === index) button.classList.add("incorrect");
  });
  $("#quizFeedback").textContent = index === q.answer ? q.correct : q.wrong;
  $("#quizFeedback").hidden = false;
  $("#quizNext").hidden = false;
}
$("#quizNext").addEventListener("click", () => {
  if (!quizAnswered) return;
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuiz();
  } else {
    $("#quizQuestion").textContent = "Your final result: 100% my favorite person.";
    $("#quizOptions").innerHTML = "";
    $("#quizFeedback").textContent = "Whether you got every answer right or not, you're still my favorite answer to everything. Come here and collect your prize: kisses. ♡";
    $("#quizFeedback").hidden = false;
    $("#quizNext").hidden = true;
    $("#quizStep").textContent = "QUIZ COMPLETE · LOVE YOU ALWAYS";
    $("#quizProgressFill").style.width = "100%";
    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "secondary-btn";
    restart.textContent = "Play again ♡";
    restart.addEventListener("click", () => { quizIndex = 0; renderQuiz(); });
    $("#quizOptions").appendChild(restart);
  }
});
renderQuiz();

// Gallery dialog.
const photoDialog = $("#photoDialog");
$$(".gallery-photo").forEach(button => button.addEventListener("click", () => {
  const image = $("img", button);
  $("#dialogPhoto").src = image.src;
  $("#dialogPhoto").alt = image.alt;
  $("#dialogCaption").textContent = button.dataset.caption;
  if (typeof photoDialog.showModal === "function") photoDialog.showModal();
  else showToast(button.dataset.caption);
}));
$("#closePhotoDialog").addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("click", event => {
  if (event.target === photoDialog) photoDialog.close();
});

// Secret notes.
$$("[data-secret]").forEach(button => button.addEventListener("click", () => {
  const reveal = $("#secretReveal");
  reveal.textContent = button.dataset.secret;
  reveal.hidden = false;
  $$(".secret-star").forEach(item => item.classList.toggle("active", item === button));
}));

// Song player: add assets/our-song.mp3 to enable the play button.
const audio = $("#ourSong");
const musicToggle = $("#musicToggle");
const musicLabel = $("#musicLabel");
let songAvailable = true;
audio.addEventListener("error", () => {
  songAvailable = false;
  musicLabel.textContent = "Add our song";
});
audio.addEventListener("play", () => { musicToggle.setAttribute("aria-pressed", "true"); musicLabel.textContent = "Pause song"; });
audio.addEventListener("pause", () => { musicToggle.setAttribute("aria-pressed", "false"); musicLabel.textContent = "Our song"; });
musicToggle.addEventListener("click", async () => {
  if (!songAvailable || !audio.querySelector("source").getAttribute("src")) {
    showToast("Add your chosen song as assets/our-song.mp3, then refresh the page. ♡");
    return;
  }
  try {
    if (audio.paused) {
      await audio.play();
      musicLabel.textContent = "Pause song";
    } else {
      audio.pause();
      musicLabel.textContent = "Our song";
    }
  } catch {
    showToast("Your song couldn't play yet. Check that assets/our-song.mp3 exists and is a supported audio file.");
  }
});

// Final hug and restart.
function createHeartBurst(rect) {
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.textContent = i % 3 === 0 ? "✦" : "♡";
    heart.className = "burst-heart";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--dx", `${(Math.random() - .5) * 260}px`);
    heart.style.setProperty("--dy", `${(Math.random() - .7) * 230}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1100);
  }
}
const burstStyle = document.createElement("style");
burstStyle.textContent = `.burst-heart{position:fixed;z-index:60;pointer-events:none;color:#e69abc;font-size:1.3rem;animation:burstAway 1.05s ease-out forwards;text-shadow:0 2px 8px rgba(255,255,255,.8)}@keyframes burstAway{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.3) rotate(25deg)}}`;
document.head.appendChild(burstStyle);
$("#hugBtn").addEventListener("click", () => {
  $("#hugMessage").hidden = false;
  createHeartBurst($("#hugBtn").getBoundingClientRect());
  $("#hugBtn").textContent = "Hug sent with all my love ♡";
});
$("#restartBtn").addEventListener("click", showHome);

// Simple escaping for content inserted into the reason reveal.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

// Birthday countdown copy updates automatically based on the visitor's local date.
(function birthdayGreeting() {
  const date = new Date(`${BIRTHDAY}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthdayThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (today.getTime() === birthdayThisYear.getTime()) {
    $(".eyebrow").innerHTML = "<span>✧</span> TODAY IS YOUR DAY <span>✧</span>";
  } else if (today.getTime() > birthdayThisYear.getTime()) {
    $(".eyebrow").innerHTML = "<span>✧</span> A LITTLE LOVE, JUST FOR YOU <span>✧</span>";
  }
})();
