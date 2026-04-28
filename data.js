// ─── Sahayak Shared Data & Utilities ───────────────────────────────────────

const API_BASE = 'http://localhost:8080';
const WORKERS_KEY = 'sahayak_workers';
const REQUESTS_KEY = 'sahayak_requests';
const USER_KEY = 'sahayak_user';

const STATIC_SOCIETIES = [
  "42 Parkview","Aaron Elinor 51","Aahvan Greens (Gopinath)","Aahvan Greens",
  "Aasthavilla Bungalows","Aditi Shri Hari Sky","Akash Elegance","Akshar iLand",
  "Akshat Hazel","Amogha","Anamaya Apartments","Ananta Elegance","Anantara Abode",
  "Anantara Alora","Anantara Imperial","Arjun Sky Life","Aurum Legacy (Shafalya)",
  "Avadh Dreamland","Avirat Silver Altezza","Beryl Crystal (Krushnam)","Binori Aristella",
  "Cloud 7","Deep Indraprasth Shivanta","Dhara Group Kasturi III","Dream Vianna",
  "Empire Sky Epitome","Empire Skyline","Empire Skypark","Essence-51","Galaxy Signature",
  "Ganesh Maple Country","Harmony Harikesh (Mahaprabhu)","Harmony Harikesh","Harmony Heights",
  "Highline by AG Group","HRG Verantes 22","Kalhaar Exotica","Keshav Stateland (Stateland)",
  "Krishna Castle","Laxmi One01","Lionarch The Altitude","Magnate Impression",
  "Mangalam Nirvana 2","Map Celebration","NB Legacy Tower","NB Palm",
  "New Horizon The August","Nidhi Infracon Kuber Residency","Nityam Harmony (Balaji)",
  "Nityam Harmony","Omkar Vivanta Heights","Oryn Armonia","Parvati Arcadia",
  "Pratham Heights (Shanu Buildcon)","Pratham Heights","Pratham Lakeview",
  "Prasthan Pride Image","Prayasam Green","Pride Icon","Rhythm Gladeview",
  "RM Hir Asha Shine","Rudram Skyline","Sachet Vedant Shreeji Enclave","Saga Enstin Evoq",
  "Sahaj One","Sahashya Skyzenia","Samatva Amaryllis","Sankalp Bunglows","Sankalp Grace 3",
  "Sankalp Homes","Sapphire Veronica","Saral Casa","Sarvasva Abode","Sarvam Solo Bliss 2",
  "Satyamev Elysium","Saumya Bunglows","Saumya Residency (Behind Shakan-6)","Saumya Society",
  "Sentosa Bungalows","Serenity Casa","Serenity Lavish","Seventh Stark Torre",
  "Shafalya Veridian","Shafalya Vermillion","Shakti Elegance","Shantikunj Bliss",
  "Shashidhar Falak Citadel","Sheetal Dharohar","Shilp Blossom Luxuria","Shilp Paradise",
  "Shivalay Heights","Shivay Swam Residencia","Shree Radha Madhav Residency",
  "Shree Shakti Satva Bliss","Shree Sharan","Shreekar Celestial Living","Shrimleela Evoq",
  "Shrinivas Supercity Joy","Shrinivas Supercity Luxuria","Shrikunj Sky",
  "Shubh Villa (Shanti Developers)","Sivesta Retreat","Sky Enclave","Sky Reventa (Vivaan)",
  "Sky Scape","Skydeck Seasons","Skyview","Skyang Shree Green Villa","Skyzenia",
  "Sparsh Residency (Four Seasons)","Spartan Group Projects","Stark Torre (Seventh Stark)",
  "Stateland (Keshav Stateland)","Status 55","Sthapatya Elysian","Sthapatya Pratham Lakeview",
  "Sudarshan Grace","Sudarshan Status","Sun Urban Park","Super Bungalows","Supercity Dream",
  "Supercity Lifestyle Township (Includes Pride, Glory, Grand, & Luxuria clusters)",
  "Swam Symphony","Swastik Divine","The Gold by Samor","The Gold Skyvilla","The Skyler",
  "The Sovereign","Tulsi Bungalows","Unique Luxuria","V Square Dev Bungalows",
  "V Square Vedant Kadam","Veer Vertis One","Venus Ultima","Veritas","Vivaan Sky Revanta",
  "Westside Heights"
];

const JOB_TYPES = ["Maid","Cook","Cleaner","Driver","Electrician","Plumber","Gardener","Babysitter","Security Guard","Carpenter","Painter","Pest Control"];

// ── User ──────────────────────────────────────────────────────────────────
function getCurrentUser() {
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
}

function requireLogin() {
  if (!getCurrentUser()) { window.location.href = 'index.html'; }
}

// ── Workers ───────────────────────────────────────────────────────────────
function getWorkers() {
  return JSON.parse(localStorage.getItem(WORKERS_KEY) || '[]');
}

function saveWorker(data) {
  const workers = getWorkers();
  const existing = workers.findIndex(w => w.phone === data.phone);
  const worker = { id: existing >= 0 ? workers[existing].id : Date.now(), ...data, updatedAt: Date.now() };
  if (existing >= 0) workers[existing] = worker;
  else workers.push(worker);
  localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
  return worker;
}

function getWorkerByPhone(phone) {
  return getWorkers().find(w => w.phone === phone) || null;
}

function searchWorkers(societyQuery, jobQuery) {
  const workers = getWorkers();
  const sq = (societyQuery || '').toLowerCase().trim();
  const jq = (jobQuery || '').toLowerCase().trim();
  return workers.filter(w => {
    const societies = (w.societies || []).map(s => s.toLowerCase());
    const societyMatch = !sq || societies.some(s => s.includes(sq));
    const jobMatch = !jq || (w.jobTypes || []).some(j => j.toLowerCase().includes(jq));
    return societyMatch && jobMatch;
  });
}

// ── Hire Requests ─────────────────────────────────────────────────────────
function getRequests() {
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
}

function saveRequest(req) {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === req.id);
  if (idx >= 0) requests[idx] = req;
  else requests.push({ ...req, id: req.id || Date.now(), createdAt: Date.now() });
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function getRequestsForWorker(workerPhone) {
  return getRequests().filter(r => r.workerPhone === workerPhone);
}

function getRequestsForHirer(hirerPhone) {
  return getRequests().filter(r => r.hirerPhone === hirerPhone);
}

function updateRequestStatus(reqId, status) {
  const requests = getRequests();
  const req = requests.find(r => r.id === reqId);
  if (req) { req.status = status; req.updatedAt = Date.now(); localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests)); }
  return req;
}

// ── Societies ─────────────────────────────────────────────────────────────
function getAllSocieties() {
  const dynamic = getWorkers().flatMap(w => w.societies || []).filter(Boolean);
  return [...new Set([...STATIC_SOCIETIES, ...dynamic])].sort();
}

// ── Autocomplete ──────────────────────────────────────────────────────────
function initAutocomplete(inputId, suggestionsId, getList) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(suggestionsId);
  if (!input || !box) return;

  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    box.innerHTML = '';
    if (!q) { box.style.display = 'none'; return; }
    const matches = getList().filter(s => s.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) { box.style.display = 'none'; return; }
    matches.forEach(m => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = m.replace(new RegExp(`(${q})`, 'gi'), '<strong>$1</strong>');
      item.addEventListener('click', () => { input.value = m; box.style.display = 'none'; });
      box.appendChild(item);
    });
    box.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete-wrapper')) box.style.display = 'none';
  });
}

// ── Time ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
