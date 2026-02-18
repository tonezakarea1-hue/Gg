const words = ["Airport","Hospital","School","Restaurant","Mall","Hotel","Beach"];

let players = [];
let spies = new Set();
let word = "";
let passIndex = 0;
let timerId = null;

const $ = (id) => document.getElementById(id);

$("btnStart").onclick = () => {
  const p = parseInt($("pCount").value, 10);
  const s = parseInt($("sCount").value, 10);

  if (p < 3) return ($("msg").innerText = "کەمترین 3 یاریزان");
  if (s < 1 || s >= p) return ($("msg").innerText = "ژمارەی سیخوڕ هەڵەیە");

  $("msg").innerText = "";

  players = Array.from({ length: p }, (_, i) => ({ name: `Player ${i + 1}` }));
  spies = pickRandomIndexes(p, s);
  word = words[Math.floor(Math.random() * words.length)];
  passIndex = 0;

  $("setup").classList.add("hidden");
  $("roles").classList.remove("hidden");
  updatePassTitle();
};

function pickRandomIndexes(total, count) {
  const set = new Set();
  while (set.size < count) set.add(Math.floor(Math.random() * total));
  return set;
}

function updatePassTitle() {
  $("passTitle").innerText = `مۆبایلەکە بدە دەست Player ${passIndex + 1}`;
  $("card").classList.add("hidden");
}

$("btnReveal").onclick = () => {
  $("card").classList.remove("hidden");
  const isSpy = spies.has(passIndex);
  $("roleText").innerText = isSpy ? "تۆ سیخوڕیت 🕵️" : "تۆ هاووڵاتییت ✅";
  $("wordText").innerText = isSpy ? "وشەکەت نییە ❌" : `وشە: ${word}`;
};

$("btnHide").onclick = () => {
  passIndex++;
  if (passIndex >= players.length) {
    $("roles").classList.add("hidden");
    $("talk").classList.remove("hidden");
    startTimer();
  } else {
    updatePassTitle();
  }
};

function startTimer() {
  const seconds = parseInt($("minutes").value, 10) * 60;
  let t = seconds;

  $("timer").innerText = format(t);

  timerId = setInterval(() => {
    t--;
    $("timer").innerText = format(t);

    if (t <= 0) {
      clearInterval(timerId);
      goVote();
    }
  }, 1000);
}

function format(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

$("btnGoVote").onclick = goVote;

function goVote() {
  if (timerId) clearInterval(timerId);
  $("talk").classList.add("hidden");
  $("vote").classList.remove("hidden");
  renderVoteList();
}

function renderVoteList() {
  const box = $("voteList");
  box.innerHTML = "";

  players.forEach((p, i) => {
    const row = document.createElement("label");
    row.className = "choice";
    row.innerHTML = `
      <input type="radio" name="sus" value="${i}">
      <div>${p.name}</div>
    `;
    box.appendChild(row);
  });
}

$("btnFinish").onclick = () => {
  const picked = document.querySelector('input[name="sus"]:checked');
  if (!picked) return ($("result").innerText = "یەک کەس هەڵبژێرە");

  const suspect = parseInt(picked.value, 10);
  const spyNames = [...spies].map(i => players[i].name).join(", ");
  const isSpy = spies.has(suspect);

  $("result").innerText =
    `گومانلێکراو: ${players[suspect].name}\n` +
    (isSpy ? "✅ سیخوڕ دۆزرایەوە!" : "❌ ئەمە سیخوڕ نەبوو") +
    `\nسیخوڕەکان: ${spyNames}`;
};