// ===== WAIT FOR CALCITE COMPONENTS =====
async function init() {
  await Promise.all([
    customElements.whenDefined("calcite-input-text"),
    customElements.whenDefined("calcite-button"),
    customElements.whenDefined("calcite-shell"),
  ]);

  // ===== AUTHENTICATION =====
  const VALID_USER = "portaladmin";
  const VALID_PASS = "king";

  const loginOverlay = document.getElementById("login-overlay");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");
  const loginUser = document.getElementById("login-user");
  const loginPass = document.getElementById("login-pass");
  const app = document.getElementById("app");

  function attemptLogin() {
    const user = (loginUser.value || "").trim();
    const pass = loginPass.value || "";

    if (user === VALID_USER && pass === VALID_PASS) {
      loginOverlay.style.transition = "opacity 0.5s ease";
      loginOverlay.style.opacity = "0";
      setTimeout(() => {
        loginOverlay.style.display = "none";
        app.style.display = "";
        initMap();
      }, 500);
    } else {
      loginError.style.display = "block";
      loginPass.value = "";
    }
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    attemptLogin();
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    attemptLogin();
  });

  document.getElementById("login-form").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attemptLogin();
    }
  });

  // ===== SIGN OUT =====
  document.getElementById("nav-signout").addEventListener("click", () => {
    app.style.display = "none";
    loginOverlay.style.display = "flex";
    loginOverlay.style.opacity = "1";
    loginUser.value = "";
    loginPass.value = "";
    loginError.style.display = "none";
  });

  // ===== SECTION NAVIGATION =====
  const sections = {
    map: document.getElementById("section-map"),
    challenges: document.getElementById("section-challenges"),
    opportunities: document.getElementById("section-opportunities"),
  };

  function showSection(name) {
    Object.values(sections).forEach((s) => s.classList.remove("active"));
    sections[name]?.classList.add("active");
  }

  document.getElementById("nav-map").addEventListener("click", () => showSection("map"));
  document.getElementById("nav-challenges").addEventListener("click", () => showSection("challenges"));
  document.getElementById("nav-opportunities").addEventListener("click", () => showSection("opportunities"));
}

// ===== MAP INITIALIZATION =====
async function initMap() {
  const mapEl = document.getElementById("mainMap");
  if (!mapEl) return;

  const [Graphic] = await $arcgis.import(["@arcgis/core/Graphic.js"]);

  await mapEl.viewOnReady();

  const points = [
    {
      lon: -93.4687, lat: 44.9133, type: "hq",
      name: "King Technology HQ",
      desc: "Minnetonka, MN - Headquarters & Manufacturing. Maker of FROG, AQUA SMARTE Plus, SANI-KING, and New Water brands.",
      color: [0, 160, 223], size: 16,
    },
    {
      lon: -80.8431, lat: 35.2271, type: "competitor",
      name: "Hayward Industries",
      desc: "Charlotte, NC - 12% global market share. Full-stack pool equipment: pumps, heaters, automation, chemicals.",
      color: [255, 90, 95], size: 13,
    },
    {
      lon: -0.1276, lat: 51.5074, type: "competitor",
      name: "Pentair PLC",
      desc: "London, UK - 11% global market share. Water treatment, flow control, smart pool systems.",
      color: [255, 90, 95], size: 13,
    },
    {
      lon: 2.1734, lat: 41.3851, type: "competitor",
      name: "Fluidra S.A.",
      desc: "Barcelona, Spain - 15% global market share (largest). Pool & wellness equipment, smart automation.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: 151.2093, lat: -33.8688, type: "growth",
      name: "Australia (APAC)",
      desc: "Asia-Pacific: Fastest-growing region at 9.5% CAGR. Strong pool culture, rising demand for mineral sanitization.",
      color: [0, 196, 154], size: 12,
    },
    {
      lon: 121.4737, lat: 31.2304, type: "growth",
      name: "China (APAC)",
      desc: "Growing middle class driving luxury pool & spa adoption. Massive untapped market for premium water care.",
      color: [0, 196, 154], size: 12,
    },
    {
      lon: 103.8198, lat: 1.3521, type: "growth",
      name: "Singapore (APAC)",
      desc: "Southeast Asia hub. Premium hospitality sector driving commercial pool demand for alternative sanitization.",
      color: [0, 196, 154], size: 12,
    },
    {
      lon: 139.6917, lat: 35.6895, type: "growth",
      name: "Japan (APAC)",
      desc: "Wellness-oriented culture aligns with FROG's low-chemical value proposition. Growing spa market.",
      color: [0, 196, 154], size: 12,
    },
  ];

  const allGraphics = [];

  points.forEach((pt) => {
    allGraphics.push(new Graphic({
      geometry: { type: "point", longitude: pt.lon, latitude: pt.lat },
      symbol: {
        type: "simple-marker",
        color: [...pt.color, 0.85],
        size: pt.size,
        outline: { color: [...pt.color, 0.4], width: pt.size * 0.6 },
      },
      attributes: { name: pt.name, description: pt.desc, type: pt.type },
      popupTemplate: { title: "{name}", content: "{description}" },
    }));
  });

  const hq = [-93.4687, 44.9133];
  const connections = [
    { to: [-80.8431, 35.2271], color: [255, 90, 95, 0.3] },
    { to: [-0.1276, 51.5074], color: [255, 90, 95, 0.3] },
    { to: [2.1734, 41.3851], color: [255, 90, 95, 0.3] },
    { to: [151.2093, -33.8688], color: [0, 196, 154, 0.25] },
    { to: [121.4737, 31.2304], color: [0, 196, 154, 0.25] },
    { to: [103.8198, 1.3521], color: [0, 196, 154, 0.25] },
    { to: [139.6917, 35.6895], color: [0, 196, 154, 0.25] },
  ];

  connections.forEach((conn) => {
    allGraphics.push(new Graphic({
      geometry: { type: "polyline", paths: [[hq, conn.to]] },
      symbol: { type: "simple-line", color: conn.color, width: 1.5, style: "dash" },
    }));
  });

  mapEl.graphics.addMany(allGraphics);
  mapEl.goTo({ center: [-20, 30], zoom: 2 }, { duration: 2000 });
}

// Start the app
init();
