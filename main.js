/* ============================
   JATIN KUMAR – PORTFOLIO JS
   ============================ */

// ── FOOTER YEAR ──────────────────────────────────────────
document.getElementById('footer-year').textContent =
  `© ${new Date().getFullYear()} Jatin Kumar. All rights reserved.`;

// ── CUSTOM CURSOR ─────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

// Smooth ring follow
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .flip-card, .tag, .contact-card, .cp-verify-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── NAVBAR ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinksEl.classList.remove('open'))
);

// ── THREE.JS HERO ─────────────────────────────────────────
(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  /* -- Torus Knot (main centrepiece) -- */
  const torusGeo = new THREE.TorusKnotGeometry(5, 1.2, 128, 20, 2, 3);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x5B23FF,
    emissive: 0x008BFF,
    emissiveIntensity: 0.18,
    metalness: 0.75,
    roughness: 0.25,
    wireframe: false,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torus);

  /* -- Wireframe overlay -- */
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xE4FF30, wireframe: true, transparent: true, opacity: 0.08 });
  const wire = new THREE.Mesh(torusGeo, wireMat);
  scene.add(wire);

  /* -- Particle field -- */
  const PARTICLES = 1800;
  const pPositions = new Float32Array(PARTICLES * 3);
  for (let i = 0; i < PARTICLES; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 80;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.35 });
  scene.add(new THREE.Points(pGeo, pMat));

  /* -- Lights -- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const pointA = new THREE.PointLight(0x008BFF, 2.5, 60);
  pointA.position.set(10, 10, 10);
  scene.add(pointA);
  const pointB = new THREE.PointLight(0xE4FF30, 1.2, 60);
  pointB.position.set(-10, -8, -5);
  scene.add(pointB);
  const pointC = new THREE.PointLight(0x5B23FF, 2, 60);
  pointC.position.set(0, -12, 8);
  scene.add(pointC);

  /* -- Mouse parallax -- */
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  /* -- Animate -- */
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    torus.rotation.x = 0.3 * t + targetY * 0.5;
    torus.rotation.y = 0.2 * t + targetX * 0.5;
    wire.rotation.x = torus.rotation.x;
    wire.rotation.y = torus.rotation.y;

    // Pulsing emissive
    torusMat.emissiveIntensity = 0.12 + 0.06 * Math.sin(t * 2);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ── TYPEWRITER ────────────────────────────────────────────
(function typewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'CS Undergraduate',
    'Problem Solver',
    'AI/ML Enthusiast',
    'Competitive Programmer',
    'Full-Stack Developer',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
})();

// ── INTERSECTION OBSERVER for reveal ──────────────────────
const revealEls = document.querySelectorAll('.reveal, .timeline-item, .edu-card');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el, target, duration = 1400, suffix = '') {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── SVG RING ANIMATION ────────────────────────────────────
function animateRingSVG(id, percent) {
  const circ = 2 * Math.PI * 50; // r=50 → ~314
  const offset = circ * (1 - Math.min(percent, 1));
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => { el.style.strokeDashoffset = offset; }, 300);
  }
}

// ── DIFF BARS ─────────────────────────────────────────────
function animateBar(id, percent) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => { el.style.width = Math.min(percent * 100, 100) + '%'; }, 400);
}

// ── LEETCODE API (multi-endpoint fallback) ────────────────
async function fetchLeetCode() {
  const USERNAME = 'JKByteCrafter';
  const lcTotal = document.getElementById('lc-total');
  const lcEasy = document.getElementById('lc-easy');
  const lcMed = document.getElementById('lc-med');
  const lcHard = document.getElementById('lc-hard');
  const lcStatus = document.getElementById('lc-status');

  function apply(total, easy, medium, hard) {
    animateCounter(lcTotal, total);
    animateCounter(lcEasy, easy);
    animateCounter(lcMed, medium);
    animateCounter(lcHard, hard);
    animateRingSVG('lc-ring', total / 3000);
    const mx = Math.max(easy, medium, hard, 1);
    animateBar('lc-easy-bar', easy / mx);
    animateBar('lc-med-bar', medium / mx);
    animateBar('lc-hard-bar', hard / mx);
    lcStatus.textContent = '✓ Live – updated just now';
    lcStatus.style.color = '#E4FF30';
    document.getElementById('lc-card')?.classList.add('data-loaded');
  }

  // Endpoint 1: leetcode-stats-api.herokuapp.com (usually has CORS headers)
  try {
    const r = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'success' && d.totalSolved > 0) {
        apply(d.totalSolved, d.easySolved, d.mediumSolved, d.hardSolved);
        return;
      }
    }
  } catch (_) { }

  // Endpoint 2: allorigins.win CORS proxy → LeetCode GraphQL
  // Fetches server-side so CORS is bypassed — works from file:// too
  try {
    const gqlBody = JSON.stringify({
      query: `{ matchedUser(username:"${USERNAME}") { submitStatsGlobal { acSubmissionNum { difficulty count } } } }`
    });
    const target = encodeURIComponent('https://leetcode.com/graphql');
    const r = await fetch(`https://api.allorigins.win/raw?url=${target}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: gqlBody,
      signal: AbortSignal.timeout(9000),
    });
    if (r.ok) {
      const d = await r.json();
      const nums = d?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
      if (Array.isArray(nums) && nums.length) {
        const get = (diff) => (nums.find(x => x.difficulty === diff) || {}).count || 0;
        const total = get('All'), easy = get('Easy'), medium = get('Medium'), hard = get('Hard');
        if (total > 0) { apply(total, easy, medium, hard); return; }
      }
    }
  } catch (_) { }

  // Endpoint 3: alfa-leetcode-api.onrender.com (cold-start ~12s on free tier)
  try {
    const r = await fetch(
      `https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`,
      { signal: AbortSignal.timeout(13000) }
    );
    if (r.ok) {
      const d = await r.json();
      const total = d.solvedProblem ?? d.totalSolved ?? 0;
      const easy = d.easySolved ?? 0;
      const medium = d.mediumSolved ?? 0;
      const hard = d.hardSolved ?? 0;
      if (total > 0) { apply(total, easy, medium, hard); return; }
    }
  } catch (_) { }

  // Fallback: last-known cached values
  apply(275, 120, 120, 35);
  lcStatus.textContent = '⚠ Cached – live APIs unreachable';
  lcStatus.style.color = '#a09cc0';
}


// ── CODEFORCES API ────────────────────────────────────────
async function fetchCodeforces() {
  const HANDLE = 'jatinkumar15002';
  const INFO_URL = `https://codeforces.com/api/user.info?handles=${HANDLE}`;
  const STATUS_URL = `https://codeforces.com/api/user.status?handle=${HANDLE}&from=1&count=10000`;

  const cfRating = document.getElementById('cf-rating');
  const cfRank = document.getElementById('cf-rank');
  const cfMaxRating = document.getElementById('cf-max-rating');
  const cfSolved = document.getElementById('cf-solved');
  const cfStatus = document.getElementById('cf-status');

  try {
    const [infoRes, statusRes] = await Promise.all([
      fetch(INFO_URL, { signal: AbortSignal.timeout(8000) }),
      fetch(STATUS_URL, { signal: AbortSignal.timeout(10000) })
    ]);

    if (!infoRes.ok) throw new Error('CF info error');
    const info = await infoRes.json();
    if (info.status !== 'OK') throw new Error('CF API error');

    const user = info.result[0];
    const rating = user.rating || 0;
    const maxRating = user.maxRating || 0;
    const rank = user.rank || '–';

    animateCounter(cfRating, rating);
    animateCounter(cfMaxRating, maxRating);
    cfRank.textContent = rank.charAt(0).toUpperCase() + rank.slice(1);

    // Ring: CF rating scale 0–2000 at ~100%
    animateRingSVG('cf-ring', rating / 2000);

    // Solved problems from submissions
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === 'OK') {
        const solved = new Set(
          statusData.result
            .filter(s => s.verdict === 'OK')
            .map(s => `${s.problem.contestId}-${s.problem.index}`)
        );
        animateCounter(cfSolved, solved.size);
      } else {
        cfSolved.textContent = '–';
      }
    }

    cfStatus.textContent = '✓ Live – updated just now';
    cfStatus.style.color = '#22c55e';
    document.getElementById('cf-card').classList.add('data-loaded');

  } catch (err) {
    // Fallback
    animateCounter(cfRating, 1138);
    animateCounter(cfMaxRating, 1138);
    cfRank.textContent = 'Pupil';
    animateRingSVG('cf-ring', 1138 / 2000);
    cfSolved.textContent = '–';
    cfStatus.textContent = '⚠ Cached – API unreachable';
    cfStatus.style.color = '#fbbf24';
  }
}

// ── GITHUB API ─────────────────────────────────────────
async function fetchGitHub() {
  const USERNAME = 'JKBYTEcrafter';
  const USER_URL = `https://api.github.com/users/${USERNAME}`;
  const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100`;

  const ghRepos = document.getElementById('gh-repos');
  const ghReposMini = document.getElementById('gh-repos-mini');
  const ghFollowers = document.getElementById('gh-followers');
  const ghFollowersMini = document.getElementById('gh-followers-mini');
  const ghFollowing = document.getElementById('gh-following');
  const ghStars = document.getElementById('gh-stars');
  const ghStatus = document.getElementById('gh-status');

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(USER_URL, { signal: AbortSignal.timeout(8000) }),
      fetch(REPOS_URL, { signal: AbortSignal.timeout(8000) })
    ]);

    if (!userRes.ok) throw new Error('GitHub user error');
    const user = await userRes.json();

    const repos = user.public_repos || 0;
    const followers = user.followers || 0;
    const following = user.following || 0;

    animateCounter(ghRepos, repos);
    if (ghReposMini) animateCounter(ghReposMini, repos);
    animateCounter(ghFollowers, followers);
    if (ghFollowersMini) animateCounter(ghFollowersMini, followers);
    animateCounter(ghFollowing, following);

    // Ring: treat 30 repos as ~100%
    animateRingSVG('gh-ring', repos / 30);

    // Total stars from all repos
    if (reposRes.ok) {
      const repoList = await reposRes.json();
      if (Array.isArray(repoList)) {
        const totalStars = repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        animateCounter(ghStars, totalStars);
      }
    } else {
      if (ghStars) ghStars.textContent = '–';
    }

    if (ghStatus) {
      ghStatus.textContent = '✓ Live – updated just now';
      ghStatus.style.color = '#AACDDC';
    }
    document.getElementById('gh-card')?.classList.add('data-loaded');

  } catch (err) {
    if (ghRepos) ghRepos.textContent = '–';
    if (ghReposMini) ghReposMini.textContent = '–';
    if (ghFollowers) ghFollowers.textContent = '–';
    if (ghFollowersMini) ghFollowersMini.textContent = '–';
    if (ghFollowing) ghFollowing.textContent = '–';
    if (ghStars) ghStars.textContent = '–';
    if (ghStatus) {
      ghStatus.textContent = '⚠ Could not reach GitHub API';
      ghStatus.style.color = '#D2C4B4';
    }
  }
}

// ── TRIGGER APIs WHEN COMPETITIVE SECTION IS VISIBLE ─────
let cpFetched = false;
const cpSection = document.getElementById('competitive');
const cpObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !cpFetched) {
    cpFetched = true;
    fetchLeetCode();
    fetchCodeforces();
    fetchGitHub();
    cpObs.disconnect();
  }
}, { threshold: 0.2 });
cpObs.observe(cpSection);

// Also fetch GitHub early for about section mini-stats
fetchGitHub();

// ── 3D TILT ON PROJECT CARDS ──────────────────────────────
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Don't tilt once flipped
    if (!card.querySelector('.flip-card-inner').style.transform) {
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── SKILL TAG GLOW BURST ──────────────────────────────────
const colorMap = { coral: '#5B23FF', cyan: '#008BFF', purple: '#E4FF30', yellow: '#a09cc0' };
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    const c = colorMap[tag.dataset.color] || '#fff';
    tag.style.boxShadow = `0 0 16px ${c}66`;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});

// ── CONTACT EMAIL COPY ────────────────────────────────────
document.getElementById('email-card')?.addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard.writeText('jatinkumar15002@gmail.com').then(() => {
    const orig = e.currentTarget.querySelector('span').textContent;
    e.currentTarget.querySelector('span').textContent = '✓ Email copied!';
    setTimeout(() => { e.currentTarget.querySelector('span').textContent = orig; }, 2000);
  });
});
