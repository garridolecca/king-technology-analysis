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
    challenges: document.getElementById("section-challenges"),
    opportunities: document.getElementById("section-opportunities"),
    map: document.getElementById("section-map"),
    swot: document.getElementById("section-swot"),
  };

  function showSection(name) {
    Object.values(sections).forEach((s) => s.classList.remove("active"));
    sections[name]?.classList.add("active");
  }

  document.getElementById("nav-challenges").addEventListener("click", () => showSection("challenges"));
  document.getElementById("nav-opportunities").addEventListener("click", () => showSection("opportunities"));
  document.getElementById("nav-map").addEventListener("click", () => showSection("map"));
  document.getElementById("nav-swot").addEventListener("click", () => showSection("swot"));
}

// ===== MAP INITIALIZATION =====
async function initMap() {
  const mapEl = document.getElementById("mainMap");
  if (!mapEl) return;

  const [Graphic] = await $arcgis.import(["@arcgis/core/Graphic.js"]);

  await mapEl.viewOnReady();

  const points = [
    // ========== KING TECHNOLOGY HQ ==========
    {
      lon: -93.4687, lat: 44.9133, type: "hq",
      name: "King Technology HQ",
      desc: "Minnetonka, MN — Headquarters & Manufacturing. Home of FROG, AQUA SMARTE Plus, SANI-KING, and New Water. Centrally located for U.S. distribution.",
      color: [0, 160, 223], size: 20,
    },

    // ========== U.S. COMPETITORS (red) ==========
    {
      lon: -80.8431, lat: 35.2271, type: "competitor",
      name: "Hayward Industries HQ",
      desc: "Charlotte, NC — Major competitor. OmniLogic smart automation, VS pumps, pool heaters. Dominant in builder/service channels. ~12% global share.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -93.3796, lat: 45.0080, type: "competitor",
      name: "Pentair HQ",
      desc: "Golden Valley, MN — Just 5 miles from King Technology! IntelliConnect smart systems, pumps, filters, heaters. Strong residential and commercial presence. ~11% global share.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -117.3506, lat: 33.1581, type: "competitor",
      name: "Fluidra / Zodiac U.S. HQ",
      desc: "Carlsbad, CA — Acquired Zodiac. iAquaLink smart systems, Nature2 mineral sanitizer (direct FROG competitor). Largest global pool company. ~15% global share.",
      color: [255, 90, 95], size: 14,
    },
    {
      lon: -83.9958, lat: 33.9519, type: "competitor",
      name: "BioGuard / SCP Distributors",
      desc: "Lawrenceville, GA — Chemical specialist under Pool Corporation. Deep relationships with U.S. pool service companies. Dominates chemical distribution.",
      color: [255, 90, 95], size: 12,
    },
    {
      lon: -73.4190, lat: 41.1177, type: "competitor",
      name: "Natural Chemistry",
      desc: "Norwalk, CT — Niche enzyme & natural pool care brand. Competes directly in the 'green pool care' space alongside FROG.",
      color: [255, 90, 95], size: 11,
    },
    {
      lon: -95.3698, lat: 29.7604, type: "competitor",
      name: "Clorox Pool & Spa",
      desc: "Houston, TX (distribution hub) — Clorox dominates big-box retail shelves at Home Depot and Lowe's. Biggest mass-market competitor for consumer mindshare.",
      color: [255, 90, 95], size: 13,
    },
    {
      lon: -87.6298, lat: 41.8781, type: "competitor",
      name: "HTH / Lonza (Arch Chemicals)",
      desc: "Chicago area distribution — HTH is the #2 retail pool chemical brand. Strong at Walmart, Home Depot, Lowe's. Key competitor for consumer shelf space.",
      color: [255, 90, 95], size: 12,
    },

    // ========== HIGH-GROWTH POOL MARKETS (green) ==========
    {
      lon: -81.3792, lat: 28.5383, type: "growth",
      name: "Central Florida (Orlando)",
      desc: "Florida: #1 U.S. pool state — 1.7M+ residential pools. Fastest new construction. Year-round use. Largest pool service industry. THE most important market for King Technology.",
      color: [0, 196, 154], size: 16,
    },
    {
      lon: -96.7970, lat: 32.7767, type: "growth",
      name: "Dallas-Fort Worth, TX",
      desc: "Texas: #2 pool state. DFW is the #1 U.S. metro for new pool construction. Massive suburban sprawl, 300+ days of sun. High pool-per-household ratio.",
      color: [0, 196, 154], size: 15,
    },
    {
      lon: -111.9261, lat: 33.4484, type: "growth",
      name: "Phoenix Metro, AZ",
      desc: "Arizona: #3 for pool density. Phoenix has one of the highest pools-per-household ratios in the country. Year-round chemical demand. Drought regs pushing low-chemical solutions.",
      color: [0, 196, 154], size: 15,
    },
    {
      lon: -118.2437, lat: 34.0522, type: "growth",
      name: "Los Angeles Metro, CA",
      desc: "California: 1.8M+ pools statewide. LA is the single largest pool market. Strict EPA/CARB environmental regs creating demand for mineral and low-chemical alternatives.",
      color: [0, 196, 154], size: 15,
    },
    {
      lon: -84.3880, lat: 33.7490, type: "growth",
      name: "Atlanta Metro, GA",
      desc: "Georgia/Southeast: Rapid suburban growth. 5K+ new pools/year. Key Sun Belt battleground. Growing builder and service channel.",
      color: [0, 196, 154], size: 13,
    },
    {
      lon: -80.1918, lat: 25.7617, type: "growth",
      name: "South Florida (Miami)",
      desc: "Miami-Fort Lauderdale-Palm Beach: Luxury pool market. High-end homes, year-round use. Premium pricing opportunity for mineral systems.",
      color: [0, 196, 154], size: 14,
    },
    {
      lon: -97.7431, lat: 30.2672, type: "growth",
      name: "Austin, TX",
      desc: "Austin: Fastest-growing large U.S. city. Young, health-conscious demographic. New home construction boom with pools standard. Ideal FROG customer profile.",
      color: [0, 196, 154], size: 13,
    },
    {
      lon: -115.1398, lat: 36.1699, type: "growth",
      name: "Las Vegas, NV",
      desc: "Las Vegas: Top pool market per capita. Resort-style living. 330+ days of sun. Growing residential + massive commercial hotel pool demand.",
      color: [0, 196, 154], size: 13,
    },
    {
      lon: -81.6557, lat: 30.3322, type: "growth",
      name: "Jacksonville, FL",
      desc: "Northeast Florida: One of the fastest-growing metros. New construction boom. Year-round pool use. Untapped for FROG dealer expansion.",
      color: [0, 196, 154], size: 12,
    },
    {
      lon: -98.4936, lat: 29.4241, type: "growth",
      name: "San Antonio, TX",
      desc: "San Antonio: 7th largest U.S. city, fast-growing suburbs. Military bases with community pools. Builder channel opportunity.",
      color: [0, 196, 154], size: 12,
    },
    {
      lon: -82.4572, lat: 27.9506, type: "growth",
      name: "Tampa Bay, FL",
      desc: "Tampa-St. Pete: Booming population growth. Major pool construction market. Service companies seeking differentiated chemical products.",
      color: [0, 196, 154], size: 13,
    },

    // ========== HOT TUB / SPA MARKETS (gold) ==========
    {
      lon: -105.2705, lat: 40.0150, type: "hotspot",
      name: "Colorado Front Range",
      desc: "Colorado: #1 hot tub state per capita. Mountain resort culture (Vail, Aspen, Breckenridge). FROG Serene is perfectly positioned for this market.",
      color: [245, 166, 35], size: 13,
    },
    {
      lon: -122.3321, lat: 47.6062, type: "hotspot",
      name: "Seattle / Pacific NW",
      desc: "Pacific Northwest: Strong hot tub culture — cool, rainy climate. Health-conscious, eco-aware consumers align perfectly with mineral sanitization.",
      color: [245, 166, 35], size: 13,
    },
    {
      lon: -72.6735, lat: 41.7658, type: "hotspot",
      name: "Connecticut / Northeast",
      desc: "Northeast: Affluent seasonal hot tub market. Willingness to pay premium for low-chemical, skin-friendly solutions. Key for FROG Serene growth.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -89.4012, lat: 43.0731, type: "hotspot",
      name: "Wisconsin / Upper Midwest",
      desc: "King Technology home territory. Strongest dealer loyalty and brand awareness. Cold climate = high hot tub adoption. Defend and expand.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -122.6765, lat: 45.5152, type: "hotspot",
      name: "Portland, OR",
      desc: "Oregon: Eco-conscious market with high hot tub density. 'Clean living' culture makes it ideal for FROG's low-chemical message.",
      color: [245, 166, 35], size: 11,
    },
    {
      lon: -93.0900, lat: 44.9537, type: "hotspot",
      name: "Minneapolis-St. Paul, MN",
      desc: "Twin Cities: King Technology's backyard. Strong local brand awareness. High hot tub penetration due to cold winters. Reference market.",
      color: [245, 166, 35], size: 12,
    },
    {
      lon: -71.0589, lat: 42.3601, type: "hotspot",
      name: "Boston Metro, MA",
      desc: "New England: Affluent suburbs with high hot tub ownership. Health & wellness focus. Premium pricing opportunity for FROG Serene.",
      color: [245, 166, 35], size: 11,
    },

    // ========== MAJOR DISTRIBUTORS (purple) ==========
    {
      lon: -90.0715, lat: 29.9511, type: "distributor",
      name: "Pool Corporation HQ (PoolCorp)",
      desc: "Covington, LA — World's largest pool supply distributor. 420+ locations across the U.S. Controls the wholesale supply chain. Key gatekeeper for King Technology's dealer strategy.",
      color: [162, 155, 254], size: 14,
    },
    {
      lon: -81.0912, lat: 29.2108, type: "distributor",
      name: "SCP Distributors (Pool Corp)",
      desc: "Daytona Beach, FL — SCP is Pool Corp's primary distribution brand. Dominates Florida dealer supply. Critical relationship for Sun Belt expansion.",
      color: [162, 155, 254], size: 12,
    },
    {
      lon: -117.1611, lat: 32.7157, type: "distributor",
      name: "Superior Pool Products",
      desc: "San Diego, CA — Major West Coast distributor. Key channel for California and Southwest markets. Part of Pool Corp network.",
      color: [162, 155, 254], size: 11,
    },
    {
      lon: -86.1581, lat: 39.7684, type: "distributor",
      name: "Recreational Wholesalers / Midwest Hub",
      desc: "Indianapolis, IN — Central U.S. distribution hub. Key logistics corridor for Midwest and Eastern seaboard dealer supply.",
      color: [162, 155, 254], size: 11,
    },

    // ========== COMMERCIAL / HOTEL CORRIDORS (pink) ==========
    {
      lon: -115.3150, lat: 36.0800, type: "commercial",
      name: "Las Vegas Strip / Resort Corridor",
      desc: "Las Vegas hotels operate 1,000+ commercial pools. Massive chemical consumption. Mineral systems could reduce costs and liability. Marquee reference opportunity.",
      color: [253, 121, 168], size: 14,
    },
    {
      lon: -81.5090, lat: 28.3852, type: "commercial",
      name: "Orlando Resort Corridor",
      desc: "Walt Disney World, Universal, 500+ hotels with pools. Largest concentration of commercial pools in the U.S. Huge opportunity for commercial-grade FROG.",
      color: [253, 121, 168], size: 14,
    },
    {
      lon: -80.1300, lat: 26.1003, type: "commercial",
      name: "South Florida Hotel & HOA Belt",
      desc: "Fort Lauderdale to Palm Beach: Dense concentration of resort hotels, condo HOAs, and community pools. Premium commercial market for mineral sanitization.",
      color: [253, 121, 168], size: 13,
    },
    {
      lon: -105.9378, lat: 35.6870, type: "commercial",
      name: "Santa Fe / NM Resort Market",
      desc: "New Mexico resort and spa market. Boutique hotels and wellness resorts seeking chemical-free pool solutions. Growing eco-tourism destination.",
      color: [253, 121, 168], size: 10,
    },
    {
      lon: -110.9747, lat: 32.2226, type: "commercial",
      name: "Tucson / AZ Resort Corridor",
      desc: "Southern Arizona resort corridor. Luxury spa resorts (Canyon Ranch, Miraval) seeking mineral sanitization for wellness branding.",
      color: [253, 121, 168], size: 11,
    },
    {
      lon: -157.8583, lat: 21.3069, type: "commercial",
      name: "Hawaii Resort Market",
      desc: "Honolulu / Maui: Premium resort market. Environmental sensitivity to chemicals in ocean-adjacent pools. Strong fit for mineral systems.",
      color: [253, 121, 168], size: 12,
    },
    {
      lon: -80.8431, lat: 32.7765, type: "commercial",
      name: "Charleston / Hilton Head, SC",
      desc: "Lowcountry resort corridor. Boutique hotels, luxury resorts, and gated communities. Growing premium pool market in the Southeast.",
      color: [253, 121, 168], size: 10,
    },
    {
      lon: -117.1611, lat: 33.4936, type: "commercial",
      name: "San Diego Hotel & Resort Market",
      desc: "San Diego: Major hotel/resort market. Strict California EPA regs favoring low-chemical solutions. Commercial FROG opportunity.",
      color: [253, 121, 168], size: 11,
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
        outline: { color: [...pt.color, 0.35], width: pt.size * 0.45 },
      },
      attributes: { name: pt.name, description: pt.desc, type: pt.type },
      popupTemplate: { title: "{name}", content: "{description}" },
    }));
  });

  // Connection lines from HQ to key strategic targets
  const hq = [-93.4687, 44.9133];
  const connections = [
    // To competitors (red)
    { to: [-80.8431, 35.2271], color: [255, 90, 95, 0.2] },
    { to: [-117.3506, 33.1581], color: [255, 90, 95, 0.2] },
    { to: [-83.9958, 33.9519], color: [255, 90, 95, 0.2] },
    { to: [-95.3698, 29.7604], color: [255, 90, 95, 0.2] },
    // To high-growth Sun Belt markets (green)
    { to: [-81.3792, 28.5383], color: [0, 196, 154, 0.2] },
    { to: [-96.7970, 32.7767], color: [0, 196, 154, 0.2] },
    { to: [-111.9261, 33.4484], color: [0, 196, 154, 0.2] },
    { to: [-118.2437, 34.0522], color: [0, 196, 154, 0.2] },
    { to: [-115.1398, 36.1699], color: [0, 196, 154, 0.2] },
    // To key distributors (purple)
    { to: [-90.0715, 29.9511], color: [162, 155, 254, 0.2] },
    // To commercial corridors (pink)
    { to: [-115.3150, 36.0800], color: [253, 121, 168, 0.15] },
    { to: [-81.5090, 28.3852], color: [253, 121, 168, 0.15] },
  ];

  connections.forEach((conn) => {
    allGraphics.push(new Graphic({
      geometry: { type: "polyline", paths: [[hq, conn.to]] },
      symbol: { type: "simple-line", color: conn.color, width: 1.2, style: "dash" },
    }));
  });

  mapEl.graphics.addMany(allGraphics);
  mapEl.goTo({ center: [-96, 37], zoom: 4 }, { duration: 2000 });
}

// Start the app
init();
