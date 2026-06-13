const STORAGE_KEY = "matome-template-kit-v2";

const templates = [
  { id: "01", name: "News Link Classic", note: "まとめリンク集に近い軽量デザイン", colors: ["#fffdf6", "#191815", "#c71f37"] },
  { id: "02", name: "Dark Tech Feed", note: "PC・ゲーム系に合う暗色ニュース", colors: ["#101114", "#8fd14f", "#f4f0e8"] },
  { id: "03", name: "Magazine Grid", note: "画像ありの記事をカードで見せる", colors: ["#f8f8f8", "#111111", "#dedede"] },
  { id: "04", name: "Editorial Paper", note: "読み物・芸能・話題系向け", colors: ["#f2efe6", "#231f1a", "#b63b25"] },
  { id: "05", name: "Mobile Blue", note: "スマホ読者向けの軽い配色", colors: ["#eff7f8", "#10272b", "#77aeb8"] },
  { id: "06", name: "Bold Ranking", note: "ランキングを目立たせる", colors: ["#ffffff", "#151515", "#ffde59"] },
  { id: "07", name: "Night Viral", note: "速報・エンタメ向け", colors: ["#121212", "#f04d23", "#f6f1e4"] },
  { id: "08", name: "Clean Portal", note: "企業系ニュースにも使いやすい", colors: ["#f9fbff", "#005bbb", "#14213d"] },
  { id: "09", name: "Pop Culture", note: "芸能・アニメ・SNSまとめ向け", colors: ["#fff7fb", "#e84a8a", "#361824"] },
  { id: "10", name: "Text Bulletin", note: "画像なしの高速テキスト型", colors: ["#f3f6ee", "#1f2c1b", "#7a9a58"] }
];

const adPresets = [
  { id: "responsive", name: "レスポンシブ", width: 0, height: 0, note: "AdSense推奨" },
  { id: "300x250", name: "レクタングル 300x250", width: 300, height: 250, note: "本文中・サイドバー" },
  { id: "336x280", name: "ラージレクタングル 336x280", width: 336, height: 280, note: "本文中" },
  { id: "728x90", name: "リーダーボード 728x90", width: 728, height: 90, note: "PC記事上・記事下" },
  { id: "970x250", name: "ビルボード 970x250", width: 970, height: 250, note: "PC上部大型" },
  { id: "320x100", name: "モバイルラージ 320x100", width: 320, height: 100, note: "スマホ上部" },
  { id: "320x50", name: "モバイルバナー 320x50", width: 320, height: 50, note: "スマホ小型" },
  { id: "160x600", name: "ワイドスカイスクレイパー 160x600", width: 160, height: 600, note: "PCサイドバー" }
];

const sampleArticles = [
  articleSeed("https://example.com/news/ev-manual", "EVなのに疑似MTを再現する新技術が話題に", "サンプル速報", "総合", "SNSで反応が集まっている技術ニュース。リンク先の記事を紹介する形で掲載します。", 2, -28),
  articleSeed("https://example.com/entertainment/dress", "人気俳優のドレス姿に注目、写真投稿から一気に拡散", "芸能サンプルNEO", "芸能", "イベント写真をきっかけに関連ワードが急上昇。反応が集まっています。", 3, -64),
  articleSeed("https://example.com/game/gpu", "グラボはどこまで必要？ライトユーザーのPC選びが盛り上がる", "自作PCサンプル", "D+", "用途別の考え方を紹介する記事です。コメントや短い紹介文で誘導します。", 1, -96),
  articleSeed("https://example.com/anime/classic", "90年代アニメの攻めた描写に再注目、当時の放送時間も話題", "あのころサンプル", "アニメ", "懐かしさと驚きが混ざるテーマ。世代ごとの見方の違いも話題です。", 2, -130),
  articleSeed("https://example.com/web/ai-image", "AI画像の扱いをめぐる新ルール、クリエイター側の反応は", "Web+サンプル", "Web+", "生成AIコンテンツの表示、保存、配布について議論が続いています。", 3, -210)
];

let state = loadState();
let editingId = null;
let editingAdId = null;
let selectedCategory = "all";
let pendingCandidates = [];

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const els = {
  templateSelect: qs("#templateSelect"),
  templateBoard: qs("#templateBoard"),
  adForm: qs("#adForm"),
  adNameInput: qs("#adNameInput"),
  adPlacementInput: qs("#adPlacementInput"),
  adSizeInput: qs("#adSizeInput"),
  adCodeInput: qs("#adCodeInput"),
  saveAdButton: qs("#saveAdButton"),
  clearAdButton: qs("#clearAdButton"),
  adList: qs("#adList"),
  sourceForm: qs("#sourceForm"),
  sourceUrlInput: qs("#sourceUrlInput"),
  sourceNameInput: qs("#sourceNameInput"),
  sourceCategoryInput: qs("#sourceCategoryInput"),
  sourceLimitInput: qs("#sourceLimitInput"),
  sourceRankInput: qs("#sourceRankInput"),
  sourceStatus: qs("#sourceStatus"),
  clearSourceButton: qs("#clearSourceButton"),
  importSelectedButton: qs("#importSelectedButton"),
  candidateList: qs("#candidateList"),
  articleForm: qs("#articleForm"),
  urlInput: qs("#urlInput"),
  titleInput: qs("#titleInput"),
  siteInput: qs("#siteInput"),
  categoryInput: qs("#categoryInput"),
  descriptionInput: qs("#descriptionInput"),
  imageInput: qs("#imageInput"),
  rankInput: qs("#rankInput"),
  fetchButton: qs("#fetchButton"),
  fetchStatus: qs("#fetchStatus"),
  clearButton: qs("#clearButton"),
  seedButton: qs("#seedButton"),
  previewButton: qs("#previewButton"),
  saveButton: qs("#saveButton"),
  searchInput: qs("#searchInput"),
  adminArticleList: qs("#adminArticleList"),
  publicSite: qs("#publicSite"),
  categoryList: qs("#categoryList"),
  statArticles: qs("#statArticles"),
  statSites: qs("#statSites"),
  statCats: qs("#statCats"),
  downloadJsonButton: qs("#downloadJsonButton"),
  copyHtmlButton: qs("#copyHtmlButton"),
  exportOutput: qs("#exportOutput")
};

init();

function init() {
  renderTemplateControls();
  renderAdPresetOptions();
  bindEvents();
  applyTemplate(state.templateId);
  render();
}

function articleSeed(url, title, site, category, description, rank, minutes) {
  return {
    id: crypto.randomUUID(),
    url,
    title,
    site,
    category,
    description,
    image: "",
    rank,
    createdAt: new Date(Date.now() + minutes * 60000).toISOString()
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { templateId: "01", articles: sampleArticles, sources: [], ads: sampleAds() };

  try {
    const parsed = JSON.parse(saved);
    return {
      templateId: parsed.templateId || "01",
      articles: Array.isArray(parsed.articles) ? parsed.articles : sampleArticles,
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      ads: Array.isArray(parsed.ads) ? parsed.ads : sampleAds()
    };
  } catch {
    return { templateId: "01", articles: sampleArticles, sources: [], ads: sampleAds() };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  qsa(".nav-button").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.panel));
  });

  els.templateSelect.addEventListener("change", (event) => {
    applyTemplate(event.target.value);
    render();
  });

  els.sourceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    scanSourceSite();
  });
  els.clearSourceButton.addEventListener("click", clearSourceForm);
  els.importSelectedButton.addEventListener("click", importSelectedCandidates);

  els.adForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAd();
  });
  els.clearAdButton.addEventListener("click", clearAdForm);

  els.articleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveArticle();
  });

  els.fetchButton.addEventListener("click", fetchArticleMeta);
  els.clearButton.addEventListener("click", clearArticleForm);
  els.seedButton.addEventListener("click", restoreSamples);
  els.previewButton.addEventListener("click", () => switchPanel("site"));
  els.searchInput.addEventListener("input", renderAdminList);
  els.downloadJsonButton.addEventListener("click", downloadJson);
  els.copyHtmlButton.addEventListener("click", copyExportHtml);
}

function switchPanel(panel) {
  qsa(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === panel);
  });
  qsa(".panel").forEach((section) => {
    section.classList.toggle("active", section.id === `panel-${panel}`);
  });
  if (panel === "site") renderPublicSite();
  if (panel === "export") renderExportHtml();
}

function renderTemplateControls() {
  els.templateSelect.innerHTML = templates.map((template) => (
    `<option value="${template.id}">${template.id}. ${escapeHtml(template.name)}</option>`
  )).join("");

  els.templateBoard.innerHTML = templates.map((template) => (
    `<article class="template-card" data-template-card="${template.id}">
      <h3>${template.id}. ${escapeHtml(template.name)}</h3>
      <p class="body-copy">${escapeHtml(template.note)}</p>
      <div class="template-swatch">
        ${template.colors.map((color) => `<span style="background:${color}"></span>`).join("")}
      </div>
    </article>`
  )).join("");

  qsa("[data-template-card]").forEach((card) => {
    card.addEventListener("click", () => {
      applyTemplate(card.dataset.templateCard);
      render();
      switchPanel("site");
    });
  });
}

function renderAdPresetOptions() {
  els.adSizeInput.innerHTML = adPresets.map((preset) => (
    `<option value="${preset.id}">${escapeHtml(preset.name)} - ${escapeHtml(preset.note)}</option>`
  )).join("");
}

function applyTemplate(templateId) {
  state.templateId = templateId;
  document.body.dataset.template = templateId;
  els.templateSelect.value = templateId;
  qsa("[data-template-card]").forEach((card) => {
    card.classList.toggle("active", card.dataset.templateCard === templateId);
  });
  saveState();
}

function render() {
  renderCandidateList();
  renderAdminList();
  renderAdList();
  renderPublicSite();
  renderStats();
  renderCategoryDatalist();
  renderExportHtml();
}

function sampleAds() {
  return [
    {
      id: crypto.randomUUID(),
      name: "サイドバー 300x250",
      placement: "sidebar",
      size: "300x250",
      code: "",
      enabled: true
    },
    {
      id: crypto.randomUUID(),
      name: "記事上 レスポンシブ",
      placement: "top",
      size: "responsive",
      code: "",
      enabled: true
    }
  ];
}

async function scanSourceSite() {
  const sourceUrl = normalizeUrl(els.sourceUrlInput.value.trim());
  if (!sourceUrl) {
    els.sourceStatus.textContent = "先にまとめサイトURLを入力してください。";
    return;
  }

  const sourceName = els.sourceNameInput.value.trim() || getHost(sourceUrl);
  const category = els.sourceCategoryInput.value.trim() || "総合";
  const limit = Number(els.sourceLimitInput.value) || 20;
  const rank = Number(els.sourceRankInput.value) || 2;

  els.sourceStatus.textContent = "サイトを読み込んでいます。";
  pendingCandidates = [];
  renderCandidateList();

  try {
    const markdown = await fetchReadableText(sourceUrl);
    const candidates = extractArticleLinks(markdown, sourceUrl)
      .filter((item) => !state.articles.some((article) => article.url === item.url))
      .slice(0, limit)
      .map((item) => ({
        ...item,
        site: sourceName,
        category,
        rank,
        description: `${sourceName} の記事リンクです。`,
        image: "",
        checked: true
      }));

    pendingCandidates = candidates;
    upsertSource(sourceUrl, sourceName, category);
    els.sourceStatus.textContent = candidates.length
      ? `${candidates.length}件の記事候補を見つけました。追加したい記事にチェックを入れてください。`
      : "記事候補が見つかりませんでした。相手サイトが取得を制限しているか、リンク構造が特殊です。";
    render();
  } catch (error) {
    els.sourceStatus.textContent = "取得に失敗しました。サイト側の制限、CORS、アクセス拒否が原因のことがあります。";
  }
}

function extractArticleLinks(markdown, sourceUrl) {
  const source = new URL(sourceUrl);
  const links = [];
  const seen = new Set();
  const linkPattern = /\[([^\]\n]{6,120})\]\(([^)\s]+)\)/g;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const title = cleanTitle(match[1]);
    const rawHref = match[2];
    const url = normalizeUrl(rawHref, sourceUrl);
    if (!url || seen.has(url)) continue;

    const parsed = new URL(url);
    if (isWeakLink(title, parsed, source)) continue;

    seen.add(url);
    links.push({ title, url });
  }

  return links;
}

function isWeakLink(title, url, source) {
  const weakTitles = ["home", "rss", "feed", "about", "contact", "privacy", "利用規約", "お問い合わせ", "トップ", "ホーム", "次へ", "前へ", "続きを読む"];
  const lower = title.toLowerCase();
  if (weakTitles.some((word) => lower === word || title.includes(word))) return true;
  if (/\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(url.pathname)) return true;
  if (url.hash && url.pathname === "/") return true;
  if (title.length < 8) return true;
  if (url.hostname.replace(/^www\./, "") === source.hostname.replace(/^www\./, "")) {
    const internalNav = /\/(search|category|tag|author|about|contact|privacy|feed|rss|page)(\/|$)/i;
    if (url.pathname === "/" || internalNav.test(url.pathname)) return true;
    if (url.search && /[?&](q|s|keyword|cat|tag)=/i.test(url.search)) return true;
  }
  if (/amazon\./i.test(url.hostname) || /\/dp\//i.test(url.pathname)) return true;
  return false;
}

function renderCandidateList() {
  if (!pendingCandidates.length) {
    els.candidateList.innerHTML = `<p class="body-copy">まだ記事候補はありません。左のフォームにまとめサイトURLを入れて取得してください。</p>`;
    return;
  }

  els.candidateList.innerHTML = pendingCandidates.map((item, index) => (
    `<label class="candidate-item">
      <input type="checkbox" data-candidate="${index}" ${item.checked ? "checked" : ""}>
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.site)} / ${escapeHtml(item.category)} / ${escapeHtml(item.url)}</small>
      </span>
    </label>`
  )).join("");

  qsa("[data-candidate]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      pendingCandidates[Number(checkbox.dataset.candidate)].checked = checkbox.checked;
    });
  });
}

function importSelectedCandidates() {
  const selected = pendingCandidates.filter((item) => item.checked);
  if (!selected.length) {
    els.sourceStatus.textContent = "追加する記事を選んでください。";
    return;
  }

  const now = Date.now();
  const newArticles = selected.map((item, index) => ({
    id: crypto.randomUUID(),
    url: item.url,
    title: item.title,
    site: item.site,
    category: item.category,
    description: item.description,
    image: item.image,
    rank: item.rank,
    createdAt: new Date(now - index * 60000).toISOString()
  }));

  state.articles = [...newArticles, ...state.articles];
  pendingCandidates = [];
  saveState();
  els.sourceStatus.textContent = `${newArticles.length}件を記事一覧へ追加しました。`;
  render();
  switchPanel("dashboard");
}

function upsertSource(url, name, category) {
  const existing = state.sources.find((source) => source.url === url);
  if (existing) {
    existing.name = name;
    existing.category = category;
    existing.lastScannedAt = new Date().toISOString();
  } else {
    state.sources.unshift({
      id: crypto.randomUUID(),
      url,
      name,
      category,
      lastScannedAt: new Date().toISOString()
    });
  }
  saveState();
}

async function fetchArticleMeta() {
  const url = normalizeUrl(els.urlInput.value.trim());
  if (!url) {
    els.fetchStatus.textContent = "先にURLを入力してください。";
    return;
  }

  els.fetchStatus.textContent = "取得中です。";
  try {
    const text = await fetchReadableText(url);
    const title = text.match(/^Title:\s*(.+)$/m)?.[1] || text.match(/^#\s+(.+)$/m)?.[1] || "";
    const description = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("Title:") && !line.startsWith("URL Source:"))
      .slice(0, 3)
      .join(" ")
      .slice(0, 180);

    els.urlInput.value = url;
    if (title) els.titleInput.value = cleanTitle(title);
    if (description) els.descriptionInput.value = description;
    els.siteInput.value ||= getHost(url);
    els.categoryInput.value ||= "総合";
    els.fetchStatus.textContent = "取得しました。必要に応じて編集してください。";
  } catch {
    els.urlInput.value = url;
    els.siteInput.value ||= getHost(url);
    els.categoryInput.value ||= "総合";
    els.fetchStatus.textContent = "自動取得に失敗しました。タイトルなどを手入力してください。";
  }
}

async function fetchReadableText(url) {
  const normalized = normalizeUrl(url);
  const proxyUrl = `https://r.jina.ai/http://${normalized}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error("fetch failed");
  return response.text();
}

function renderAdminList() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const articles = getSortedArticles().filter((article) => (
    !keyword ||
    article.title.toLowerCase().includes(keyword) ||
    article.site.toLowerCase().includes(keyword) ||
    article.category.toLowerCase().includes(keyword)
  ));

  if (!articles.length) {
    els.adminArticleList.innerHTML = `<p class="body-copy">記事がありません。</p>`;
    return;
  }

  els.adminArticleList.innerHTML = articles.map((article) => (
    `<article class="admin-item">
      <img class="admin-thumb" src="${escapeAttr(article.image || placeholderImage(article.category))}" alt="">
      <div>
        <p class="admin-title">${escapeHtml(article.title)}</p>
        <div class="admin-meta">${escapeHtml(article.category)} / ${escapeHtml(article.site)} / ${timeAgo(article.createdAt)}</div>
      </div>
      <div class="item-actions">
        <button class="icon-button" title="編集" data-edit="${article.id}">E</button>
        <button class="icon-button" title="削除" data-delete="${article.id}">X</button>
      </div>
    </article>`
  )).join("");

  qsa("[data-edit]").forEach((button) => button.addEventListener("click", () => editArticle(button.dataset.edit)));
  qsa("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteArticle(button.dataset.delete)));
}

function renderPublicSite() {
  const articles = selectedCategory === "all"
    ? getSortedArticles()
    : getSortedArticles().filter((article) => article.category === selectedCategory);
  const categories = getCategories();
  const sites = [...new Set(state.articles.map((article) => article.site).filter(Boolean))];
  const ranking = [...state.articles].sort((a, b) => Number(b.rank) - Number(a.rank)).slice(0, 6);
  const template = templates.find((item) => item.id === state.templateId) || templates[0];

  els.publicSite.innerHTML = `
    <header class="site-header">
      <div>
        <p class="eyebrow">${escapeHtml(template.name)}</p>
        <h2 class="site-title">Matome Links</h2>
      </div>
      <nav class="site-nav" aria-label="カテゴリ">
        <button data-category="all">すべて</button>
        ${categories.map((cat) => `<button data-category="${escapeAttr(cat)}">${escapeHtml(cat)}</button>`).join("")}
      </nav>
    </header>
    <div class="site-body">
      <main class="news-list">
        ${renderAdsByPlacement("top")}
        ${renderNewsFeedWithAds(articles)}
        ${renderAdsByPlacement("bottom")}
      </main>
      <aside class="side-column">
        ${renderAdsByPlacement("sidebar")}
        <section class="public-box">
          <h3>人気リンク</h3>
          <ol>${ranking.map((article) => `<li><a href="${escapeAttr(article.url)}" target="_blank" rel="noopener">${escapeHtml(article.title)}</a></li>`).join("")}</ol>
        </section>
        <section class="public-box">
          <h3>登録まとめサイト</h3>
          <ul>${sites.map((site) => `<li>${escapeHtml(site)}</li>`).join("")}</ul>
        </section>
        <section class="public-box">
          <h3>PR</h3>
          <p class="body-copy">ここに広告タグやアフィリエイト枠を入れます。</p>
        </section>
      </aside>
    </div>`;

  qsa("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderPublicSite();
    });
  });
}

function renderNewsFeedWithAds(articles) {
  if (!articles.length) return `<p class="body-copy">このカテゴリの記事はまだありません。</p>`;
  const middleAds = renderAdsByPlacement("middle");
  const splitIndex = Math.min(4, articles.length);
  const before = articles.slice(0, splitIndex).map(renderNewsItem).join("");
  const after = articles.slice(splitIndex).map(renderNewsItem).join("");
  return `${before}${middleAds}${after}`;
}

function renderNewsItem(article) {
  return `<a class="news-item" href="${escapeAttr(article.url)}" target="_blank" rel="noopener">
    <img src="${escapeAttr(article.image || placeholderImage(article.category))}" alt="">
    <div>
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.description || "リンク先の記事を紹介しています。")}</p>
      <div class="meta-row">
        <span>${escapeHtml(article.category)}</span>
        <span class="rank-mark">${"★".repeat(Number(article.rank) || 1)}</span>
        <span>${timeAgo(article.createdAt)}</span>
        <span>引用元: ${escapeHtml(article.site || getHost(article.url))}</span>
      </div>
    </div>
  </a>`;
}

function renderAdsByPlacement(placement) {
  const ads = (state.ads || []).filter((ad) => ad.enabled !== false && ad.placement === placement);
  return ads.map(renderAdSlot).join("");
}

function renderAdSlot(ad) {
  const preset = adPresets.find((item) => item.id === ad.size) || adPresets[0];
  const style = preset.width
    ? `style="--ad-width:${preset.width}px;--ad-height:${preset.height}px"`
    : "";
  const code = ad.code.trim();
  return `<section class="ad-slot ad-${escapeAttr(ad.placement)} ${preset.id === "responsive" ? "ad-responsive" : ""}" ${style}>
    <div class="ad-label">広告</div>
    <div class="ad-box">
      ${code || `<span>${escapeHtml(preset.name)}</span><small>${preset.width ? `${preset.width} x ${preset.height}` : "responsive"}</small>`}
    </div>
  </section>`;
}

function renderAdList() {
  if (!state.ads || !state.ads.length) {
    els.adList.innerHTML = `<p class="body-copy">広告枠はまだありません。</p>`;
    return;
  }

  els.adList.innerHTML = state.ads.map((ad) => {
    const preset = adPresets.find((item) => item.id === ad.size) || adPresets[0];
    return `<article class="ad-admin-item">
      <div>
        <p class="admin-title">${escapeHtml(ad.name)}</p>
        <div class="admin-meta">${placementName(ad.placement)} / ${escapeHtml(preset.name)} / ${ad.enabled === false ? "非表示" : "表示"}</div>
      </div>
      <div class="item-actions">
        <button class="icon-button" title="表示切替" data-toggle-ad="${ad.id}">${ad.enabled === false ? "S" : "H"}</button>
        <button class="icon-button" title="編集" data-edit-ad="${ad.id}">E</button>
        <button class="icon-button" title="削除" data-delete-ad="${ad.id}">X</button>
      </div>
    </article>`;
  }).join("");

  qsa("[data-toggle-ad]").forEach((button) => button.addEventListener("click", () => toggleAd(button.dataset.toggleAd)));
  qsa("[data-edit-ad]").forEach((button) => button.addEventListener("click", () => editAd(button.dataset.editAd)));
  qsa("[data-delete-ad]").forEach((button) => button.addEventListener("click", () => deleteAd(button.dataset.deleteAd)));
}

function saveAd() {
  const payload = {
    id: editingAdId || crypto.randomUUID(),
    name: els.adNameInput.value.trim(),
    placement: els.adPlacementInput.value,
    size: els.adSizeInput.value,
    code: els.adCodeInput.value.trim(),
    enabled: true
  };

  if (editingAdId) {
    state.ads = state.ads.map((ad) => ad.id === editingAdId ? { ...ad, ...payload, enabled: ad.enabled !== false } : ad);
  } else {
    state.ads.unshift(payload);
  }

  saveState();
  clearAdForm();
  render();
}

function editAd(id) {
  const ad = state.ads.find((item) => item.id === id);
  if (!ad) return;
  editingAdId = id;
  els.adNameInput.value = ad.name;
  els.adPlacementInput.value = ad.placement;
  els.adSizeInput.value = ad.size;
  els.adCodeInput.value = ad.code;
  els.saveAdButton.textContent = "広告を更新";
  switchPanel("ads");
}

function toggleAd(id) {
  state.ads = state.ads.map((ad) => ad.id === id ? { ...ad, enabled: ad.enabled === false } : ad);
  saveState();
  render();
}

function deleteAd(id) {
  state.ads = state.ads.filter((ad) => ad.id !== id);
  saveState();
  render();
}

function clearAdForm() {
  editingAdId = null;
  els.adForm.reset();
  els.adPlacementInput.value = "sidebar";
  els.adSizeInput.value = "responsive";
  els.saveAdButton.textContent = "広告を保存";
}

function placementName(value) {
  return {
    top: "記事一覧の上",
    middle: "記事一覧の途中",
    bottom: "記事一覧の下",
    sidebar: "サイドバー"
  }[value] || value;
}

function renderStats() {
  els.statArticles.textContent = state.articles.length;
  els.statSites.textContent = new Set(state.articles.map((article) => article.site).filter(Boolean)).size;
  els.statCats.textContent = getCategories().length;
}

function renderCategoryDatalist() {
  els.categoryList.innerHTML = getCategories().map((cat) => `<option value="${escapeAttr(cat)}"></option>`).join("");
}

function saveArticle() {
  const now = new Date().toISOString();
  const url = normalizeUrl(els.urlInput.value.trim());
  const payload = {
    id: editingId || crypto.randomUUID(),
    url,
    title: els.titleInput.value.trim(),
    site: els.siteInput.value.trim() || getHost(url),
    category: els.categoryInput.value.trim() || "総合",
    description: els.descriptionInput.value.trim(),
    image: els.imageInput.value.trim(),
    rank: Number(els.rankInput.value),
    createdAt: editingId
      ? state.articles.find((article) => article.id === editingId)?.createdAt || now
      : now
  };

  if (editingId) {
    state.articles = state.articles.map((article) => article.id === editingId ? payload : article);
  } else {
    state.articles.unshift(payload);
  }

  saveState();
  clearArticleForm();
  render();
}

function editArticle(id) {
  const article = state.articles.find((item) => item.id === id);
  if (!article) return;
  editingId = id;
  els.urlInput.value = article.url;
  els.titleInput.value = article.title;
  els.siteInput.value = article.site;
  els.categoryInput.value = article.category;
  els.descriptionInput.value = article.description;
  els.imageInput.value = article.image;
  els.rankInput.value = article.rank;
  els.saveButton.textContent = "編集を保存";
  switchPanel("dashboard");
}

function deleteArticle(id) {
  state.articles = state.articles.filter((article) => article.id !== id);
  saveState();
  render();
}

function clearSourceForm() {
  els.sourceForm.reset();
  pendingCandidates = [];
  els.sourceStatus.textContent = "URLを入れると、同じサイト内の記事リンク候補を抽出します。";
  renderCandidateList();
}

function clearArticleForm() {
  editingId = null;
  els.articleForm.reset();
  els.rankInput.value = "1";
  els.saveButton.textContent = "記事を保存";
  els.fetchStatus.textContent = "URL取得は相手サイトの設定で失敗する場合があります。その時は手入力してください。";
}

function restoreSamples() {
  state = { templateId: "01", articles: sampleArticles.map((article) => ({ ...article, id: crypto.randomUUID() })), sources: [], ads: sampleAds() };
  selectedCategory = "all";
  pendingCandidates = [];
  applyTemplate("01");
  saveState();
  render();
}

function downloadJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "matome-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function renderExportHtml() {
  els.exportOutput.value = buildStandaloneHtml();
}

async function copyExportHtml() {
  const html = buildStandaloneHtml();
  els.exportOutput.value = html;
  await navigator.clipboard.writeText(html);
  els.copyHtmlButton.textContent = "コピーしました";
  setTimeout(() => {
    els.copyHtmlButton.textContent = "HTMLをコピー";
  }, 1400);
}

function buildStandaloneHtml() {
  const template = templates.find((item) => item.id === state.templateId) || templates[0];
  const items = getSortedArticles().map(renderNewsItem).join("");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Matome Links</title>
  <style>${getStandaloneCss()}</style>
</head>
<body data-template="${state.templateId}">
  <div class="public-site">
    <header class="site-header">
      <div><p class="eyebrow">${escapeHtml(template.name)}</p><h1 class="site-title">Matome Links</h1></div>
    </header>
    <div class="site-body">
      <main class="news-list">${renderAdsByPlacement("top")}${items}${renderAdsByPlacement("bottom")}</main>
    </div>
  </div>
</body>
</html>`;
}

function getStandaloneCss() {
  return `body{margin:0;background:#f5f1e8;font-family:Yu Gothic,Meiryo,sans-serif;color:#181713}.public-site{max-width:1120px;margin:24px auto;background:white;border:1px solid #d8d0bf}.site-header{padding:22px;border-bottom:1px solid currentColor}.eyebrow{margin:0;color:#c71f37;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.site-title{margin:4px 0 0;font-size:48px;line-height:1}.site-body{padding:22px}.news-list{display:grid;gap:10px}.news-item{display:grid;grid-template-columns:110px 1fr;gap:14px;padding:12px;color:inherit;text-decoration:none;border:1px solid currentColor}.news-item img{width:100%;aspect-ratio:16/10;object-fit:cover;background:#eee}.news-item h3{margin:0 0 7px;font-size:17px;line-height:1.45}.news-item p{margin:0 0 8px;opacity:.78;line-height:1.6;font-size:13px}.meta-row{display:flex;flex-wrap:wrap;gap:7px;font-size:12px;opacity:.76}.rank-mark{color:#c71f37;font-weight:900}.ad-slot{display:grid;gap:6px;justify-items:center;margin:0 0 10px;padding:10px;border:1px dashed currentColor}.ad-label{justify-self:start;opacity:.58;font-size:11px;font-weight:800}.ad-box{display:grid;place-items:center;width:min(100%,var(--ad-width,100%));min-height:var(--ad-height,120px);padding:8px;overflow:hidden;background:#fff;border:1px solid rgba(0,0,0,.18);text-align:center}.ad-responsive .ad-box{width:100%;min-height:120px}@media(max-width:560px){.news-item{grid-template-columns:1fr}.site-title{font-size:34px}}`;
}

function getSortedArticles() {
  return [...state.articles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getCategories() {
  return [...new Set(state.articles.map((article) => article.category).filter(Boolean))];
}

function normalizeUrl(value, base) {
  try {
    const raw = value.startsWith("http") ? value : new URL(value, base).href;
    const url = new URL(raw);
    url.hash = "";
    return url.href.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function cleanTitle(title) {
  return String(title).replace(/\s+/g, " ").replace(/^[#\-* ]+/, "").trim();
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

function placeholderImage(category) {
  const label = encodeURIComponent("NEWS");
  return `https://placehold.co/800x500/f2efe6/231f1a?text=${label}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
