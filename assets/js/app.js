(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");
  root.lang = "ar"; root.dir = "rtl";
  document.body.classList.add("locked");
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ── Fill content ── */
  document.querySelectorAll("[data-c]").forEach(el => {
    const v = CONFIG[el.dataset.c];
    if (v != null) el.textContent = v;
  });
  document.title = `${CONFIG.groom} & ${CONFIG.bride}`;

  /* ════════ Flower artwork (generated once, reused everywhere) ════════ */
  const flora = $("#flora");
  const petal = (len, wid, tip = .95) =>
    `M0 0C${-wid} ${-len * .22} ${-wid * .95} ${-len * tip} 0 ${-len}C${wid * .95} ${-len * tip} ${wid} ${-len * .22} 0 0Z`;
  const roundPetal = (len, wid) =>
    `M0 0C${-wid * 1.1} ${-len * .1} ${-wid * 1.05} ${-len * 1.02} 0 ${-len}C${wid * 1.05} ${-len * 1.02} ${wid * 1.1} ${-len * .1} 0 0Z`;
  function ring(n, path, fill, rot0, stroke, sw = .7) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const r = rot0 + i * 360 / n + (Math.sin(i * 7.3) * 6);
      s += `<path d="${path}" transform="rotate(${r.toFixed(1)})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }
    return s;
  }
  // White anemone with olive-gold heart
  const anemone =
    `<g id="fAnemone">` +
      ring(6, petal(46, 24), "url(#gWhite)", 0, "rgba(190,160,110,.45)") +
      ring(6, petal(34, 18), "url(#gWhite)", 30, "rgba(190,160,110,.4)") +
      Array.from({ length: 6 }, (_, i) => `<path d="M0 -12 Q2 -24 0 -36" transform="rotate(${i * 60})" stroke="rgba(200,170,120,.35)" stroke-width=".8" fill="none"/>`).join("") +
      `<circle r="11" fill="url(#gCore)"/><circle r="6.5" fill="#6d6a38" opacity=".8"/>` +
      Array.from({ length: 16 }, (_, i) => { const a = i * 22.5 * Math.PI / 180, r = 13 + (i % 2) * 3; return `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.5" fill="#c9a042"/>`; }).join("") +
    `</g>`;
  // Blush garden rose, layered petals around a spiral heart
  const rose =
    `<g id="fRose">` +
      ring(5, roundPetal(46, 30), "url(#gBlush)", 10, "rgba(160,105,80,.35)") +
      ring(5, roundPetal(36, 24), "url(#gBlush)", 46, "rgba(160,105,80,.35)") +
      ring(4, roundPetal(25, 18), "url(#gBlush)", 20, "rgba(160,105,80,.4)") +
      `<path d="M-2 -1c-6 -8 6 -14 10 -6s-4 16 -12 10 -6 -18 6 -20" fill="none" stroke="rgba(150,95,70,.55)" stroke-width="1.2" stroke-linecap="round"/>` +
      `<circle r="4" fill="#c28f74" opacity=".6"/>` +
    `</g>`;
  // Rose bud
  const bud =
    `<g id="fBud">` +
      `<path d="M0 0C-12-8-10-28 0-34 10-28 12-8 0 0Z" fill="url(#gBlush)" stroke="rgba(160,105,80,.35)" stroke-width=".7"/>` +
      `<path d="M0 0C-8-6-8-20 2-28" fill="none" stroke="rgba(150,95,70,.45)" stroke-width="1"/>` +
      `<path d="M0 2C-10 0-14-10-12-16-6-8-2-4 0 2ZM0 2C10 0 14-10 12-16 6-8 2-4 0 2Z" fill="url(#gLeaf)"/>` +
    `</g>`;
  // Pointed leaf with vein
  const leaf =
    `<g id="fLeaf"><path d="M0 0C12-10 40-12 70 0 40 12 12 10 0 0Z" fill="url(#gLeaf)" stroke="rgba(90,105,60,.35)" stroke-width=".6"/>` +
    `<path d="M2 0H66M18 0l10-5M18 0l10 5M34 0l10-6M34 0l10 6M50 0l8-4M50 0l8 4" stroke="rgba(240,245,225,.55)" stroke-width=".7" fill="none"/></g>`;
  // Eucalyptus sprig
  const euc = (() => {
    let s = `<g id="fEuc"><path d="M0 0C20 -10 50 -14 90 -8" fill="none" stroke="#8a9a7a" stroke-width="1.6"/>`;
    for (let i = 0; i < 6; i++) {
      const x = 10 + i * 14, y = -4 - i * 1.2 - (i > 3 ? 1 : 0), r = 8 - i * .6, up = i % 2 ? 1 : -1;
      s += `<ellipse cx="${x}" cy="${y + up * (r * .9)}" rx="${r}" ry="${r * .8}" fill="url(#gEuc)" stroke="rgba(90,110,90,.35)" stroke-width=".5"/>`;
    }
    return s + `</g>`;
  })();
  // Baby's breath spray
  const gyp = (() => {
    let s = `<g id="fGyp" stroke="#b5b89a" stroke-width=".6" fill="none">`;
    const pts = [[0,-30],[-10,-26],[9,-24],[-4,-38],[14,-34],[-16,-34],[5,-44],[-9,-46],[20,-40]];
    pts.forEach(([x, y]) => { s += `<path d="M0 0Q${x * .4} ${y * .6} ${x} ${y}"/>`; });
    s += `</g><g fill="#fffdf6" stroke="rgba(200,180,140,.5)" stroke-width=".4">`;
    pts.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="2.4"/><circle cx="${x + 2.5}" cy="${y + 1.5}" r="1.6"/>`; });
    return s + `</g>`;
  })();
  flora.insertAdjacentHTML("beforeend", anemone + rose + bud + leaf + euc + gyp);

  const clusters = {
    main: `<svg viewBox="0 0 220 220">
      <use href="#fEuc" transform="translate(40 60) rotate(-40)"/>
      <use href="#fEuc" transform="translate(110 118) rotate(55) scale(.9)"/>
      <use href="#fLeaf" transform="translate(96 100) rotate(-150) scale(.9)"/>
      <use href="#fLeaf" transform="translate(110 96) rotate(-20) scale(1)"/>
      <use href="#fLeaf" transform="translate(96 110) rotate(100) scale(.8)"/>
      <use href="#fGyp" transform="translate(150 70) rotate(40)"/>
      <use href="#fGyp" transform="translate(60 150) rotate(-130) scale(.9)"/>
      <use href="#fGyp" transform="translate(140 150) rotate(140) scale(.8)"/>
      <path d="M40 30c20 12 30 30 30 50M180 160c-14-18-34-28-54-26" fill="none" stroke="#c9a45c" stroke-width="1.1"/>
      <use href="#fBud" transform="translate(160 150) rotate(130) scale(.9)"/>
      <use href="#fAnemone" transform="translate(148 62) scale(.62) rotate(20)"/>
      <use href="#fAnemone" transform="translate(62 150) scale(.5) rotate(-15)"/>
      <use href="#fRose" transform="translate(98 100) scale(1.05) rotate(8)"/>
    </svg>`,
    small: `<svg viewBox="0 0 160 160">
      <use href="#fEuc" transform="translate(30 50) rotate(-30) scale(.8)"/>
      <use href="#fLeaf" transform="translate(76 78) rotate(-160) scale(.7)"/>
      <use href="#fLeaf" transform="translate(80 76) rotate(10) scale(.75)"/>
      <use href="#fGyp" transform="translate(110 60) rotate(50) scale(.8)"/>
      <use href="#fBud" transform="translate(112 112) rotate(130) scale(.75)"/>
      <use href="#fAnemone" transform="translate(76 76) scale(.8) rotate(10)"/>
    </svg>`
  };
  document.querySelectorAll("[data-cluster]").forEach(el => { el.innerHTML = clusters[el.dataset.cluster]; });

  /* Wax seal: irregular poured edge, pressed rim and embossed monogram */
  const sealSVG = (() => {
    let d = "";
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2;
      const r = 44 + Math.sin(a * 5 + 1) * 1.6 + Math.sin(a * 11) * 1 + Math.sin(a * 3 + 2) * 1.4;
      d += (i ? "L" : "M") + (50 + Math.cos(a) * r).toFixed(2) + " " + (50 + Math.sin(a) * r).toFixed(2);
    }
    return `<svg viewBox="0 0 100 100">
      <defs><filter id="emb" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="b"/>
        <feSpecularLighting in="b" surfaceScale="3" specularConstant=".9" specularExponent="18" lighting-color="#ffe2b8" result="s"><fePointLight x="20" y="10" z="60"/></feSpecularLighting>
        <feComposite in="s" in2="SourceAlpha" operator="in" result="sp"/>
        <feComposite in="SourceGraphic" in2="sp" operator="arithmetic" k1="0" k2="1" k3=".75" k4="0"/>
      </filter></defs>
      <path d="${d}Z" fill="url(#gWax)" filter="url(#emb)"/>
      <circle cx="50" cy="50" r="33" fill="none" stroke="#7a4516" stroke-width="3" opacity=".55"/>
      <circle cx="50" cy="50" r="33" fill="none" stroke="#f0bf85" stroke-width="1" opacity=".55" transform="translate(-.8 -.8)"/>
      <circle cx="50" cy="50" r="29" fill="#a86a31" opacity=".35"/>
      <g font-family="Great Vibes, cursive" font-size="21" text-anchor="middle">
        <text x="50.8" y="60.8" fill="#6a3a12" opacity=".75">${CONFIG.mono.replace(/\s/g, "")}</text>
        <text x="49.4" y="59.4" fill="#f7cf98" opacity=".7">${CONFIG.mono.replace(/\s/g, "")}</text>
        <text x="50" y="60" fill="#b27336">${CONFIG.mono.replace(/\s/g, "")}</text>
      </g>
      <path d="M50 30.5c-1.6-2.6-6-2-6 1.6 0 3 6 6.6 6 6.6s6-3.6 6-6.6c0-3.6-4.4-4.2-6-1.6z" fill="#b27336" stroke="#f7cf98" stroke-width=".6" opacity=".95"/>
      <ellipse cx="36" cy="28" rx="12" ry="6" fill="#fff" opacity=".12" transform="rotate(-30 36 28)"/>
    </svg>`;
  })();
  document.querySelectorAll("[data-seal]").forEach(el => { el.innerHTML = sealSVG; });

  /* ════════ Dates ════════ */
  const when = new Date(CONFIG.date);
  const end = new Date(CONFIG.endDate);
  const TZ = "Africa/Cairo";
  const fmt = (o, d = when, loc = "ar-EG") => {
    try { return new Intl.DateTimeFormat(loc, { timeZone: TZ, ...o }).format(d); }
    catch (e) { return new Intl.DateTimeFormat(loc, o).format(d); }
  };
  const nf = new Intl.NumberFormat("ar-EG", { useGrouping: false });
  $("#dWeekday").textContent = fmt({ weekday: "long" });
  $("#dDay").textContent = fmt({ day: "numeric" });
  $("#dMonth").textContent = fmt({ month: "long" });
  $("#dYear").textContent = fmt({ year: "numeric" });
  $("#vTime").textContent = fmt({ hour: "numeric", minute: "2-digit" });
  $("#letterDate").textContent = fmt({ month: "long", day: "numeric", year: "numeric" }, when, "en-US");
  $("#rsvpBy").textContent = fmt({ day: "numeric", month: "long" }, new Date(CONFIG.rsvpBy));

  /* Calendar (week starts Monday, like the printed card) */
  const part = t => +fmt({ [t]: "numeric" }, when, "en-US");
  const Y = part("year"), M = part("month"), D = part("day");
  $("#calTitle").textContent = fmt({ month: "long", year: "numeric" });
  const grid = $("#calGrid");
  ["إثن", "ثلا", "أرب", "خمي", "جمع", "سبت", "أحد"].forEach(w => {
    const s = document.createElement("span"); s.className = "wd"; s.textContent = w; grid.appendChild(s);
  });
  const lead = (new Date(Date.UTC(Y, M - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(Y, M, 0)).getUTCDate();
  for (let i = 0; i < lead; i++) grid.appendChild(document.createElement("span"));
  for (let d = 1; d <= days; d++) {
    const s = document.createElement("span");
    s.className = "d" + (d === D ? " on" : "");
    if (d === D) s.innerHTML = '<svg aria-hidden="true"><use href="#heartGold"/></svg>';
    s.append(nf.format(d));
    grid.appendChild(s);
  }

  /* Links */
  $("#mapLink").href = CONFIG.mapUrl;
  const gcal = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  $("#calLink").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(`زفاف ${CONFIG.groom} و${CONFIG.bride}`) +
    "&dates=" + gcal(when) + "/" + gcal(end) +
    "&location=" + encodeURIComponent(`${CONFIG.venueNameEn} - ${CONFIG.venueAddress}`) +
    "&details=" + encodeURIComponent("بكل الحب ندعوكم لمشاركتنا فرحتنا");
  // Embedded map where the host allows frames (the claude.ai preview does not).
  if (CONFIG.mapEmbed && !/claude|anthropic/i.test(location.hostname)) {
    const f = document.createElement("iframe");
    f.src = CONFIG.mapEmbed; f.loading = "lazy"; f.title = "خريطة مكان الحفل";
    f.referrerPolicy = "no-referrer-when-downgrade";
    $("#mapBox").appendChild(f); $("#mapBox").hidden = false;
  }

  /* Arch frame lines drawn from the crest outwards, sized to the frame */
  const frame = $("#frame");
  function drawFrame() {
    const w = frame.clientWidth, h = frame.clientHeight;
    const paths = frame.querySelectorAll(".frame-lines path");
    [[0, 0], [9, 1]].forEach(([m, k]) => {
      const x0 = m, x1 = w - m, y1 = h - m, cx = w / 2, rx = (x1 - x0) / 2, ry = Math.min(230 - m, h / 2), rb = Math.max(4, 12 - m);
      const top = m, side = top + ry;
      paths[k * 2].setAttribute("d", `M${cx} ${top}A${rx} ${ry} 0 0 1 ${x1} ${side}V${y1 - rb}Q${x1} ${y1} ${x1 - rb} ${y1}H${cx}`);
      paths[k * 2 + 1].setAttribute("d", `M${cx} ${top}A${rx} ${ry} 0 0 0 ${x0} ${side}V${y1 - rb}Q${x0} ${y1} ${x0 + rb} ${y1}H${cx}`);
    });
  }
  drawFrame();
  if ("ResizeObserver" in window) new ResizeObserver(drawFrame).observe(frame);
  else addEventListener("resize", drawFrame);

  /* ════════ Countdown ════════ */
  const cells = { d: $("#cDays"), h: $("#cHours"), m: $("#cMins"), s: $("#cSecs") };
  const last = {};
  function setCell(k, v) {
    if (last[k] === v) return;
    last[k] = v;
    const b = document.createElement("b");
    b.textContent = nf.format(v);
    if (!reduce) b.className = "flip";
    cells[k].replaceChildren(b);
  }
  function tick() {
    const diff = Math.max(0, when - Date.now());
    if (diff === 0) { $("#count").hidden = true; $("#countDone").hidden = false; return; }
    const s = Math.floor(diff / 1000);
    setCell("d", Math.floor(s / 86400));
    setCell("h", Math.floor(s / 3600) % 24);
    setCell("m", Math.floor(s / 60) % 60);
    setCell("s", s % 60);
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();

  /* ════════ RSVP → email (FormSubmit), WhatsApp as a fallback ════════ */
  const form = $("#rsvpForm");
  const attending = () => $("#attYes").checked;
  const err = msg => { $("#formErr").textContent = msg; $("#formErr").hidden = !msg; };
  form.addEventListener("change", () => { $("#guestsField").hidden = !attending(); });
  function showDone(name, yes, sent, waText) {
    $("#rsvpThanks").textContent = sent
      ? (yes ? `شكراً ${name}، وصل تأكيد حضورك للعروسين. في انتظارك!` : `شكراً ${name} على لطفك، وصل اعتذارك للعروسين.`)
      : `شكراً ${name}، اضغط الزر لإرسال ردك للعروسين عبر واتساب.`;
    $("#rsvpAlt").hidden = sent;
    if (!sent) $("#waLink").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`;
    form.hidden = true;
    $("#rsvpDone").hidden = false;
    Auto.stop();
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const nameEl = $("#gName"), name = nameEl.value.trim();
    if (!name) { err("من فضلك اكتب اسمك"); nameEl.focus(); return; }
    err("");
    const yes = attending();
    const count = yes ? $("#gCount").selectedOptions[0].text : "—";
    const msg = $("#gMsg").value.trim();
    const waText = [`تأكيد حضور زفاف ${CONFIG.groom} و${CONFIG.bride}`, `الاسم: ${name}`,
      yes ? `الحضور: سأحضر بإذن الله (${count})` : "الحضور: أعتذر عن الحضور", msg && `رسالة: ${msg}`].filter(Boolean).join("\n");

    if (!CONFIG.rsvpEmail) {
      if (CONFIG.whatsapp) return showDone(name, yes, false, waText);
      return err("استقبال الردود لم يُفعَّل بعد، جرّب لاحقاً.");
    }
    const btn = $("#rsvpSubmit"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "جارٍ الإرسال…";
    try {
      const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.rsvpEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `${yes ? "تأكيد حضور" : "اعتذار"}: ${name} — زفاف ${CONFIG.groom} و${CONFIG.bride}`,
          _template: "table", _captcha: "false",
          "الاسم": name,
          "الحضور": yes ? "سأحضر بإذن الله" : "أعتذر عن الحضور",
          "عدد الحضور": count,
          "رسالة للعروسين": msg || "—"
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || res.status);
      showDone(name, yes, true);
    } catch (e2) {
      if (CONFIG.whatsapp) showDone(name, yes, false, waText);
      else err("تعذّر الإرسال الآن. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.");
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });
  $("#rsvpEdit").addEventListener("click", () => { $("#rsvpDone").hidden = true; form.hidden = false; });

  /* ════════ Built-in music: an original Egyptian zaffa in maqam Hijaz ════════
     Qanun melody with tremolo, oud bass, darbuka on the maqsum rhythm and riq.
     All instruments are synthesised (Karplus–Strong strings, noise percussion). */
  const Zaffa = (() => {
    let playing = false;
    let ctx, master, dry, rev, noise, timer, next = 0, step = 0;
    const E = 0.29;                                 // eighth note (~103 bpm)
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    // Hijaz on D: D Eb F# G A Bb C D  (62 63 66 67 69 70 72 74)
    const PH = {
      A: [[69,2],[70,1],[69,1],[67,1],[66,1],[67,2], [69,3],[67,1],[66,1],[63,1],[62,2]],
      B: [[62,1],[66,1],[67,1],[69,1],[70,2],[69,2], [72,1],[70,1],[69,1],[67,1],[69,4]],
      C: [[74,2],[72,1],[70,1],[69,2],[70,1],[72,1], [70,1],[69,1],[67,1],[66,1],[67,2],[69,2]],
      D: [[67,1],[66,1],[63,1],[66,1],[67,2],[66,1],[63,1], [62,6],[0,2]]
    };
    const BASS = { A: [50, 50], B: [50, 48], C: [55, 48], D: [55, 50] };
    const ORDER = ["A", "B", "A", "D", "C", "B", "C", "D"];
    const song = {}, bassline = [];
    let pos0 = 0;
    ORDER.forEach(k => {
      let p = pos0;
      PH[k].forEach(([m, l]) => { if (m) song[p] = [m, l]; p += l; });
      bassline.push(...BASS[k]);
      pos0 += 16;
    });
    const LEN = pos0, INTRO = 8;
    const cache = {};

    function pluckBuf(m, dark) {
      const key = m + (dark ? "d" : "b");
      if (cache[key]) return cache[key];
      const sr = ctx.sampleRate, f = hz(m), N = Math.max(2, Math.round(sr / f));
      const dur = dark ? 1.6 : 2.2, len = Math.floor(sr * dur);
      const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      let prev = 0;
      for (let i = 0; i < N; i++) { const r = Math.random() * 2 - 1; d[i] = dark ? (prev = prev * .55 + r * .45) : r; }
      const damp = dark ? .993 : .9975;
      for (let i = N; i < len; i++) d[i] = damp * .5 * (d[i - N] + (i - N - 1 >= 0 ? d[i - N - 1] : 0));
      let peak = 0; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
      for (let i = 0; i < len; i++) d[i] /= peak || 1;
      return (cache[key] = buf);
    }
    function pluck(m, t, vel, dark, pan = 0) {
      const src = ctx.createBufferSource(); src.buffer = pluckBuf(m, dark);
      const g = ctx.createGain(); g.gain.value = vel;
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = dark ? 1800 : 5200;
      const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      src.connect(f); f.connect(g);
      if (p) { p.pan.value = pan; g.connect(p); out(p); } else out(g);
      src.start(t);
    }
    function nz(t, dur, type, freq, q, vel) {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); out(g, .15);
      s.start(t, Math.random() * .5); s.stop(t + dur + .02);
    }
    function dum(t, v) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(62, t + .16);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .5);
      o.connect(g); out(g, .1); o.start(t); o.stop(t + .52);
      nz(t, .05, "lowpass", 500, .7, v * .5);
    }
    function tak(t, v) {
      nz(t, .09, "bandpass", 3200, .9, v);
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(1150, t); o.frequency.exponentialRampToValueAtTime(700, t + .04);
      g.gain.setValueAtTime(v * .35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .05);
      o.connect(g); out(g, .1); o.start(t); o.stop(t + .06);
    }
    function riq(t, v) { nz(t, .14, "highpass", 6500, .5, v); nz(t, .1, "bandpass", 9500, 3, v * .6); }

    function init() {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
      dry = ctx.createGain(); dry.gain.value = .9; dry.connect(master);
      rev = ctx.createConvolver();
      const len = ctx.sampleRate * 2.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5); }
      rev.buffer = ir;
      const wet = ctx.createGain(); wet.gain.value = .32; rev.connect(wet); wet.connect(master);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    }
    function out(node, send = .35) {
      node.connect(dry);
      if (send) { const s = ctx.createGain(); s.gain.value = send; node.connect(s); s.connect(rev); }
    }
    function schedule() {
      while (next < ctx.currentTime + .35) {
        const t = next;
        if (step < INTRO) {
          // Opening darbuka roll that swells into the zaffa
          const v = .25 + step / INTRO * .5;
          if (step === 0) dum(t, .8);
          tak(t, v); tak(t + E / 2, v * .8);
          if (step === INTRO - 1) { dum(t, .9); riq(t, .4); }
        } else {
          const pos = (step - INTRO) % LEN, loop = Math.floor((step - INTRO) / LEN), slot = pos % 8, bar = Math.floor(pos / 8);
          // Maqsum: DUM tak . tak DUM . tak .
          if (slot === 0 || slot === 4) dum(t, slot === 0 ? .85 : .7);
          if (slot === 1 || slot === 3 || slot === 6) tak(t, .45);
          if (slot === 2 || slot === 5 || slot === 7) tak(t, .14);
          riq(t, slot % 2 ? .16 : .08);
          if (slot === 7 && bar % 4 === 3) { tak(t + E / 2, .3); }
          // Oud bass
          const root = bassline[bar];
          if (slot === 0) pluck(root, t, .5, true, -.2);
          if (slot === 3) pluck(root + 7, t, .28, true, -.2);
          if (slot === 4) pluck(root + 12, t, .32, true, -.2);
          if (slot === 6) pluck(root + 7, t, .24, true, -.2);
          // Qanun melody (tremolo on long notes), doubled by oud on alternate passes
          const n = song[pos];
          if (n) {
            const [m, l] = n;
            if (l >= 3) {
              const hits = l * 2;
              for (let k = 0; k < hits; k++) pluck(m, t + k * E / 2, .42 * (1 - k / hits * .5), false, .25);
            } else {
              pluck(m, t, .55, false, .25);
              if (l === 2) pluck(m + 12, t + E, .12, false, .35);
            }
            if (loop % 2 === 1) pluck(m - 12, t, .3, true, -.1);
          }
        }
        next += E; step++;
      }
    }
    return {
      // Create and unlock the audio context inside the guest's tap, so a later fallback can start.
      prime() { try { if (!ctx) init(); ctx.resume(); } catch (e) {} },
      play() {
        try {
          if (!ctx) init();
          ctx.resume();
          if (!playing) {
            next = Math.max(next, ctx.currentTime + .1);
            schedule(); timer = setInterval(schedule, 80);
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setTargetAtTime(.8, ctx.currentTime, .5);
            playing = true;
          }
        } catch (e) { playing = false; }
        sync();
      },
      pause() {
        if (!ctx) return;
        master.gain.setTargetAtTime(0, ctx.currentTime, .2);
        clearInterval(timer); playing = false; sync();
        setTimeout(() => { if (!playing) { ctx.suspend(); next = 0; } }, 1000);
      },
      get playing() { return playing; }
    };
  })();
  /* The song file from config plays first; if it is missing or can't play, the zaffa takes over. */
  const Music = (() => {
    let audio = null, useSynth = !CONFIG.musicUrl, playing = false, want = false, fade;
    const fallback = () => {
      if (useSynth) return;
      useSynth = true; playing = false;
      if (audio) { audio.pause(); audio.removeAttribute("src"); }
      if (want) Zaffa.play(); else sync();
    };
    if (!useSynth) {
      audio = new Audio();
      audio.loop = true; audio.preload = "auto"; audio.volume = 0;
      audio.addEventListener("error", fallback);
      audio.src = CONFIG.musicUrl;
    }
    return {
      play() {
        want = true;
        if (useSynth) { Zaffa.play(); return; }
        Zaffa.prime();
        audio.play().then(() => {
          playing = true; sync();
          clearInterval(fade);
          fade = setInterval(() => { audio.volume = Math.min(.85, audio.volume + .05); if (audio.volume >= .85) clearInterval(fade); }, 120);
        }).catch(err => { if (err && err.name !== "NotAllowedError" && err.name !== "AbortError") fallback(); });
      },
      pause() {
        want = false;
        if (useSynth) { Zaffa.pause(); return; }
        clearInterval(fade); audio.pause(); audio.volume = 0; playing = false; sync();
      },
      get playing() { return useSynth ? Zaffa.playing : playing; }
    };
  })();
  const mBtn = $("#musicBtn");
  function sync() {
    mBtn.classList.toggle("playing", Music.playing);
    mBtn.setAttribute("aria-pressed", String(Music.playing));
    mBtn.setAttribute("aria-label", Music.playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى");
  }
  mBtn.addEventListener("click", () => Music.playing ? Music.pause() : Music.play());

  /* ════════ Gentle auto-scroll after the envelope opens ════════ */
  const sBtn = $("#scrollBtn");
  const Auto = (() => {
    let running = false, done = false, raf = 0, lastTs = 0, y = 0, idle;
    const speed = CONFIG.autoScrollSpeed;
    function frame(ts) {
      if (!running) return;
      const dt = lastTs ? Math.min(64, ts - lastTs) : 16;
      lastTs = ts;
      const max = document.documentElement.scrollHeight - innerHeight;
      y = Math.min(max, y + speed * dt / 1000);
      window.scrollTo({ top: y, behavior: "instant" });
      if (y >= max - 1) { stop(); return; }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (done || !speed || reduce) return;
      clearTimeout(idle);
      running = true; lastTs = 0; y = scrollY;
      sBtn.classList.add("running"); sBtn.setAttribute("aria-label", "إيقاف التمرير التلقائي");
      raf = requestAnimationFrame(frame);
    }
    function pause(resumeAfter) {
      running = false; cancelAnimationFrame(raf); clearTimeout(idle);
      sBtn.classList.remove("running"); sBtn.setAttribute("aria-label", "تشغيل التمرير التلقائي");
      if (resumeAfter && !done) idle = setTimeout(start, resumeAfter);
    }
    function stop() { done = true; pause(); }
    return { start, pause, stop, get running() { return running; }, resume() { done = false; start(); } };
  })();
  ["wheel", "touchstart", "keydown"].forEach(ev => addEventListener(ev, e => {
    if (e.target.closest && e.target.closest(".fab")) return;
    if (Auto.running) Auto.pause(6000);
  }, { passive: true }));
  form.addEventListener("focusin", () => Auto.stop());
  sBtn.addEventListener("click", () => Auto.running ? Auto.stop() : Auto.resume());

  /* ════════ Scroll reveal + parallax ════════ */
  function startReveal() {
    const els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));
  }
  const parEls = [...document.querySelectorAll("[data-par]")];
  let parQueued = false;
  addEventListener("scroll", () => {
    if (parQueued || reduce) return;
    parQueued = true;
    requestAnimationFrame(() => {
      parQueued = false;
      parEls.forEach(el => { el.style.translate = `0 ${(scrollY * +el.dataset.par).toFixed(1)}px`; });
    });
  }, { passive: true });

  /* ════════ Open the envelope ════════ */
  const intro = $("#intro"), stage = $("#envStage");
  let opened = false;
  intro.addEventListener("pointermove", e => {
    if (opened || reduce || e.pointerType === "touch") return;
    const rx = (e.clientY / innerHeight - .5) * -10, ry = (e.clientX / innerWidth - .5) * 12;
    stage.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  function openInvite() {
    if (opened) return;
    opened = true;
    stage.style.transform = "";
    Music.play();
    intro.classList.add("opening");
    setTimeout(burst, 500);
    const k = reduce ? 0 : 1;
    setTimeout(() => intro.classList.add("zoom"), 2400 * k);
    setTimeout(() => intro.classList.add("leaving"), 3100 * k);
    setTimeout(() => {
      intro.hidden = true;
      document.body.classList.remove("locked");
      mBtn.classList.add("show");
      startReveal();
      if (CONFIG.autoScrollSpeed && !reduce) { sBtn.classList.add("show"); setTimeout(Auto.start, 2600); }
    }, 4200 * k);
  }
  $("#sealBtn").addEventListener("click", openInvite);
  intro.addEventListener("click", e => { if (!e.target.closest("#sealBtn")) openInvite(); });
  $("#sealBtn").focus({ preventScroll: true });

  /* ════════ Atmosphere: bokeh, gold dust, rose petals, blossoms ════════
     Every particle is pre-painted once into a small sprite; each frame only
     stamps sprites with drawImage, which keeps phones smooth. */
  const cv = $("#fx"), cx = cv.getContext("2d");
  const small = innerWidth < 600;
  let W, H, DPR, parts = [];
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    W = cv.width = Math.round(innerWidth * DPR); H = cv.height = Math.round(innerHeight * DPR);
  }
  resize(); addEventListener("resize", resize);
  const rnd = (a, b) => a + Math.random() * (b - a);
  function sprite(size, paint) {
    const c = document.createElement("canvas");
    c.width = c.height = Math.ceil(size);
    const g = c.getContext("2d");
    g.translate(size / 2, size / 2);
    paint(g, size / 2);
    return c;
  }
  const S = 2; // sprite supersampling
  const glow = sprite(24 * S, (g, r) => {
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
    gr.addColorStop(0, "rgba(255,240,205,1)"); gr.addColorStop(.18, "rgba(226,178,98,.95)");
    gr.addColorStop(.45, "rgba(255,220,160,.25)"); gr.addColorStop(1, "rgba(255,220,160,0)");
    g.fillStyle = gr; g.fillRect(-r, -r, r * 2, r * 2);
  });
  const orb = sprite(128, (g, r) => {
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
    gr.addColorStop(0, "rgba(255,236,200,.9)"); gr.addColorStop(.7, "rgba(255,220,170,.55)"); gr.addColorStop(1, "rgba(255,220,170,0)");
    g.fillStyle = gr; g.fillRect(-r, -r, r * 2, r * 2);
  });
  const petals = [["#fffaf2", "#f1dcc4"], ["#f7dccb", "#d9a98e"]].map(([c1, c2]) => sprite(40 * S, (g, R) => {
    const r = R * .62;
    g.shadowColor = "rgba(110,60,20,.28)"; g.shadowBlur = 5 * S; g.shadowOffsetY = 2 * S;
    const gr = g.createRadialGradient(0, -r * .4, r * .1, 0, 0, r * 1.2);
    gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(0, r * .9);
    g.bezierCurveTo(-r * 1.1, r * .2, -r * .8, -r * .95, 0, -r * .7);
    g.bezierCurveTo(r * .8, -r * .95, r * 1.1, r * .2, 0, r * .9);
    g.fill();
    g.shadowColor = "transparent";
    g.strokeStyle = "rgba(160,110,80,.2)"; g.lineWidth = .8 * S;
    g.beginPath(); g.moveTo(0, r * .8); g.quadraticCurveTo(r * .15, 0, 0, -r * .55); g.stroke();
  }));
  const bloomSprite = sprite(30 * S, (g, R) => {
    const r = R * .7;
    g.shadowColor = "rgba(120,70,20,.3)"; g.shadowBlur = 3 * S;
    g.fillStyle = "rgba(255,252,245,.97)";
    g.beginPath();
    for (let i = 0; i < 5; i++) { g.rotate(Math.PI * 2 / 5); g.ellipse(0, -r * .55, r * .32, r * .55, 0, 0, 6.283); }
    g.fill();
    g.shadowColor = "transparent";
    g.fillStyle = "rgba(214,166,88,.95)"; g.beginPath(); g.arc(0, 0, r * .18, 0, 6.283); g.fill();
  });
  function stamp(img, x, y, size, alpha = 1) {
    cx.globalAlpha = alpha;
    cx.drawImage(img, x - size / 2, y - size / 2, size, size);
  }

  const bokeh = () => ({ k: "o", x: rnd(0, W), y: rnd(0, H), r: rnd(20, 60) * DPR, vx: rnd(-.1, .1) * DPR, vy: rnd(-.12, -.03) * DPR, a: rnd(0, 6.28), s: rnd(.003, .008) });
  const dust = y => ({ k: "d", x: rnd(0, W), y: y ?? rnd(0, H), r: rnd(.6, 2) * DPR, vy: rnd(-.25, -.06) * DPR, vx: rnd(-.08, .08) * DPR, a: rnd(0, 6.28), s: rnd(.01, .035) });
  const petalP = y => ({ k: "p", x: rnd(0, W), y: y ?? rnd(-H, 0), r: rnd(7, 12) * DPR, vy: rnd(.45, .9) * DPR, vx: rnd(-.25, .25) * DPR, a: rnd(0, 6.28), s: rnd(.01, .025), rot: rnd(0, 6.28), vr: rnd(-.02, .02), tone: Math.random() < .55 ? 0 : 1 });
  const blos = y => ({ k: "f", x: rnd(0, W), y: y ?? rnd(-H, H), r: rnd(5, 9) * DPR, vy: rnd(.2, .5) * DPR, a: rnd(0, 6.28), s: rnd(.005, .015), rot: rnd(0, 6.28), vr: rnd(-.01, .01) });
  for (let i = 0; i < (small ? 5 : 9); i++) parts.push(bokeh());
  for (let i = 0; i < (small ? 34 : 64); i++) parts.push(dust());
  for (let i = 0; i < (small ? 8 : 14); i++) parts.push(petalP());
  for (let i = 0; i < (small ? 5 : 9); i++) parts.push(blos());
  function burst() {
    if (reduce) return;
    for (let i = 0; i < 90; i++) {
      const ang = rnd(0, 6.28), sp = rnd(1.5, 6.5) * DPR;
      parts.push({ k: "b", x: W / 2, y: H * .52, r: rnd(1, 2.8) * DPR, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2 * DPR, life: 1 });
    }
    for (let i = 0; i < 16; i++) {
      const p = petalP(H * .5); p.x = W / 2 + rnd(-30, 30) * DPR; p.vx = rnd(-3, 3) * DPR; p.vy = rnd(-4, -1.5) * DPR; p.burst = true;
      parts.push(p);
    }
  }
  function draw() {
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.k === "o") {
        p.x += p.vx; p.y += p.vy; p.a += p.s;
        if (p.y < -p.r) { p.y = H + p.r; p.x = rnd(0, W); }
        stamp(orb, p.x, p.y, p.r * 2, .08 + .07 * Math.sin(p.a));
      } else if (p.k === "d") {
        p.x += p.vx; p.y += p.vy; p.a += p.s;
        if (p.y < -10) Object.assign(p, dust(H + 10));
        stamp(glow, p.x, p.y, p.r * 7, .35 + .55 * (0.5 + 0.5 * Math.sin(p.a)));
      } else if (p.k === "p") {
        p.a += p.s; p.rot += p.vr;
        if (p.burst) { p.vy += .06 * DPR; p.vx *= .985; if (p.vy > .9 * DPR) { p.vy = .9 * DPR; p.burst = false; } }
        p.x += p.vx + Math.sin(p.a) * .7 * DPR; p.y += p.vy;
        if (p.y > H + 30) { if (parts.length > 200) { parts.splice(i, 1); continue; } Object.assign(p, petalP(-30)); }
        const c = Math.cos(p.rot), sn = Math.sin(p.rot), fx = Math.cos(p.a * 1.7), fy = .75 + .25 * Math.sin(p.a * 2.3);
        cx.globalAlpha = 1;
        cx.setTransform(c * fx, sn * fx, -sn * fy, c * fy, p.x, p.y);
        const size = p.r * 3.2;
        cx.drawImage(petals[p.tone], -size / 2, -size / 2, size, size);
        cx.setTransform(1, 0, 0, 1, 0, 0);
      } else if (p.k === "f") {
        p.a += p.s; p.rot += p.vr;
        p.x += Math.sin(p.a) * .4 * DPR; p.y += p.vy;
        if (p.y > H + 20) Object.assign(p, blos(-20));
        const c = Math.cos(p.rot), sn = Math.sin(p.rot);
        cx.globalAlpha = 1;
        cx.setTransform(c, sn, -sn, c, p.x, p.y);
        const size = p.r * 3;
        cx.drawImage(bloomSprite, -size / 2, -size / 2, size, size);
        cx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        p.x += p.vx; p.y += p.vy; p.vy += .06 * DPR; p.vx *= .98; p.life -= .012;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        stamp(glow, p.x, p.y, p.r * 8, p.life);
      }
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  if (!reduce) requestAnimationFrame(draw);
})();
