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
    swot: document.getElementById("section-swot"),
  };

  function showSection(name) {
    Object.values(sections).forEach((s) => s.classList.remove("active"));
    sections[name]?.classList.add("active");
  }

  document.getElementById("nav-map").addEventListener("click", () => showSection("map"));
  document.getElementById("nav-challenges").addEventListener("click", () => showSection("challenges"));
  document.getElementById("nav-opportunities").addEventListener("click", () => showSection("opportunities"));
  document.getElementById("nav-swot").addEventListener("click", () => showSection("swot"));
}

// ===== MAP INITIALIZATION =====
async function initMap() {
  const mapEl = document.getElementById("mainMap");
  if (!mapEl) return;

  const [Graphic] = await $arcgis.import(["@arcgis/core/Graphic.js"]);

  await mapEl.viewOnReady();

  const points = [
    // King Technology HQ
    {
      lon: -93.4687, lat: 44.9133, type: "hq",
      name: "King Technology HQ",
      desc: "Minnetonka, MN - Headquarters & Manufacturing. Home of FROG, AQUA SMARTE Plus, SANI-KING, and New Water brands. Centrally located for U.S. distribution.",
      color: [0, 160, 223], size: 18,
    },
    // U.S. Competitors
    {
      lon: -80.8431, lat: 35.2271, type: "competitor",
      name: "Hayward Industries",
      desc: "Charlotte, NC - Major U.S. competitor. Full-stack pool equipment + OmniLogic smart automation. Dominant in builder/service channels.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -93.3596, lat: 44.9850, type: "competitor",
      name: "Pentair",
      desc: "Golden Valley, MN - Major U.S. competitor. IntelliConnect smart systems, pumps, filters, heaters. Strong in residential and commercial.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -117.3506, lat: 33.1581, type: "competitor",
      name: "Fluidra (Zodiac U.S.)",
      desc: "Carlsbad, CA - Acquired Zodiac. iAquaLink smart systems, Nature2 mineral (direct FROG competitor). Largest global player with strong U.S. presence.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -83.9958, lat: 33.9519, type: "competitor",
      name: "BioGuard (SCP)",
      desc: "Lawrenceville, GA - Chemical specialist. Part of SCP Distributors (Pool Corp). Deep relationships with U.S. pool service companies.",
      color: [255, 90, 95], size: 12,
    },
    {
      lon: -73.4190, lat: 41.1177, type: "competitor",
      name: "Natural Chemistry",
      desc: "Norwalk, CT - Niche enzyme/natural pool care brand. Competes in the 'green pool care' space alongside FROG.",
      color: [255, 90, 95], size: 11,
    },
    // High-Growth Pool Markets (Sun Belt)
    {
      lon: -81.3792, lat: 28.5383, type: "growth",
      name: "Central Florida",
      desc: "Florida: #1 U.S. pool state with 1.7M+ residential pools. Fastest new construction. Year-round pool use makes it the single most important market for King Technology.",
      color: [0, 196, 154], size: 15,
    },
    {
      lon: -96.7970, lat: 32.7767, type: "growth",
      name: "Dallas-Fort Worth, TX",
      desc: "Texas: #2 U.S. pool state. DFW metro is the top U.S. market for new pool construction. Massive suburban growth driving demand.",
      color: [0, 196, 154], size: 14,
    },
    {
      lon: -111.9261, lat: 33.4484, type: "growth",
      name: "Phoenix, AZ",
      desc: "Arizona: #3 for pool density. Phoenix metro has one of the highest pools-per-household ratios in America. Hot climate = year-round chemical demand.",
      color: [0, 196, 154], size: 14,
    },
    {
      lon: -118.2437, lat: 34.0522, type: "growth",
      name: "Los Angeles, CA",
      desc: "California: 1.8M+ pools statewide. LA metro is the largest single pool market. Strict environmental regs creating demand for mineral/low-chemical alternatives.",
      color: [0, 196, 154], size: 14,
    },
    {
      lon: -84.3880, lat: 33.7490, type: "growth",
      name: "Atlanta, GA",
      desc: "Georgia/Southeast: Rapid suburban growth. Atlanta metro adding 5K+ pools per year. Key battleground for Sun Belt expansion.",
      color: [0, 196, 154], size: 13,
    },
    {
      lon: -80.8431, lat: 26.1224, type: "growth",
      name: "South Florida",
      desc: "Miami-Fort Lauderdale: Luxury pool market with high-end homeowners. Premium pricing opportunity for mineral systems. Year-round use.",
      color: [0, 196, 154], size: 13,
    },
    // Hot Tub / Spa Markets
    {
      lon: -105.7821, lat: 39.5501, type: "hotspot",
      name: "Colorado",
      desc: "Colorado: Top U.S. hot tub market per capita. Mountain resort culture drives premium spa demand. FROG Serene is well positioned here.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -122.3321, lat: 47.6062, type: "hotspot",
      name: "Seattle, WA",
      desc: "Pacific Northwest: Strong hot tub culture due to cool climate. Health-conscious consumer base aligned with mineral sanitization messaging.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -72.6735, lat: 41.7658, type: "hotspot",
      name: "Connecticut / Northeast",
      desc: "Northeast U.S.: Seasonal hot tub market with affluent demographics. High willingness to pay for premium, low-chemical solutions.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -89.4012, lat: 43.0731, type: "hotspot",
      name: "Wisconsin / Upper Midwest",
      desc: "Upper Midwest: King Technology's home territory. Strong dealer loyalty and brand awareness. Cold climate drives hot tub adoption.",
      color: [245, 166, 35], size: 12,
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
        outline: { color: [...pt.color, 0.4], width: pt.size * 0.5 },
      },
      attributes: { name: pt.name, description: pt.desc, type: pt.type },
      popupTemplate: { title: "{name}", content: "{description}" },
    }));
  });

  // Connection lines from HQ to key markets
  const hq = [-93.4687, 44.9133];
  const connections = [
    // To competitors (red dashed)
    { to: [-80.8431, 35.2271], color: [255, 90, 95, 0.25] },
    { to: [-93.3596, 44.9850], color: [255, 90, 95, 0.25] },
    { to: [-117.3506, 33.1581], color: [255, 90, 95, 0.25] },
    { to: [-83.9958, 33.9519], color: [255, 90, 95, 0.25] },
    // To high-growth markets (green dashed)
    { to: [-81.3792, 28.5383], color: [0, 196, 154, 0.2] },
    { to: [-96.7970, 32.7767], color: [0, 196, 154, 0.2] },
    { to: [-111.9261, 33.4484], color: [0, 196, 154, 0.2] },
    { to: [-118.2437, 34.0522], color: [0, 196, 154, 0.2] },
    { to: [-84.3880, 33.7490], color: [0, 196, 154, 0.2] },
  ];

  connections.forEach((conn) => {
    allGraphics.push(new Graphic({
      geometry: { type: "polyline", paths: [[hq, conn.to]] },
      symbol: { type: "simple-line", color: conn.color, width: 1.2, style: "dash" },
    }));
  });

  mapEl.graphics.addMany(allGraphics);
  mapEl.goTo({ center: [-96, 38], zoom: 4 }, { duration: 2000 });
}

// Start the app
init();
