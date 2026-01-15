const messages = [
  // ===== マクロ・判断 =====
  { category: "マクロ・判断", label: "なんでプッシュしないの？", text: "Why aren't you pushing the lane?" },
  { category: "マクロ・判断", label: "マップ見れないの？", text: "Can't you see the map?" },
  { category: "マクロ・判断", label: "一人で行くな、合わせろ", text: "Stop pushing alone, play with the team" },
  { category: "マクロ・判断", label: "チームで動け", text: "Play with the team" },

  // ===== 戦闘・エンゲージ =====
  { category: "戦闘・エンゲージ", label: "なんで戦わないの？", text: "Why won't you engage?" },
  { category: "戦闘・エンゲージ", label: "戦うタイミング覚えろ", text: "Learn when to engage" },
  { category: "戦闘・エンゲージ", label: "何してんの？", text: "What are you even doing?" },

  // ===== デス・突っ込み =====
  { category: "デス・突っ込み", label: "敵に突っ込んでいきすぎ", text: "You're overextending" },
  { category: "デス・突っ込み", label: "死にすぎだよ", text: "Stop feeding" },
  { category: "デス・突っ込み", label: "なんで一人で突っ込むの？", text: "Why are you pushing alone?" },
  { category: "デス・突っ込み", label: "相手にタダでキル渡してる", text: "You're giving them free kills" },

  // ===== 実力・練習 =====
  { category: "実力・練習", label: "下手すぎ", text: "You're terrible" },
  { category: "実力・練習", label: "もっと練習しよう", text: "You need to improve" },
  { category: "実力・練習", label: "運じゃなくて実力の問題", text: "That's a skill issue" },

  // ===== 皮肉・嫌味 =====
  { category: "皮肉・嫌味", label: "面白い判断だね（皮肉）", text: "Interesting decision" },
  { category: "皮肉・嫌味", label: "思い切ったな、失敗だけど", text: "Bold play. Didn't work" },
  { category: "皮肉・嫌味", label: "お前のせいでキツくなってる", text: "You're making this hard" },
  { category: "皮肉・嫌味", label: "判断力すごいね", text: "Truly impressive decision making" },
  { category: "皮肉・嫌味", label: "お手本のようだね", text: "Masterclass right there" },
  { category: "皮肉・嫌味", label: "最高のパフォーマンスだね", text: "Peak performance" },

  // ===== 強め煽り =====
  { category: "強め煽り", label: "何やってるか分かってないだろ", text: "You have no idea what you're doing" },
  { category: "強め煽り", label: "本気でやってる？", text: "Are you even trying?" },
  { category: "強め煽り", label: "このゲーム向いてないよ", text: "This isn't your game" },
  { category: "強め煽り", label: "どうやったらそんな下手なの？", text: "How are you this bad?" },
  { category: "強め煽り", label: "お前はマインクラフトやっていたほうがいいよ", text: "You should go play Minecraft instead" },
  { category: "強め煽り", label: "アンインストールしな", text: "Just uninstall" }
];

const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const messageList = document.getElementById("messageList");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const toast = document.getElementById("toast");

let activeCategory = "all";

function uniqueCategories() {
  return ["all", ...new Set(messages.map((m) => m.category))];
}

function renderFilters() {
  categoryFilters.innerHTML = "";
  uniqueCategories().forEach((cat) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.dataset.active = cat === activeCategory;
    button.textContent = cat === "all" ? "すべて" : cat;
    button.addEventListener("click", () => {
      activeCategory = cat;
      renderMessages();
      renderFilters();
    });
    categoryFilters.appendChild(button);
  });
}

function filterMessages() {
  const keyword = searchInput.value.trim().toLowerCase();
  return messages.filter((m) => {
    const matchCategory = activeCategory === "all" || m.category === activeCategory;
    const text = `${m.text} ${m.label} ${m.category}`.toLowerCase();
    const matchKeyword = keyword === "" || text.includes(keyword);
    return matchCategory && matchKeyword;
  });
}

function renderMessages() {
  const filtered = filterMessages();
  messageList.innerHTML = "";

  filtered.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "card-header";

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = m.category;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = m.label;

    header.appendChild(pill);
    header.appendChild(label);

    const text = document.createElement("p");
    text.className = "text";
    text.textContent = m.text;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn copy";
    copyBtn.textContent = "コピー";
    copyBtn.addEventListener("click", () => copyText(m.text, copyBtn));

    footer.appendChild(copyBtn);

    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(footer);
    messageList.appendChild(card);
  });

  emptyState.hidden = filtered.length > 0;
  resultCount.textContent = `${filtered.length} 件`;
}

async function copyText(text, button) {
  const original = button.textContent;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    button.textContent = "コピー完了";
    button.disabled = true;
    showToast("クリップボードにコピーしました");
  } catch (err) {
    console.error(err);
    showToast("コピーに失敗しました。手動でコピーしてください。");
  } finally {
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 1500);
  }
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  toast.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.dataset.show = "false";
    toast.hidden = true;
  }, 1800);
}

searchInput.addEventListener("input", renderMessages);

renderFilters();
renderMessages();
