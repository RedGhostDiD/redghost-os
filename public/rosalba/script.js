/* ==========================================================
   Un jardín para Rosalba 🌸
   La programación es el detalle. Las flores son el regalo.
   La amistad es el mensaje.
   ========================================================== */
(() => {
  'use strict';

  /* ===================== Utilidades ===================== */
  const $ = (s) => document.querySelector(s);
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const ease = {
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };
  const reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const show = (el) => el.classList.add('show');

  /* ===================== Reloj de la historia =====================
     Toda la secuencia corre sobre este reloj (avanza con requestAnimationFrame),
     así que si la pestaña se oculta, la historia se pausa en vez de desincronizarse. */
  const clock = { t: 0, timers: [], tweens: [] };
  const wait = (ms) => new Promise((res) => clock.timers.push({ at: clock.t + ms, res }));
  const tween = (ms, fn, easing = (x) => x) =>
    new Promise((res) => clock.tweens.push({ start: clock.t, ms, fn, easing, res }));

  function tickClock(dtMs) {
    clock.t += dtMs;
    for (let i = clock.tweens.length - 1; i >= 0; i--) {
      const tw = clock.tweens[i];
      const p = clamp((clock.t - tw.start) / tw.ms, 0, 1);
      tw.fn(tw.easing(p));
      if (p >= 1) { clock.tweens.splice(i, 1); tw.res(); }
    }
    for (let i = clock.timers.length - 1; i >= 0; i--) {
      if (clock.timers[i].at <= clock.t) clock.timers.splice(i, 1)[0].res();
    }
  }

  /* ===================== DOM ===================== */
  const canvas = $('#garden');
  const ctx = canvas.getContext('2d');
  const termEl = $('#term');
  const termLines = $('#termLines');
  const dedicationEl = $('#dedication');
  const codeLineEl = $('#codeLine');
  const titleEl = $('#title');
  const subtitleEl = $('#subtitle');
  const bloomCodeEl = $('#bloomCode');
  const finaleEl = $('#finale');
  const cardLogEl = $('#cardLog');
  const cardTitleEl = $('#cardTitle');
  const cardMsgEl = $('#cardMsg');
  const cardNoteEl = $('#cardNote');
  const hintEl = $('#hint');
  const levelEl = $('#level');
  const levelNumEl = $('#levelNum');
  const replayBtn = $('#replay');
  const soundBtn = $('#soundBtn');

  /* ===================== Mini "resaltador" de código ===================== */
  function tokenize(src) {
    const re = /(\/\/.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|\b(const|let|new|while|true|false|return)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"'])/gmu;
    const out = [];
    let m;
    while ((m = re.exec(src))) {
      const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : m[5] ? 'f' : m[6] ? 'v' : m[7] ? '' : 'p';
      out.push([m[0], cls]);
    }
    return out;
  }

  function renderSegs(el, segs) {
    el.textContent = '';
    for (const [text, cls] of segs) {
      const s = document.createElement('span');
      if (cls) s.className = cls;
      s.textContent = text;
      el.appendChild(s);
    }
  }

  // Escribe segmentos [texto, clase] letra por letra, sobre el reloj de la historia
  function typeSegs(el, segs, speed = 30) {
    const parts = segs.map(([text, cls]) => {
      const s = document.createElement('span');
      if (cls) s.className = cls;
      el.appendChild(s);
      return { s, chars: Array.from(text) };
    });
    const total = parts.reduce((a, p) => a + p.chars.length, 0);
    let shown = 0;
    el.classList.add('typing');
    return tween(Math.max(1, total * speed), (e) => {
      const n = Math.round(e * total);
      if (n === shown) return;
      if (speed >= 20) sound.tick();
      shown = n;
      let left = n;
      for (const p of parts) {
        const k = Math.min(left, p.chars.length);
        p.s.textContent = p.chars.slice(0, k).join('');
        left -= k;
      }
    }).then(() => el.classList.remove('typing'));
  }

  /* ---------- Consola ---------- */
  function termLine(cls = '') {
    const d = document.createElement('div');
    d.className = `line ${cls}`.trim();
    termLines.appendChild(d);
    while (termLines.children.length > 14) termLines.firstChild.remove();
    return d;
  }
  async function say(text, speed = 32) {
    const l = termLine();
    await typeSegs(l, [['> ', 'prompt'], [text, '']], speed);
    return l;
  }
  async function code(text, speed = 30) {
    const l = termLine();
    await typeSegs(l, [['> ', 'prompt'], ...tokenize(text)], speed);
    return l;
  }
  function done(l, text = ' ✓') {
    const s = document.createElement('span');
    s.className = 'ok';
    s.textContent = text;
    l.appendChild(s);
    sound.tick(1.6);
  }

  /* ===================== Colores ===================== */
  const PALETTES = {
    rosa:     { petal: '#ff9ec4', light: '#ffd6e7', deep: '#ff6fa5', center: '#ffd84d', centerDark: '#f2a93b', glow: 'rgba(255,140,190,.9)' },
    amarillo: { petal: '#ffd84d', light: '#fff3b0', deep: '#ffb627', center: '#ff9f45', centerDark: '#d9771f', glow: 'rgba(255,210,80,.85)' },
    naranja:  { petal: '#ffa45c', light: '#ffd4ae', deep: '#ff8030', center: '#fff0a6', centerDark: '#e0a030', glow: 'rgba(255,160,90,.85)' },
    rojo:     { petal: '#ff7b8a', light: '#ffc0c8', deep: '#f0566a', center: '#ffe07a', centerDark: '#e8a93a', glow: 'rgba(255,110,130,.85)' },
    lila:     { petal: '#c9a4ff', light: '#ebdcff', deep: '#a77cf2', center: '#ffe07a', centerDark: '#e8a93a', glow: 'rgba(190,150,255,.9)' },
    azul:     { petal: '#8ec5ff', light: '#d3e9ff', deep: '#5ea8f5', center: '#fff1a6', centerDark: '#f2c14b', glow: 'rgba(130,190,255,.9)' },
    blanco:   { petal: '#fffaf7', light: '#ffffff', deep: '#efd3e3', center: '#ffd84d', centerDark: '#f2a93b', glow: 'rgba(255,255,255,.8)' },
  };
  const PAL_LIST = Object.values(PALETTES);
  const COLOR_EN = { rosa: 'pink', amarillo: 'yellow', naranja: 'orange', rojo: 'red', lila: 'lilac', azul: 'blue', blanco: 'white' };

  const TYPES = {
    redonda:   { colors: ['rosa', 'amarillo', 'azul', 'lila', 'naranja', 'rojo'] },
    margarita: { colors: ['blanco', 'amarillo', 'lila', 'rosa'] },
    sakura:    { colors: ['rosa', 'blanco', 'lila'] },
    tulipan:   { colors: ['rojo', 'naranja', 'rosa', 'amarillo'] },
    dalia:     { colors: ['rosa', 'lila', 'naranja', 'azul', 'rojo'] },
  };

  // brillo blanco de cada pétalo: [x, y, rx, ry, rot]
  const GLINT = {
    redonda:   [-0.12, -0.66, 0.07, 0.15, -0.3],
    margarita: [0, -0.72, 0.035, 0.16, 0],
    sakura:    [-0.14, -0.6, 0.06, 0.17, -0.35],
    dalia:     [-0.04, -0.55, 0.035, 0.18, 0],
  };

  const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const SEED_MS = 650;

  /* ===================== Chispitas (sprites pre-renderizados) ===================== */
  const SPARK_RGB = [[255, 143, 184], [255, 210, 80], [140, 200, 255], [196, 155, 255], [130, 235, 160], [255, 164, 92]];
  const SPRITE_OF = { rosa: 0, rojo: 0, amarillo: 1, azul: 2, lila: 3, blanco: 4, naranja: 5 };
  const GLYPHS = '01{}<>;=+*/()[]'.split('');

  function makeSprite([r, g, b]) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const rg = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.18, `rgba(${r},${g},${b},.95)`);
    rg.addColorStop(0.45, `rgba(${r},${g},${b},.3)`);
    rg.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = rg;
    x.fillRect(0, 0, 64, 64);
    x.globalAlpha = 0.85;
    x.fillStyle = '#fff';
    x.beginPath();
    x.moveTo(32, 5);
    x.quadraticCurveTo(34, 30, 59, 32);
    x.quadraticCurveTo(34, 34, 32, 59);
    x.quadraticCurveTo(30, 34, 5, 32);
    x.quadraticCurveTo(30, 30, 32, 5);
    x.fill();
    return c;
  }
  const sprites = SPARK_RGB.map(makeSprite);

  /* ===================== Mundo ===================== */
  let W = 0, H = 0, DPR = 1, S = 1;
  let friendship = 100;

  const world = {
    wind: 0, windTarget: 0,
    ground: 0, grassGrow: 0, flash: 0,
    interactive: false,
    idle: false, idleNext: 0,
    rainUntil: 0,
    flowers: [], petals: [], sparks: [], ambient: [], grass: [], texts: [],
  };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    S = clamp(Math.min(W, H) / 800, 0.55, 1.3);
    buildGrass();
  }

  const headBase = () => clamp(Math.min(W, H) * 0.068, 24, 58);

  // partículas digitales de fondo: destellos y simbolitos de código
  function initAmbient() {
    const n = Math.round(clamp((W * H) / 24000, 24, 60) * (reduceMotion ? 0.5 : 1));
    world.ambient = Array.from({ length: n }, () => {
      const ci = (Math.random() * SPARK_RGB.length) | 0;
      return {
        x: rand(0, W), y: rand(0, H),
        vx: rand(-6, 6), vy: rand(-18, -6),
        size: rand(8, 20), ph: rand(0, TAU), sp: rand(0.8, 2.2),
        spr: sprites[ci],
        glyph: Math.random() < 0.4 ? pick(GLYPHS) : null,
        rgb: SPARK_RGB[ci].join(','),
      };
    });
  }

  function buildGrass() {
    const n = Math.round(clamp(W / 5, 70, 300));
    world.grass = Array.from({ length: n }, (_, i) => ({
      x: (i + Math.random()) / n, h: rand(0.45, 1), lean: rand(-6, 6), ph: rand(0, TAU), g: i % 3,
    }));
  }

  /* ===================== Flores ===================== */
  function makeLeaves() {
    const leaves = [
      { t: rand(0.18, 0.3), side: 1, s: rand(0.85, 1.1) },
      { t: rand(0.38, 0.52), side: -1, s: rand(0.75, 1) },
    ];
    if (Math.random() < 0.4) leaves.push({ t: rand(0.58, 0.66), side: 1, s: rand(0.55, 0.75) });
    if (Math.random() < 0.5) leaves.forEach((l) => (l.side *= -1));
    return leaves;
  }

  function petalCount(type) {
    switch (type) {
      case 'margarita': return (rand(11, 16) | 0);
      case 'dalia': return (rand(10, 14) | 0);
      case 'redonda': return Math.random() < 0.5 ? 5 : 6;
      case 'sakura': return 5;
      default: return 3;
    }
  }

  function createFlowers() {
    const n = clamp(Math.round(W / 90), 7, 16);
    const types = [];
    while (types.length < n) types.push(...shuffle(Object.keys(TYPES)));
    const short = H < 560 ? 0.85 : 1;
    const flowers = [];
    let prev = '';

    for (let i = 0; i < n; i++) {
      const type = types[i];
      const T = TYPES[type];
      let key = pick(T.colors);
      if (key === prev) key = pick(T.colors);
      prev = key;
      const back = i % 2 === 1; // fila de atrás: más altas y pequeñas

      flowers.push({
        type, key,
        pal: PALETTES[key],
        spr: sprites[SPRITE_OF[key]],
        n: petalCount(type),
        fx: clamp((i + 0.5) / n + rand(-0.28, 0.28) / n, 0.03, 0.97),
        depth: back ? rand(0.55, 0.72) : rand(0.85, 1),
        hf: (back ? rand(0.4, 0.53) : rand(0.26, 0.42)) * short,
        lean: rand(-0.1, 0.1),
        curve: rand(-0.6, 0.6),
        r: rand(0.85, 1.15),
        rot: type === 'tulipan' ? 0 : rand(0, TAU),
        growDur: rand(2200, 3200),
        seedStart: -1,
        grow: 0, bloom: 0, bloomStart: -1,
        sway: { amp: rand(0.03, 0.055), speed: rand(0.7, 1.25), phase: rand(0, TAU) },
        angle: 0, bend: 0, bendV: 0, sq: 0, sqV: 0, charge: 0, pop: 0,
        face: type !== 'tulipan' && type !== 'sakura' && Math.random() < 0.4,
        blinkAt: rand(1, 5),
        stem: pick(['#5fbf6a', '#6fcf78', '#56b064']),
        leaves: makeLeaves(),
        note: NOTES[i % NOTES.length],
        hx: 0, hy: 0, hr: 20, geom: null,
      });
    }
    if (!flowers.some((f) => f.face)) {
      const c = flowers.find((f) => f.type !== 'tulipan' && f.type !== 'sakura');
      if (c) c.face = true;
    }
    return flowers.sort((a, b) => a.depth - b.depth);
  }

  function spawnCall(f) {
    const size = (f.r * (0.62 + 0.38 * f.depth) * 1.3).toFixed(1);
    return `flower.spawn({ color: "${COLOR_EN[f.key]}", size: ${size}, happiness: 100 });`;
  }

  // Tallo = curva cuadrática que se mece desde la base
  function stemGeom(f) {
    const h = f.hf * H;
    const bx = f.fx * W, by = H + 6;
    const a = f.angle;
    return {
      bx, by,
      cx: bx + f.curve * h * 0.18 + Math.sin(a) * h * 0.35,
      cy: by - h * 0.5,
      tx: bx + f.lean * h + Math.sin(a) * h,
      ty: by - Math.cos(a) * h,
    };
  }
  function qpt(g, t) {
    const u = 1 - t;
    return {
      x: u * u * g.bx + 2 * u * t * g.cx + t * t * g.tx,
      y: u * u * g.by + 2 * u * t * g.cy + t * t * g.ty,
    };
  }
  function qtan(g, t) {
    const u = 1 - t;
    return Math.atan2(2 * u * (g.cy - g.by) + 2 * t * (g.ty - g.cy), 2 * u * (g.cx - g.bx) + 2 * t * (g.tx - g.cx));
  }

  function updateFlowers(dt, ts) {
    const gust = 0.78 + 0.22 * Math.sin(ts * 0.37) + 0.1 * Math.sin(ts * 1.13);
    const base = headBase();

    for (const f of world.flowers) {
      f.hr = base * f.r * (0.62 + 0.38 * f.depth);

      // semilla → tallo → flor
      if (f.seedStart >= 0) {
        const since = clock.t - f.seedStart;
        const raw = clamp((since - SEED_MS) / f.growDur, 0, 1);
        f.grow = ease.inOutSine(raw);
        if (raw >= 1 && f.bloomStart < 0) {
          f.bloomStart = clock.t;
          sound.chime(f.note);
          for (let i = 0; i < 6; i++) spawnSpark(f.hx, f.hy, { speed: [30, 110], life: [0.5, 1], spr: f.spr });
        }
        if (f.bloomStart >= 0) f.bloom = ease.outBack(clamp((clock.t - f.bloomStart) / 1100, 0, 1));
      }

      f.bendV += (-f.bend * 38 - f.bendV * 4.2) * dt;
      f.bend += f.bendV * dt;
      f.sqV += (-f.sq * 220 - f.sqV * 10) * dt;
      f.sq += f.sqV * dt;
      f.pop *= Math.exp(-dt * 3.2);

      // viento: izquierda → derecha → izquierda, cada una a su ritmo
      const s = f.sway;
      f.angle = world.wind * gust * s.amp *
        (Math.sin(ts * s.speed + s.phase) + 0.3 * Math.sin(ts * s.speed * 2.1 + s.phase * 1.3)) + f.bend;
      f.geom = stemGeom(f);
    }
  }

  /* ---------- Dibujo de flores ---------- */
  function drawLeaf(x, y, a, L) {
    if (L < 0.5) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.scale(L, L);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0.45, -0.42, 1, 0);
    ctx.quadraticCurveTo(0.45, 0.42, 0, 0);
    ctx.fillStyle = '#7fd08a';
    ctx.fill();
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = '#3d8a4a';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.08, 0);
    ctx.quadraticCurveTo(0.5, -0.05, 0.86, 0);
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 0.035;
    ctx.stroke();
    ctx.restore();
  }

  function addPetals(type, n) {
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate((i * TAU) / n);
      switch (type) {
        case 'redonda':
          ctx.moveTo(0.4, -0.5);
          ctx.ellipse(0, -0.5, 0.4, 0.5, 0, 0, TAU);
          break;
        case 'margarita':
          ctx.moveTo(0.14, -0.6);
          ctx.ellipse(0, -0.6, 0.14, 0.42, 0, 0, TAU);
          break;
        case 'sakura':
          ctx.moveTo(0, -0.05);
          ctx.bezierCurveTo(-0.5, -0.25, -0.52, -0.82, -0.2, -1);
          ctx.quadraticCurveTo(-0.06, -0.98, 0, -0.86);
          ctx.quadraticCurveTo(0.06, -0.98, 0.2, -1);
          ctx.bezierCurveTo(0.52, -0.82, 0.5, -0.25, 0, -0.05);
          break;
        case 'dalia':
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-0.34, -0.5, 0, -1);
          ctx.quadraticCurveTo(0.34, -0.5, 0, 0);
          break;
      }
      ctx.restore();
    }
  }

  function addGlints(type, n) {
    const g = GLINT[type];
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      ctx.save();
      ctx.rotate((i * TAU) / n);
      ctx.moveTo(g[0] + g[2], g[1]);
      ctx.ellipse(g[0], g[1], g[2], g[3], g[4], 0, TAU);
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fill();
  }

  function drawFace(f, cr, ts) {
    if (ts > f.blinkAt + 0.14) f.blinkAt = ts + rand(2.2, 6);
    const blink = ts > f.blinkAt ? 0.12 : 1;
    const e = cr * 0.13;
    ctx.fillStyle = '#4a2e2a';
    ctx.beginPath();
    ctx.ellipse(-cr * 0.36, -cr * 0.08, e, e * 1.3 * blink, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cr * 0.36, -cr * 0.08, e, e * 1.3 * blink, 0, 0, TAU);
    ctx.fill();
    if (blink === 1) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-cr * 0.32, -cr * 0.14, e * 0.35, 0, TAU);
      ctx.arc(cr * 0.4, -cr * 0.14, e * 0.35, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,110,150,.5)';
    ctx.beginPath();
    ctx.ellipse(-cr * 0.6, cr * 0.2, cr * 0.16, cr * 0.1, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cr * 0.6, cr * 0.2, cr * 0.16, cr * 0.1, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, cr * 0.1, cr * 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.lineWidth = cr * 0.09;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4a2e2a';
    ctx.stroke();
  }

  function drawCenter(f, ts) {
    const P = f.pal;
    const cr = { margarita: 0.3, dalia: 0.22, sakura: 0.18 }[f.type] || 0.27;
    ctx.rotate(-f.rot); // la carita siempre derechita

    if (f.type === 'sakura') {
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 0.4, Math.sin(a) * 0.4);
      }
      ctx.strokeStyle = P.deep;
      ctx.lineWidth = 0.025;
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU;
        ctx.moveTo(Math.cos(a) * 0.4 + 0.05, Math.sin(a) * 0.4);
        ctx.arc(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0.05, 0, TAU);
      }
      ctx.fillStyle = P.centerDark;
      ctx.fill();
    }

    const cg = ctx.createRadialGradient(-cr * 0.3, -cr * 0.35, cr * 0.1, 0, 0, cr);
    cg.addColorStop(0, '#fff6c9');
    cg.addColorStop(0.5, P.center);
    cg.addColorStop(1, P.centerDark);
    ctx.beginPath();
    ctx.arc(0, 0, cr, 0, TAU);
    ctx.fillStyle = cg;
    ctx.fill();
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = P.centerDark;
    ctx.stroke();

    if (f.face) {
      drawFace(f, cr, ts);
    } else if (f.type !== 'sakura') {
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU + 0.4, d = cr * 0.55;
        ctx.moveTo(Math.cos(a) * d + cr * 0.08, Math.sin(a) * d);
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, cr * 0.08, 0, TAU);
      }
      ctx.fillStyle = 'rgba(160,90,20,.35)';
      ctx.fill();
    }
  }

  function drawTulip(f) {
    const P = f.pal;
    ctx.translate(0, -0.25);
    ctx.shadowColor = P.glow;
    ctx.shadowBlur = f.hr * 0.4;
    ctx.beginPath();
    ctx.moveTo(-0.34, 0.3);
    ctx.bezierCurveTo(-0.58, -0.3, -0.26, -0.92, 0, -1.02);
    ctx.bezierCurveTo(0.26, -0.92, 0.58, -0.3, 0.34, 0.3);
    ctx.closePath();
    ctx.fillStyle = P.deep;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0.035;
    ctx.strokeStyle = P.deep;
    ctx.stroke();

    const lg = ctx.createLinearGradient(0, 0.4, 0, -0.95);
    lg.addColorStop(0, P.deep);
    lg.addColorStop(0.55, P.petal);
    lg.addColorStop(1, P.light);
    ctx.beginPath();
    ctx.moveTo(0.12, 0.4);
    ctx.bezierCurveTo(-0.5, 0.42, -0.72, -0.25, -0.52, -0.86);
    ctx.bezierCurveTo(-0.28, -0.6, -0.02, -0.3, 0.12, 0.4);
    ctx.moveTo(-0.12, 0.4);
    ctx.bezierCurveTo(0.5, 0.42, 0.72, -0.25, 0.52, -0.86);
    ctx.bezierCurveTo(0.28, -0.6, 0.02, -0.3, -0.12, 0.4);
    ctx.fillStyle = lg;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-0.33, -0.42, 0.05, 0.2, -0.35, 0, TAU);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fill();
  }

  function drawHead(f, ts) {
    if (f.type === 'tulipan') { drawTulip(f); return; }
    const P = f.pal;
    ctx.rotate(f.rot);

    const grad = ctx.createRadialGradient(0, 0, 0.12, 0, 0, 1.05);
    grad.addColorStop(0, P.deep);
    grad.addColorStop(0.5, P.petal);
    grad.addColorStop(1, P.light);

    ctx.shadowColor = P.glow;
    ctx.shadowBlur = f.hr * 0.45;
    ctx.beginPath();
    addPetals(f.type, f.n);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0.035;
    ctx.strokeStyle = P.deep;
    ctx.stroke();

    if (f.type === 'dalia') {
      ctx.save();
      ctx.rotate(Math.PI / f.n);
      ctx.scale(0.66, 0.66);
      const g2 = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      g2.addColorStop(0, P.deep);
      g2.addColorStop(1, P.light);
      ctx.beginPath();
      addPetals('dalia', f.n - 2);
      ctx.fillStyle = g2;
      ctx.fill();
      ctx.lineWidth = 0.05;
      ctx.stroke();
      ctx.restore();
    }

    addGlints(f.type, f.n);
    drawCenter(f, ts);
  }

  function drawBud(f, k, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const s = f.hr * 0.42 * k;
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.ellipse(0, -0.55, 0.55, 0.8, 0, 0, TAU);
    ctx.fillStyle = f.pal.petal;
    ctx.fill();
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = f.pal.deep;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, -0.12, 0.62, 0.42, 0, 0, Math.PI);
    ctx.fillStyle = '#6fcf78';
    ctx.fill();
    ctx.restore();
  }

  function drawFlower(f, ts) {
    const p = f.grow;
    if (p <= 0) return;
    const g = f.geom;
    const sw = Math.max(2.2, f.hr * 0.12);

    // tallo (crece en tiempo real)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(g.bx, g.by);
    for (let i = 1; i <= 20; i++) {
      const q = qpt(g, (p * i) / 20);
      ctx.lineTo(q.x, q.y);
    }
    ctx.strokeStyle = '#2f6b3a';
    ctx.lineWidth = sw + 2.2;
    ctx.stroke();
    ctx.strokeStyle = f.stem;
    ctx.lineWidth = sw;
    ctx.stroke();

    for (const lf of f.leaves) {
      if (p < lf.t) continue;
      const k = ease.outBack(clamp((p - lf.t) / 0.2, 0, 1));
      const q = qpt(g, lf.t);
      const a = qtan(g, lf.t) + lf.side * (0.95 + Math.sin(ts * 1.4 + f.sway.phase + lf.t * 5) * 0.07);
      drawLeaf(q.x, q.y, a, f.hr * 1.05 * lf.s * k);
    }

    const hp = qpt(g, p);
    f.hx = hp.x;
    f.hy = hp.y;
    ctx.save();
    ctx.translate(hp.x, hp.y);
    ctx.rotate((qtan(g, p) + Math.PI / 2) * 0.9);
    if (f.charge) ctx.translate(Math.sin(ts * 55 + f.sway.phase) * f.charge * f.hr * 0.05, 0);

    const budK = clamp((p - 0.72) / 0.28, 0, 1);
    const bloomRaw = f.bloomStart >= 0 ? clamp((clock.t - f.bloomStart) / 1100, 0, 1) : 0;
    if (budK > 0 && bloomRaw < 0.35) drawBud(f, budK, 1 - bloomRaw / 0.35);
    if (f.bloom > 0) {
      const s = f.hr * f.bloom * (1 - 0.14 * f.charge) * (1 + 0.22 * f.pop);
      ctx.scale(s * (1 + f.sq * 0.25), s * (1 - f.sq * 0.25));
      drawHead(f, ts);
    }
    ctx.restore();
  }

  // La semilla cae como un pixel de luz, "aterriza" y de ahí nace el tallo
  function drawSeed(f) {
    if (f.seedStart < 0) return;
    const since = clock.t - f.seedStart;
    const fade = 1 - clamp(f.grow / 0.3, 0, 1);
    if (fade <= 0) return;
    const x = f.fx * W, gy = H - 16 * S;
    const k = clamp(since / 450, 0, 1);
    const y = gy - (1 - k * k) * H * 0.35;

    ctx.globalAlpha = fade;
    if (k < 1) {
      const tl = 70 * S;
      const tg = ctx.createLinearGradient(x, y - tl, x, y);
      tg.addColorStop(0, 'rgba(255,255,255,0)');
      tg.addColorStop(1, f.pal.glow);
      ctx.strokeStyle = tg;
      ctx.lineWidth = 2 * S;
      ctx.beginPath();
      ctx.moveTo(x, y - tl);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      const r = (since - 450) / 650;
      if (r < 1) {
        ctx.globalAlpha = fade * (1 - r);
        ctx.strokeStyle = f.pal.petal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, gy, 4 * S + r * 30 * S, (4 * S + r * 30 * S) * 0.35, 0, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = fade;
      }
    }
    const s = 24 * S;
    ctx.drawImage(f.spr, x - s / 2, y - s / 2, s, s);
    ctx.fillStyle = '#e0a060';
    ctx.beginPath();
    ctx.ellipse(x, y, 3.2 * S, 4.4 * S, 0.3, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const GRASS = ['#3fa35a', '#5cc26d', '#2e8a4a'];
  function drawGrass(ts) {
    if (world.grassGrow <= 0) return;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, 3 * S);
    for (let g = 0; g < 3; g++) {
      ctx.beginPath();
      for (const b of world.grass) {
        if (b.g !== g) continue;
        const x = b.x * W;
        const h = (12 + 30 * b.h) * S * world.grassGrow;
        const sw = Math.sin(ts * 1.7 + b.ph + b.x * 8) * 4 * S * (0.3 + world.wind);
        ctx.moveTo(x, H + 3);
        ctx.quadraticCurveTo(x + b.lean * 0.4, H - h * 0.55, x + b.lean + sw, H - h);
      }
      ctx.strokeStyle = GRASS[g];
      ctx.stroke();
    }
  }

  /* ===================== Partículas ===================== */
  const range = (r) => rand(r[0], r[1]);

  function spawnPetal(x, y, o = {}) {
    const P = o.pal && Math.random() < 0.75 ? o.pal : pick(PAL_LIST);
    const spread = o.spread ?? TAU;
    const a = (o.dir ?? -Math.PI / 2) + rand(-spread / 2, spread / 2);
    const sp = range(o.speed || [60, 260]) * S;
    world.petals.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (o.up || 0) * S,
      rot: rand(0, TAU), vr: rand(-4, 4),
      flip: rand(0, TAU), vf: rand(2, 6) * (Math.random() < 0.5 ? -1 : 1),
      size: range(o.size || [5, 10]) * S,
      color: pick([P.petal, P.petal, P.deep, P.light]),
      light: P.light,
      kind: Math.random() < 0.45 ? 1 : 0,
      life: range(o.life || [2.5, 4.5]), age: 0,
      grav: rand(55, 110) * S,
      drag: range(o.drag || [1.0, 1.7]),
      fa: rand(15, 45) * S, ff: rand(1.5, 3.5), ph: rand(0, TAU),
      sparkle: o.sparkle || 0,
      spr: sprites[SPRITE_OF[Object.keys(PALETTES).find((k) => PALETTES[k] === P)]] || pick(sprites),
    });
  }

  function spawnSpark(x, y, o = {}) {
    const a = rand(0, TAU), sp = range(o.speed || [30, 160]) * S;
    world.sparks.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 0, max: range(o.life || [0.6, 1.2]),
      size: range(o.size || [10, 22]) * S,
      spr: o.spr || pick(sprites),
      grav: o.grav ?? 30, drag: o.drag ?? 1.6,
    });
  }

  function floatText(x, y, text, color) {
    world.texts.push({ x, y, text, color, life: 0, max: 1.8 });
  }

  function updateParticles(dt, ts) {
    const push = world.wind * 14 * S * Math.sin(ts * 0.5);

    const P = world.petals;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt;
      p.life -= dt;
      const k = Math.exp(-p.drag * dt);
      p.vx *= k;
      p.vy = p.vy * k + p.grav * dt;
      p.x += (p.vx + Math.sin(p.age * p.ff + p.ph) * p.fa + push) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      // pequeños destellos que sueltan los pétalos de la celebración
      if (p.sparkle && Math.random() < p.sparkle * dt) {
        spawnSpark(p.x, p.y, { speed: [5, 30], life: [0.3, 0.6], size: [6, 12], spr: p.spr, grav: 0 });
      }
      if (p.life <= 0 || p.y > H + 40) { P[i] = P[P.length - 1]; P.pop(); }
    }

    const SP = world.sparks;
    for (let i = SP.length - 1; i >= 0; i--) {
      const s = SP[i];
      s.life += dt;
      const k = Math.exp(-s.drag * dt);
      s.vx *= k;
      s.vy = s.vy * k + s.grav * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.life >= s.max) { SP[i] = SP[SP.length - 1]; SP.pop(); }
    }

    const T = world.texts;
    for (let i = T.length - 1; i >= 0; i--) {
      T[i].life += dt;
      T[i].y -= 26 * S * dt;
      if (T[i].life >= T[i].max) T.splice(i, 1);
    }

    for (const a of world.ambient) {
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      if (a.y < -20) { a.y = H + 20; a.x = rand(0, W); }
      if (a.x < -20) a.x = W + 20;
      if (a.x > W + 20) a.x = -20;
    }

    // lluvia de pétalos después del BOOM
    if (clock.t < world.rainUntil) {
      const rate = clamp(W / 12, 40, 110);
      let n = rate * dt;
      while (n > 0) {
        if (n >= 1 || Math.random() < n) {
          spawnPetal(rand(0, W), -20, { dir: Math.PI / 2, spread: 0.8, speed: [60, 180], size: [5, 10], life: [5, 7], drag: [0.45, 0.7], sparkle: 0.3 });
        }
        n -= 1;
      }
    }

    // en el final, algún pétalo suelto de vez en cuando
    if (world.idle && clock.t > world.idleNext && world.flowers.length) {
      world.idleNext = clock.t + rand(450, 1100);
      const f = pick(world.flowers);
      spawnPetal(f.hx, f.hy, { pal: f.pal, speed: [20, 70], up: 30, size: [4, 8], life: [4, 6] });
    }
  }

  function drawAmbient(ts) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const a of world.ambient) {
      const al = 0.3 + 0.3 * Math.sin(ts * a.sp + a.ph);
      if (a.glyph) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(${a.rgb},${al * 0.55})`;
        ctx.font = `${Math.round((8 + a.size * 0.4) * S + 4)}px "JetBrains Mono", monospace`;
        ctx.fillText(a.glyph, a.x, a.y);
      } else {
        ctx.globalAlpha = al;
        const s = a.size * S;
        ctx.drawImage(a.spr, a.x - s / 2, a.y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawPetals() {
    for (const p of world.petals) {
      const a = clamp(p.life / 1.2, 0, 1) * clamp(p.age / 0.1, 0, 1);
      if (a <= 0.01) continue;
      const c = Math.cos(p.rot), s = Math.sin(p.rot);
      const sx = p.size * (1 + 0.12 * Math.sin(p.age * 5 + p.ph)); // cambian ligeramente de tamaño
      const sy = sx * (0.3 + 0.7 * Math.abs(Math.cos(p.flip)));    // giro en 3D
      ctx.setTransform(DPR * sx * c, DPR * sx * s, -DPR * sy * s, DPR * sy * c, DPR * p.x, DPR * p.y);
      ctx.globalAlpha = a;
      ctx.beginPath();
      if (p.kind === 0) {
        ctx.ellipse(0, 0, 1, 0.6, 0, 0, TAU);
      } else {
        ctx.moveTo(-1, 0);
        ctx.bezierCurveTo(-0.6, -0.75, 0.5, -0.8, 1, -0.3);
        ctx.quadraticCurveTo(0.8, 0, 1, 0.3);
        ctx.bezierCurveTo(0.5, 0.8, -0.6, 0.75, -1, 0);
      }
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = a * 0.6;
      ctx.beginPath();
      ctx.ellipse(-0.2, -0.18, 0.45, 0.16, 0, 0, TAU);
      ctx.fillStyle = p.light;
      ctx.fill();
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = 1;
  }

  function drawSparks() {
    for (const s of world.sparks) {
      const t = s.life / s.max;
      ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, t * 1.4 + 0.1)) * (1 - t * 0.3);
      const z = s.size * (1 - t * 0.4);
      ctx.drawImage(s.spr, s.x - z / 2, s.y - z / 2, z, z);
    }
    ctx.globalAlpha = 1;
  }

  function drawTexts() {
    if (!world.texts.length) return;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.round(11 * S + 4)}px "JetBrains Mono", monospace`;
    for (const t of world.texts) {
      const k = t.life / t.max;
      ctx.globalAlpha = Math.min(1, k * 6) * (1 - k * k);
      ctx.fillStyle = 'rgba(14,15,31,.75)';
      const w = ctx.measureText(t.text).width + 14;
      const h = 11 * S + 12;
      ctx.fillRect(t.x - w / 2, t.y - h / 2, w, h);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y + 1);
    }
    ctx.globalAlpha = 1;
  }

  /* ===================== Bucle principal ===================== */
  function update(dt, ts) {
    world.wind += (world.windTarget - world.wind) * Math.min(1, dt * 1.2);
    world.flash = Math.max(0, world.flash - dt * 1.8);
    updateFlowers(dt, ts);
    updateParticles(dt, ts);
  }

  function draw(ts) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    drawAmbient(ts);

    if (world.ground > 0) {
      const gh = H * 0.24;
      const gr = ctx.createLinearGradient(0, H - gh, 0, H);
      gr.addColorStop(0, 'rgba(60,180,110,0)');
      gr.addColorStop(1, `rgba(50,160,100,${0.35 * world.ground})`);
      ctx.fillStyle = gr;
      ctx.fillRect(0, H - gh, W, gh);
    }

    for (const f of world.flowers) drawFlower(f, ts);
    drawGrass(ts);
    for (const f of world.flowers) drawSeed(f);
    drawPetals();
    drawSparks();
    drawTexts();

    if (world.flash > 0) {
      ctx.fillStyle = `rgba(255,200,230,${world.flash * 0.22})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    tickClock(dt * 1000);
    const ts = clock.t / 1000;
    update(dt, ts);
    draw(ts);
    requestAnimationFrame(frame);
  }

  /* ===================== Sonido (sintetizado, suavecito, apagado por defecto) ===================== */
  const CHORDS = [
    [261.63, 329.63, 392.0],  // Do
    [220.0, 261.63, 329.63],  // La m
    [174.61, 220.0, 261.63],  // Fa
    [196.0, 246.94, 293.66],  // Sol
  ];

  const sound = {
    ctx: null, out: null, bus: null, on: false, timer: null, next: 0, step: 0, noise: null, lastTick: 0,

    init() {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      const ac = (this.ctx = new AC());
      this.out = ac.createGain();
      this.out.gain.value = 0;
      this.out.connect(ac.destination);
      this.bus = ac.createGain();
      this.bus.connect(this.out);
      const d = ac.createDelay(1);
      d.delayTime.value = 0.33;
      const fb = ac.createGain();
      fb.gain.value = 0.32;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2200;
      const wet = ac.createGain();
      wet.gain.value = 0.35;
      this.bus.connect(d);
      d.connect(lp);
      lp.connect(fb);
      fb.connect(d);
      lp.connect(wet);
      wet.connect(this.out);
      return true;
    },

    toggle() {
      if (!this.init()) return false;
      this.on = !this.on;
      const ac = this.ctx, g = this.out.gain, now = ac.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      if (this.on) {
        ac.resume();
        g.linearRampToValueAtTime(0.9, now + 3); // entra muy suave
        this.startMusic();
      } else {
        g.linearRampToValueAtTime(0, now + 0.4);
        this.stopMusic();
      }
      return this.on;
    },

    tone(freq, { at = 0, dur = 1, vol = 0.05, type = 'sine', attack = 0.008, glide = 0 } = {}) {
      if (!this.on) return;
      const ac = this.ctx, t = ac.currentTime + Math.max(0, at);
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur * 0.6);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(this.bus);
      o.start(t);
      o.stop(t + dur + 0.05);
    },

    chime(freq, at = 0) {
      this.tone(freq, { at, dur: 1.8, vol: 0.045 });
      this.tone(freq * 2.01, { at, dur: 1.1, vol: 0.016 });
      this.tone(freq * 3.98, { at, dur: 0.6, vol: 0.006 });
    },

    // teclita de la consola (muy bajito)
    tick(pitch = 1) {
      if (!this.on) return;
      const now = this.ctx.currentTime;
      if (now - this.lastTick < 0.035) return;
      this.lastTick = now;
      this.tone(rand(1700, 2300) * pitch, { dur: 0.04, vol: 0.008, type: 'triangle' });
    },

    // semilla que cae
    drop() {
      this.tone(rand(700, 900), { dur: 0.25, vol: 0.03, glide: 0.55 });
    },

    whoosh() {
      if (!this.on) return;
      const ac = this.ctx, t = ac.currentTime, len = 1.8;
      if (!this.noise) {
        const b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        this.noise = b;
      }
      const src = ac.createBufferSource();
      src.buffer = this.noise;
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(300, t);
      bp.frequency.exponentialRampToValueAtTime(2600, t + 0.35);
      bp.frequency.exponentialRampToValueAtTime(500, t + len);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.bus);
      src.start(t);
      src.stop(t + len + 0.1);
      [1046.5, 1318.5, 1568, 2093, 1760, 1568, 1318.5].forEach((f, i) => this.chime(f * 0.5, 0.05 + i * 0.07));
    },

    startMusic() {
      if (this.timer) return;
      this.next = this.ctx.currentTime + 0.3;
      this.timer = setInterval(() => this.schedule(), 120);
    },
    stopMusic() {
      clearInterval(this.timer);
      this.timer = null;
    },
    schedule() {
      const ac = this.ctx, beat = 0.5;
      if (this.next < ac.currentTime) this.next = ac.currentTime + 0.05;
      while (this.next < ac.currentTime + 0.4) {
        const chord = CHORDS[Math.floor(this.step / 8) % 4];
        const pos = this.step % 8;
        const at = this.next - ac.currentTime;
        if (pos === 0) chord.forEach((f) => this.pad(f, at, beat * 8));
        if ((pos % 2 === 0 && Math.random() < 0.85) || Math.random() < 0.25) {
          const f = chord[(Math.random() * 3) | 0] * (Math.random() < 0.5 ? 2 : 4);
          this.tone(f, { at, dur: 1.3, vol: 0.02 });
        }
        this.next += beat;
        this.step++;
      }
    },
    pad(f, at, dur) {
      const ac = this.ctx, t = ac.currentTime + at;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.016, t + 1.2);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.8);
      o.connect(g);
      g.connect(this.out);
      o.start(t);
      o.stop(t + dur + 1);
    },
  };

  /* ===================== La historia ===================== */

  // 1 · Consola: se compila friendship.exe
  async function intro() {
    await wait(300);
    document.body.classList.add('awake');
    await wait(700);
    termEl.classList.add('on');
    await wait(700);

    let l = await say('initializing garden...');
    await wait(280);
    done(l);
    l = await say('loading flowers...');
    await wait(280);
    done(l, ' 🌸🌼🌷');
    l = await say('planting seeds...');
    await wait(280);
    done(l);
    l = await say('compiling friendship.exe...');
    const bar = termLine('dim');
    await tween(1300, (e) => {
      const n = Math.round(e * 18);
      bar.textContent = `  [${'█'.repeat(n)}${'░'.repeat(18 - n)}] ${Math.round(e * 100)}%`;
    }, ease.inOutSine);
    done(l);
    await wait(350);
    l = await code('garden.ready()', 45);
    await wait(250);
    done(l, ' → true');
    await wait(1000);
  }

  // 2 · Semilla → tallo → flor, una por una, cada una con su línea de código
  async function growFlowers() {
    termEl.classList.add('docked');
    document.body.classList.add('bloom');
    world.flowers = createFlowers();
    tween(2800, (e) => (world.ground = e), ease.inOutSine);
    tween(3000, (e) => (world.grassGrow = e), ease.outCubic);
    world.windTarget = 0.3;
    await wait(900);

    for (const f of shuffle(world.flowers.slice())) {
      f.seedStart = clock.t;
      sound.drop();
      await code(spawnCall(f), 7);
      await wait(130);
    }

    const end = Math.max(...world.flowers.map((f) => f.seedStart + SEED_MS + f.growDur));
    await wait(end - clock.t + 1100);
    const l = termLine();
    renderSegs(l, [['> ', 'prompt'], ...tokenize(`garden.size // ${world.flowers.length} flores`)]);
    done(l, ' ✓');
    world.windTarget = 1;
    world.interactive = true;
    await wait(1600);
  }

  // 3 · const friend = "Rosalba";  →  🌸 Para Rosalba 🌸
  async function showMessage() {
    termEl.classList.add('away');
    dedicationEl.classList.add('on');
    await wait(500);
    await typeSegs(codeLineEl, tokenize('const friend = "Rosalba";'), 60);
    await wait(1200);
    codeLineEl.classList.add('out');
    show(titleEl);
    sound.chime(659.25);
    sound.chime(783.99, 0.12);
    await wait(1700);
    show(subtitleEl);
    await wait(3200);
    await typeSegs(bloomCodeEl, tokenize('garden.bloom();'), 75);
    await wait(500);
  }

  // 4 · garden.bloom() → celebración de pétalos
  async function petalExplosion() {
    world.windTarget = 0; // el viento se calma, las flores "toman aire"
    await tween(1200, (e) => world.flowers.forEach((f) => (f.charge = e)), ease.inOutSine);
    await wait(200);
    dedicationEl.classList.add('gone');

    const per = reduceMotion ? 14 : Math.round(clamp((W * H) / 26000, 26, 58));
    for (const f of world.flowers) {
      f.charge = 0;
      f.pop = 1;
      f.sqV += 9;
      f.bendV += rand(-1, 1);
      const y = f.hy - f.hr * 0.2;
      for (let i = 0; i < per; i++) {
        spawnPetal(f.hx, y, { pal: f.pal, speed: [140, 700], up: 180, size: [5, 11], life: [3.5, 6.5], sparkle: 0.5 });
      }
      for (let i = 0; i < 8; i++) spawnSpark(f.hx, y, { speed: [80, 300], life: [0.6, 1.3], spr: f.spr });
    }
    world.flash = 1;
    world.rainUntil = clock.t + 1800;
    sound.whoosh();

    await wait(500);
    world.windTarget = 1;
    await wait(2500);
  }

  // 5 · friendship.exe completed successfully
  async function finale() {
    finaleEl.classList.add('on');
    await wait(700);
    await typeSegs(cardLogEl, [['> ', 'prompt'], ['friendship.exe completed successfully', '']], 34);
    done(cardLogEl);
    await wait(600);
    show(cardTitleEl);
    sound.chime(523.25);
    sound.chime(659.25, 0.15);
    sound.chime(783.99, 0.3);
    await wait(1100);
    show(cardMsgEl);
    await wait(1500);
    show(cardNoteEl);
    world.idle = true;
    await wait(1800);
    show(hintEl);
    levelEl.hidden = false;
    replayBtn.hidden = false;
  }

  async function run() {
    await intro();
    await growFlowers();
    await showMessage();
    await petalExplosion();
    await finale();
  }

  function reset() {
    Object.assign(world, {
      wind: 0, windTarget: 0, ground: 0, grassGrow: 0, flash: 0,
      interactive: false, idle: false, rainUntil: 0, flowers: [],
    });
    world.petals.length = 0;
    world.sparks.length = 0;
    world.texts.length = 0;
    document.body.classList.remove('awake', 'bloom');
    termEl.classList.remove('on', 'docked', 'away');
    termLines.textContent = '';
    for (const el of [codeLineEl, bloomCodeEl, cardLogEl]) el.textContent = '';
    codeLineEl.classList.remove('out');
    document.querySelectorAll('.show, .on, .gone').forEach((el) => el.classList.remove('show', 'on', 'gone'));
    replayBtn.hidden = true;
    canvas.style.cursor = 'default';
  }

  /* ===================== Interacción ===================== */
  function flowerAt(x, y) {
    for (let i = world.flowers.length - 1; i >= 0; i--) {
      const f = world.flowers[i];
      if (f.bloom < 0.6) continue;
      const r = f.hr * f.bloom * 1.15;
      if ((x - f.hx) ** 2 + (y - f.hy + f.hr * 0.2) ** 2 < r * r) return f;
    }
    return null;
  }

  function poke(f, x) {
    f.bendV += (x < f.hx ? 1 : -1) * rand(1.2, 1.6);
    f.sqV += 7;
    const n = reduceMotion ? 5 : 10;
    for (let i = 0; i < n; i++) {
      spawnPetal(f.hx, f.hy - f.hr * 0.3, { pal: f.pal, speed: [60, 220], up: 60, size: [4, 8], life: [2, 3.5] });
    }
    for (let i = 0; i < 7; i++) spawnSpark(f.hx, f.hy, { speed: [40, 140], life: [0.5, 1], spr: f.spr });
    sound.chime(f.note);

    // > flower.clicked()  > friendship_level += 1
    const tx = clamp(f.hx, 110 * S, W - 110 * S);
    const lh = 11 * S + 16;
    floatText(tx, f.hy - f.hr * 1.5 - lh, '> flower.clicked()', '#9ff0b5');
    floatText(tx, f.hy - f.hr * 1.5, '> friendship_level += 1', '#ffd97a');
    friendship += 1;
    levelNumEl.textContent = friendship;
    levelNumEl.classList.remove('bump');
    void levelNumEl.offsetWidth;
    levelNumEl.classList.add('bump');
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!world.interactive) return;
    const f = flowerAt(e.clientX, e.clientY);
    if (f) poke(f, e.clientX);
    else for (let i = 0; i < 6; i++) spawnSpark(e.clientX, e.clientY, { speed: [20, 90], life: [0.5, 0.9], size: [8, 16] });
  });

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    canvas.style.cursor = world.interactive && flowerAt(e.clientX, e.clientY) ? 'pointer' : 'default';
  });

  soundBtn.addEventListener('click', () => {
    const on = sound.toggle();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.classList.toggle('is-on', on);
    soundBtn.querySelector('.lbl').textContent = on ? 'con sonido' : 'sin sonido';
  });

  replayBtn.addEventListener('click', () => {
    reset();
    run();
  });

  document.addEventListener('visibilitychange', () => {
    if (!sound.ctx || !sound.on) return;
    if (document.hidden) sound.ctx.suspend();
    else sound.ctx.resume();
  });

  window.addEventListener('resize', resize);

  /* ===================== Arranque ===================== */
  document.querySelectorAll('.deco code').forEach((el) => renderSegs(el, tokenize(el.textContent)));
  resize();
  initAmbient();
  requestAnimationFrame((now) => { last = now; frame(now); });
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(1500)])
    .catch(() => {})
    .then(run);
})();
