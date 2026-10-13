/* Personalize this file whenever you want to update the birthday experience. */
const BIRTHDAY = "2026-10-19";
const INITIAL_MEETS = 12;
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

// Expose a direct opening action so the first button still works if another
// interaction script later encounters an unrelated error.
window.openBirthdaySurprise = function () { showChapter(1); };

// Keep chapter navigation responsive even if another feature fails later.
window.showBirthdayChapter = function (number) { showChapter(number); };
document.addEventListener("click", event => {
  const nextButton = event.target.closest && event.target.closest("[data-next]");
  if (nextButton) {
    event.preventDefault();
    window.showBirthdayChapter(nextButton.dataset.next);
  }
});

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

$("#beginBtn").addEventListener("click", event => { event.preventDefault(); showChapter(1); });
$("#homeBtn").addEventListener("click", showHome);
$$("[data-next]").forEach(button => button.addEventListener("click", () => showChapter(button.dataset.next)));
chapterMenuBtn.addEventListener("click", () => {
  const opening = chapterMenu.hidden;
  chapterMenu.hidden = !opening;
  chapterMenuBtn.setAttribute("aria-expanded", String(opening));
});
// Use delegated handling so every chapter menu item works reliably.
chapterMenu.addEventListener("click", event => {
  const button = event.target.closest("button[data-chapter]");
  if (!button || !chapterMenu.contains(button)) return;
  event.preventDefault();
  const target = Number(button.dataset.chapter);
  chapterMenu.hidden = true;
  chapterMenuBtn.setAttribute("aria-expanded", "false");
  showChapter(target);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !chapterMenu.hidden) {
    chapterMenu.hidden = true;
    chapterMenuBtn.setAttribute("aria-expanded", "false");
  }
});

// Birthday cake: animated flames, falling confetti and hearts, and user-supplied celebration sounds.
const cake = $("#birthdayCake");
let birthdaySurpriseShown = false;
const birthdaySound = $("#birthdaySound");
const confettiPopSound = $("#confettiPopSound");

function playBirthdayAsset(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  const result = audio.play();
  if (result && typeof result.catch === "function") result.catch(() => {});
}

function launchBirthdayConfetti() {
  const layer = document.createElement("div");
  layer.className = "birthday-confetti-layer";
  layer.setAttribute("aria-hidden", "true");
  const colors = ["#ff5c9a","#ffb347","#ffe066","#57d9c4","#55b7ff","#a78bfa","#ff7b6b","#f472d0","#8be28b"];
  const pieces = 260;
  for (let i = 0; i < pieces; i++) {
    const heart = i % 3 === 0;
    const piece = document.createElement("span");
    piece.className = heart ? "birthday-confetti heart-confetti" : "birthday-confetti";
    piece.textContent = heart ? (i % 2 ? "♥" : "♡") : "";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.color = colors[(i + 3) % colors.length];
    piece.style.setProperty("--fall-duration", (3.1 + Math.random() * 3.5) + "s");
    piece.style.setProperty("--fall-delay", (Math.random() * .65) + "s");
    piece.style.setProperty("--drift", (Math.random() * 260 - 130) + "px");
    piece.style.setProperty("--spin", (Math.random() * 1080 - 540) + "deg");
    piece.style.setProperty("--piece-size", (6 + Math.random() * 10) + "px");
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 7800);
}

function blowCandles() {
  if (birthdaySurpriseShown) return;
  birthdaySurpriseShown = true;
  cake.classList.add("blown");
  const wish = $("#wishReveal");
  if (wish) wish.hidden = false;
  $(".cake-instruction").textContent = "Wish made. May the universe be gentle with you, Shona. ♡";
  launchBirthdayConfetti();
  playBirthdayAsset(confettiPopSound);
  window.setTimeout(() => playBirthdayAsset(birthdaySound), 180);
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

// Clickable reasons open their hidden messages in a dismissible modal.
const reasonModal = $("#reasonModal");
const reasonModalTitle = $("#reasonModalTitle");
const reasonModalMessage = $("#reasonModalMessage");
const reasonModalKicker = $("#reasonModalKicker");
let reasonModalReturnFocus = null;

function closeReasonModal() {
  if (!reasonModal || reasonModal.hidden) return;
  reasonModal.hidden = true;
  document.body.classList.remove("reason-modal-open");
  $$(".reason-card").forEach(item => item.classList.remove("opened"));
  if (reasonModalReturnFocus && document.contains(reasonModalReturnFocus)) reasonModalReturnFocus.focus();
}

$$(".reason-card").forEach((card, index) => card.addEventListener("click", () => {
  $$(".reason-card").forEach(item => item.classList.toggle("opened", item === card));
  reasonModalReturnFocus = card;
  reasonModalTitle.textContent = card.querySelector("b")?.textContent || "A little reason";
  reasonModalMessage.textContent = card.dataset.reason || "";
  reasonModalKicker.textContent = `REASON NO. ${String(index + 1).padStart(2, "0")}`;
  reasonModal.hidden = false;
  document.body.classList.add("reason-modal-open");
  reasonModal.querySelector(".reason-modal-close")?.focus();
}));

$$("[data-close-reason-modal]").forEach(control => control.addEventListener("click", closeReasonModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeReasonModal();
});

// 100-meets tracker: the first twelve dates are fixed story memories.
const meetMemories = [["The beginning of us","Where you held my hands for the first time."],["Our first date","The first time we went out of the campus together."],["The rose that made me feel special","The day you gave me a rose, a proposal, and a scented hair tie."],["Our book fair date","Wandering around the book fair and spending such a lovely time together."],["Our park adventure","Just the two of us, making an ordinary day feel special."],["Our temple visit","We visited Durga Temple, and you bought me a toy car."],["Our auto-ride romance","You kissed me and placed my hand inside."],["The food we shared","Momos, drinks, and waffles together."],["Our rainy chaos","Our plans went horribly wrong, but we still had each other."],["Our little DIY adventure","We went to DIY and looked around at all the different things together."],["The day you took care of me","Even when things didn't go as planned, you were there for me."],["The wallet and Rasulullah","You gave me things, but what I treasured most was the thought behind them."]];
const meetGrid = $("#meetGrid");
const meetDetailsModal = $("#meetDetailsModal");
const meetDetailsTitle = $("#meetDetailsTitle");
const meetDetailsSummary = $("#meetDetailsSummary");
const meetDetailsNumber = $("#meetDetailsNumber");
const meetDetailsDate = $("#meetDetailsDate");
const meetDetailsClose = () => {
  if (!meetDetailsModal) return;
  meetDetailsModal.hidden = true;
  document.body.classList.remove("meet-details-open");
};
for (let i = 1; i <= TOTAL_MEETS; i++) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = `meet-dot${i <= INITIAL_MEETS ? " completed" : ""}`;
  dot.textContent = i <= INITIAL_MEETS ? "♥" : "·";
  dot.setAttribute("aria-label", i <= INITIAL_MEETS ? `Meet ${i}: ${meetMemories[i-1][0]}` : `Meet ${i}, waiting to happen.`);
  dot.title = i <= INITIAL_MEETS ? `Meet ${i} — ${meetMemories[i-1][0]}` : `Meet ${i} — a future memory`;
  dot.addEventListener("click", () => {
    if (i > INITIAL_MEETS) {
      showToast(`Meet ${i} is waiting to become a memory. One more adventure together, Shona. ♡`);
      return;
    }
    const memory = meetMemories[i - 1];
    meetDetailsNumber.textContent = `MEET ${String(i).padStart(2,"0")} OF 12`;
    meetDetailsTitle.textContent = memory[0];
    meetDetailsSummary.textContent = memory[1];
    meetDetailsDate.textContent = "";
    meetDetailsDate.hidden = true;
    meetDetailsModal.hidden = false;
    document.body.classList.add("meet-details-open");
    meetDetailsModal.querySelector(".meet-details-close")?.focus();
  });
  meetGrid.appendChild(dot);
}
$$("[data-close-meet-details]").forEach(control => control.addEventListener("click", meetDetailsClose));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && meetDetailsModal && !meetDetailsModal.hidden) meetDetailsClose();
});
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

// Couple quiz: personalized questions about our memories and love.
const quizQuestions = [
  {
    "question": "What's my favourite nickname for you? 👑",
    "options": [
      "A) Aloo Bhujia",
      "B) My Queen",
      "C) Bona Badmash",
      "D) Cutie"
    ],
    "answer": 1,
    "correct": "That's right! My Queen. 👑❤️",
    "wrong": "It's My Queen! 👑❤️"
  },
  {
    "question": "What do I call you when you do dumb stuff? 😭",
    "options": [
      "A) Galaxy Destroyer 🌌",
      "B) Befkoof",
      "C) Dumb",
      "D) Dabba"
    ],
    "answer": 3,
    "correct": "Correct, Dabba! 😭❤️",
    "wrong": "It's Dabba! You know I call you that. 😭"
  },
  {
    "question": "When is my birthday? 🎂",
    "options": [
      "A) 21st February",
      "B) 9th February",
      "C) 12th February",
      "D) 6th February"
    ],
    "answer": 2,
    "correct": "Yes! 12th February. 🎂❤️",
    "wrong": "It's 12th February! 🎂❤️"
  },
  {
    "question": "What's my favourite thing about going on dates with you? 💗",
    "options": [
      "A) Getting to explore expensive places",
      "B) Getting free food 😭",
      "C) Spending time with you and making memories together",
      "D) Having an excuse to skip work"
    ],
    "answer": 2,
    "correct": "Exactly! Spending time with you and making memories together. 💗",
    "wrong": "It's spending time with you and making memories together. 💗"
  },
  {
    "question": "What do you often do whenever our plans don't go the way we expected? 🫶",
    "options": [
      "A) Get angry and abandon the date",
      "B) Make me solve everything alone",
      "C) Pretend we planned it that way",
      "D) Help figure things out and find another way"
    ],
    "answer": 3,
    "correct": "That's right! We figure it out together. 🫶",
    "wrong": "You help figure things out and find another way. That's what makes us a team. 🫶"
  },
  {
    "question": "What makes our auto rides so special to me? 🛺❤️",
    "options": [
      "A) Getting somewhere as quickly as possible",
      "B) Holding hands and thighs while stealing kisses",
      "C) The traffic and beautiful roads",
      "D) Sitting quietly without talking"
    ],
    "answer": 1,
    "correct": "Correct! Holding hands and thighs while stealing kisses. 🛺❤️",
    "wrong": "It's holding hands and thighs while stealing kisses. 🛺❤️"
  },
  {
    "question": "What do I love most about the way you show affection? 💋",
    "options": [
      "A) When you pull me closer to kiss me",
      "B) When you buy me food",
      "C) When you let me win arguments",
      "D) When you make fun of me"
    ],
    "answer": 0,
    "correct": "Yes! When you pull me closer to kiss me. 💋",
    "wrong": "It's when you pull me closer to kiss me. 💋"
  },
  {
    "question": "Remember that date when our plans went wrong and it started raining? 🌧️ What happened?",
    "options": [
      "A) We went straight home",
      "B) We spent the rest of the day shopping",
      "C) We visited another Hanuman temple, and you lent me your umbrella",
      "D) We found a restaurant and stayed there"
    ],
    "answer": 2,
    "correct": "You remember! Another Hanuman temple, and your umbrella. 🌧️❤️",
    "wrong": "We visited another Hanuman temple, and you lent me your umbrella. 🌧️❤️"
  },
  {
    "question": "Why do I write little paragraphs about our dates? 💌",
    "options": [
      "A) To remember how much money we spend",
      "B) To make sure you never forget anything 😭",
      "C) To tease you forever",
      "D) To preserve our memories and remember how these moments felt"
    ],
    "answer": 3,
    "correct": "Exactly! To preserve our memories and remember how these moments felt. 💌",
    "wrong": "It's to preserve our memories and remember how these moments felt. 💌"
  },
  {
    "question": "What is something you do that makes me feel loved even without saying a single word? 🥹",
    "options": [
      "A) The way you look at me",
      "B) The way you reach for my hand",
      "C) The way you pull me closer",
      "D) All of the above ❤️"
    ],
    "answer": 3,
    "correct": "All of the above! Every little thing makes me feel loved. 🥹❤️",
    "wrong": "It's all of the above—the way you look at me, reach for my hand, and pull me closer. 🥹❤️"
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
const musicControl = $("#musicControl");
const musicPopover = $("#musicPopover");
const songVolume = $("#songVolume");
const songVolumeValue = $("#songVolumeValue");
let musicPopoverTimer = null;
let songAvailable = true;
audio.volume = 0.5;
function showMusicPopover() {
  if (!musicPopover || !musicControl) return;
  clearTimeout(musicPopoverTimer);
  musicPopover.hidden = false;
  musicControl.classList.add("is-open");
}
function hideMusicPopoverSoon() {
  clearTimeout(musicPopoverTimer);
  musicPopoverTimer = setTimeout(() => {
    if (musicControl && !musicControl.matches(":hover") && !musicPopover.contains(document.activeElement)) {
      musicPopover.hidden = true;
      musicControl.classList.remove("is-open");
    }
  }, 3500);
}
if (musicControl && musicPopover) {
  musicControl.addEventListener("pointerenter", showMusicPopover);
  musicControl.addEventListener("pointerleave", hideMusicPopoverSoon);
  musicControl.addEventListener("focusin", showMusicPopover);
  musicControl.addEventListener("focusout", hideMusicPopoverSoon);
  musicToggle.addEventListener("click", () => { showMusicPopover(); hideMusicPopoverSoon(); });
}
if (songVolume) {
  songVolume.addEventListener("input", () => {
    audio.volume = Number(songVolume.value) / 100;
    songVolumeValue.textContent = songVolume.value + "%";
    showMusicPopover();
  });
}
audio.addEventListener("error", () => {
  songAvailable = false;
  musicLabel.textContent = "Add our song";
});
audio.addEventListener("play", () => { musicToggle.setAttribute("aria-pressed", "true"); musicLabel.textContent = "Pause song"; });
audio.addEventListener("pause", () => { musicToggle.setAttribute("aria-pressed", "false"); musicLabel.textContent = "Our song"; if (musicControl) { showMusicPopover(); hideMusicPopoverSoon(); } });

// Start the song as soon as the page opens. Browsers may block audible
// autoplay, so retry on the visitor's first tap/click or key press.
async function tryAutoPlaySong() {
  if (!songAvailable || !audio || !audio.querySelector("source")?.getAttribute("src") || !audio.paused) return;
  try {
    await audio.play();
    document.removeEventListener("pointerdown", tryAutoPlaySong);
    document.removeEventListener("keydown", tryAutoPlaySong);
  } catch {
    // Autoplay is commonly blocked until a real user interaction.
  }
}
tryAutoPlaySong();
document.addEventListener("pointerdown", tryAutoPlaySong);
document.addEventListener("keydown", tryAutoPlaySong);
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


// Chapter Six: interactive star-heart game.
(() => {
  const $id = id => document.getElementById(id);
  const intro=$id("starGameIntro"), play=$id("starGamePlay"), win=$id("starGameWin"), start=$id("startStarGame");
  const board=$id("starBoard"), bg=$id("starBackground"), targets=$id("starTargets"), lines=$id("starConnections"), preview=$id("starPreview");
  if(!board || !start) return;
  const NS="http://www.w3.org/2000/svg";
  const pts=[[500,475],[385,405],[280,320],[240,235],[275,165],[350,160],[420,220],[500,292],[580,220],[650,160],[725,165],[760,235],[720,320],[615,405]];
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let connected=0, dragging=false, pointerId=null, suppressClick=false, completed=false, soundOn=true;
  window.starHeartGameCompleted=false; // Always reset on a page refresh; never persist game progress.
  const el=(tag,attrs={})=>{const n=document.createElementNS(NS,tag);Object.keys(attrs).forEach(k=>n.setAttribute(k,attrs[k]));return n;};
  function makeBg(){let seed=4421;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<145;i++){const c=el("circle",{cx:12+rnd()*976,cy:8+rnd()*604,r:.6+rnd()*1.5,class:"star-distant",opacity:.25+rnd()*.6});c.style.animationDelay=(rnd()*5)+"s";bg.appendChild(c);}}
  function drawTargets(){targets.replaceChildren();pts.forEach((p,i)=>{const g=el("g",{"data-index":i,tabindex:"0",role:"button",class:"star-target"+(i===connected?" is-current":i===connected+1?" is-next":i<connected?" is-connected":""),"aria-label":i===0?"Starting star":"Star "+(i+1)+" of "+pts.length});g.appendChild(el("circle",{cx:p[0],cy:p[1],r:23,class:"star-hit-area"}));g.appendChild(el("circle",{cx:p[0],cy:p[1],r:i===connected?7:5,class:"star-core"}));g.appendChild(el("path",{d:"M "+p[0]+" "+(p[1]-10)+" L "+(p[0]+2)+" "+(p[1]-2)+" L "+(p[0]+10)+" "+p[1]+" L "+(p[0]+2)+" "+(p[1]+2)+" L "+p[0]+" "+(p[1]+10)+" L "+(p[0]-2)+" "+(p[1]+2)+" L "+(p[0]-10)+" "+p[1]+" L "+(p[0]-2)+" "+(p[1]-2)+" Z",class:"star-rays"}));g.addEventListener("pointerdown",down);g.addEventListener("pointerup",up);g.addEventListener("keydown",key);g.addEventListener("click",click);targets.appendChild(g);});}
  function drawLine(){const arr=pts.slice(0,connected+1);if(completed)arr.push(pts[0]);lines.setAttribute("points",arr.map(p=>p.join(",")).join(" "));const p=pts[connected];preview.setAttribute("x1",p[0]);preview.setAttribute("y1",p[1]);}
  function progress(){drawTargets();drawLine();$id("starProgressText").textContent=connected+" of "+(pts.length-1)+" connections completed";$id("starProgressFill").style.width=(connected/(pts.length-1)*100)+"%";}
  function say(s){$id("starGameHint").textContent=s;}
  function dust(x,y){if(reduced)return;const group=$id("starParticles");for(let i=0;i<8;i++){const p=el("circle",{cx:x,cy:y,r:1.5+Math.random()*2,class:"star-dust"});p.style.setProperty("--dx",((Math.random()-.5)*65)+"px");p.style.setProperty("--dy",((Math.random()-.5)*65)+"px");group.appendChild(p);p.addEventListener("animationend",()=>p.remove(),{once:true});}}
  function wrong(){say("Almost, Shona — look for the softly glowing next star. Your progress is safe. ♡");board.classList.remove("star-mistake");void board.getBoundingClientRect();board.classList.add("star-mistake");setTimeout(()=>board.classList.remove("star-mistake"),350);}
  function connect(){if(completed||connected>=pts.length-1)return;connected++;starTone(connected);dust(pts[connected][0],pts[connected][1]);progress();if(connected===pts.length-1){completed=true;lines.setAttribute("points",pts.concat([pts[0]]).map(p=>p.join(",")).join(" "));finish();}else say("Beautiful. Follow the next little light. ♡");}
  function down(e){if(completed)return;const i=Number(e.currentTarget.dataset.index);if(i===connected){dragging=true;pointerId=e.pointerId;preview.setAttribute("opacity",".85");if(connected===0)say("Lovely. Now drag from each glowing star to the next pink light.");}}
  function up(e){if(!dragging||pointerId!==e.pointerId)return;const i=Number(e.currentTarget.dataset.index);if(i===connected+1){connect();suppressClick=true;}else if(i!==connected)wrong();dragging=false;pointerId=null;preview.setAttribute("opacity","0");}
  function click(e){if(suppressClick){suppressClick=false;return;}if(completed)return;const i=Number(e.currentTarget.dataset.index);if(connected===0&&i===0){say("Starting star found. Now drag from it to the next glowing light.");return;}if(i===connected+1){connect();}else if(i!==connected)wrong();}
  function key(e){if(e.key!=="Enter"&&e.key!==" ")return;e.preventDefault();if(completed)return;const i=Number(e.currentTarget.dataset.index);if(connected===0&&i===0){say("Starting star found. Focus the next glowing star and press Enter.");return;}if(i===connected+1)connect();else if(i!==connected)wrong();}
  board.addEventListener("pointermove",e=>{if(!dragging)return;const m=board.getScreenCTM();if(!m)return;const p=board.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(m.inverse());preview.setAttribute("x2",q.x);preview.setAttribute("y2",q.y);});
  board.addEventListener("pointerup",()=>{dragging=false;pointerId=null;preview.setAttribute("opacity","0");});

  // A tiny, distinct synthesized note for each star, plus a soft click for all buttons.
  let soundContext=null;
  function getSoundContext(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!soundContext)soundContext=new C();if(soundContext.state==="suspended")soundContext.resume().catch(()=>{});return soundContext;}
  function starTone(step){if(soundOn&&window.playAudioEffect)window.playAudioEffect("starSparkleSound");}

  function chime(){if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C(),t=ctx.currentTime;[659.25,783.99,987.77].forEach((hz,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=hz;g.gain.setValueAtTime(.0001,t+i*.13);g.gain.exponentialRampToValueAtTime(.07,t+i*.13+.03);g.gain.exponentialRampToValueAtTime(.0001,t+i*.13+.65);o.connect(g);g.connect(ctx.destination);o.start(t+i*.13);o.stop(t+i*.13+.7);});setTimeout(()=>ctx.close(),1300);}catch(e){}}
  function finish(){window.starHeartGameCompleted=true;chime();$id("starGame").classList.add("star-game-complete");$id("starLockNote").textContent="The heart is yours now ♡";say("You found it, Shona. ♡");setTimeout(()=>{play.hidden=true;win.hidden=false;win.classList.add("star-win-reveal");},reduced?0:700);}
  window.startStarHeartGame = function() {
    if (!intro || !play) return;
    intro.hidden = true;
    play.hidden = false;
    $id("starGame").classList.add("star-game-started");
    say("Tap the first glowing star, then tap or drag to the next glowing star.");
    if (!bg.childElementCount) makeBg();
    progress();
  };
  start.addEventListener("click", window.startStarHeartGame);
  document.addEventListener("click", event => {
    const button = event.target.closest && event.target.closest("#startStarGame");
    if (button && play.hidden) window.startStarHeartGame();
  });
  $id("starSoundToggle").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?"♫ Sound on":"♫ Sound off";e.currentTarget.setAttribute("aria-pressed",String(!soundOn));e.currentTarget.setAttribute("aria-label",soundOn?"Mute completion chime":"Enable completion chime");});
  $id("continueStarStory").addEventListener("click",()=>{if(completed)window.showBirthdayChapter(7);});
  makeBg();progress();
})();

 
// Use the supplied sound files. If the completion MP3 is missing/unavailable,
// play a short built-in melody so page navigation never becomes silent.
function playFallbackCompletionMelody() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [659.25, 783.99, 987.77, 1174.66];
    const startAt = ctx.currentTime + 0.02;
    notes.forEach((hz, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = startAt + i * 0.14;
      osc.type = "sine";
      osc.frequency.setValueAtTime(hz, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.075, at + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.48);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.5);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1100);
  } catch (e) {}
}
window.playAudioEffect = function(id) {
  const source = document.getElementById(id);
  if (!source) {
    if (id === "chapterCompleteSound") playFallbackCompletionMelody();
    return;
  }
  let fallbackUsed = false;
  const fallback = () => {
    if (id === "chapterCompleteSound" && !fallbackUsed) {
      fallbackUsed = true;
      playFallbackCompletionMelody();
    }
  };
  try {
    const sound = source.cloneNode(true);
    sound.volume = 0.8;
    sound.currentTime = 0;
    sound.addEventListener("error", fallback, {once:true});
    const result = sound.play();
    if (result && typeof result.catch === "function") result.catch(fallback);
    // The file currently may be missing from the repository; use the fallback
    // if the browser never successfully starts playback.
    if (id === "chapterCompleteSound") setTimeout(() => {
      if (sound.error || sound.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fallback();
    }, 500);
    sound.addEventListener("ended", () => sound.remove(), {once:true});
  } catch (e) {
    fallback();
  }
};
document.addEventListener("click", event => {
  const button = event.target.closest && event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.id === "startStarGame" || button.closest("#starTargets")) return;
  // Navigation plays only the completion melody; all other buttons use the click sound.
  if (button.matches("[data-next]")) {
    window.playAudioEffect("chapterCompleteSound");
  } else {
    window.playAudioEffect("uiClickSound");
  }
}, true);
