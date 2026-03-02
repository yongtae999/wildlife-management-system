// DOM Elements
const modeSwitcher = document.getElementById('mode-switcher');
const hunterApp = document.getElementById('hunter-app');
const officialDashboard = document.getElementById('official-dashboard');
const hunterContent = document.getElementById('hunter-content');
const dashboardContent = document.getElementById('dashboard-content');
const pageTitle = document.getElementById('page-title');

// State
let currentMode = 'hunter'; // 'hunter' or 'official'

// Initialize
function init() {
    setupModeSwitcher();
    setupNavigation();
    renderHunterHome(); // Default start screen
    renderDashboardHome(); // Default dashboard screen
}

// Mode Switcher Logic
function setupModeSwitcher() {
    modeSwitcher.addEventListener('click', (e) => {
        if (e.target.classList.contains('mode-btn')) {
            const mode = e.target.dataset.mode;
            switchMode(mode);
        }
    });
}

function switchMode(mode) {
    currentMode = mode;

    // Update Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Toggle Containers
    if (mode === 'hunter') {
        hunterApp.classList.add('active');
        officialDashboard.classList.remove('active');
        document.body.style.backgroundColor = '#333'; // Match mobile background
    } else {
        hunterApp.classList.remove('active');
        officialDashboard.classList.add('active');
        document.body.style.backgroundColor = '#e0e0e0'; // Match dashboard background
    }
}

// Navigation Logic (Both App & Dashboard)
function setupNavigation() {
    // Hunter App Bottom Nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.dataset.target;
            handleHunterNavigation(target);
        });
    });

    // Official Dashboard Sidebar
    document.querySelectorAll('.side-menu li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.side-menu li').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.dataset.target;
            handleDashboardNavigation(target);
        });
    });
}

// Hunter App Screens
function handleHunterNavigation(target) {
    console.log(`Navigating Hunter App to: ${target}`);
    if (target === 'safety') renderHunterHome();
    if (target === 'report') renderHunterForm();
    if (target === 'history') renderHunterHistory();
}

// Safety Radar Logic
let isTracking = false;
let trackingTimer = null;
let secondsElapsed = 0;

function renderHunterHome() {
    const activeClass = isTracking ? 'active' : '';
    const btnText = isTracking ? 'STOP' : 'START';
    const subText = isTracking ? 'Touch to Stop' : 'Touch to Start';
    const statusMsg = isTracking ? 'Safe within 200m' : 'Safety Radar Off';
    const timeStr = formatTime(secondsElapsed);

    hunterContent.innerHTML = `
        <div class="safety-screen ${activeClass}">
            <div class="radar-container">
                <div class="ripple"></div>
                <div class="ripple"></div>
                <button id="radar-btn" class="radar-btn">
                    ${btnText}
                    <span>${subText}</span>
                </button>
            </div>
            <div class="status-text">${statusMsg}</div>
            
            ${isTracking ? `<div class="timer-display">${timeStr}</div>` : ''}
            
            <div class="location-info">
                <p><i class="fas fa-map-marker-alt"></i> Wonju-si, Gangwon-do</p>
                <p><i class="fas fa-satellite"></i> GPS Accuracy: High</p>
            </div>
        </div>
    `;

    // Re-attach listener since we rewrote innerHTML
    document.getElementById('radar-btn').addEventListener('click', toggleRadar);
}

function toggleRadar() {
    isTracking = !isTracking;
    if (isTracking) {
        startTimer();
    } else {
        stopTimer();
    }
    renderHunterHome(); // Re-render to update UI
}

function startTimer() {
    if (trackingTimer) clearInterval(trackingTimer);
    secondsElapsed = 0;
    trackingTimer = setInterval(() => {
        secondsElapsed++;
        // Update timer only if element exists (optimization)
        const timerEl = document.querySelector('.timer-display');
        if (timerEl) timerEl.textContent = formatTime(secondsElapsed);
    }, 1000);
}

function stopTimer() {
    if (trackingTimer) clearInterval(trackingTimer);
    secondsElapsed = 0;
}

function formatTime(totalSeconds) {
    const pad = (n) => n.toString().padStart(2, '0');
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function renderHunterForm() {
    const today = new Date().toLocaleString('ko-KR');

    hunterContent.innerHTML = `
        <div class="capture-form">
            <div class="photo-upload-area" onclick="document.getElementById('file-input').click()">
                <i class="fas fa-camera"></i>
                <span>Tap to Take Photo / Upload</span>
                <input type="file" id="file-input" style="display: none" accept="image/*" onchange="alert('Photo selected (mock)')">
            </div>

            <div class="form-group">
                <label class="form-label">
                    Date/Time <i class="fas fa-magic auto-filled-icon"></i>
                </label>
                <input type="text" class="form-input" value="${today}" readonly>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Location <i class="fas fa-magic auto-filled-icon"></i>
                </label>
                <input type="text" class="form-input" value="N36° 29' 15.4, E127° 16' 48.2" readonly>
                <input type="text" class="form-input" value="Gangwon-do Cheorwon-gun Gimhwa-eup" readonly style="margin-top:5px; font-size:12px; color:#aaa">
            </div>

            <div class="form-group">
                <label class="form-label">Species</label>
                <select class="form-select">
                    <option>Wild Boar (멧돼지)</option>
                    <option>Elk (고라니)</option>
                    <option>Pheasant (꿩)</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Method</label>
                <select class="form-select">
                    <option>Gun Capture (총기 포획)</option>
                    <option>Trap (올무/덫)</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Disposal</label>
                <select class="form-select">
                    <option>Rendering (렌더링)</option>
                    <option>Burial (매몰)</option>
                    <option>Incineration (소각)</option>
                </select>
            </div>

            <button class="submit-btn" onclick="alert('Submission Sent! (Simulator)')">Submit Report</button>
        </div>
    `;
}

function renderHunterHistory() {
    const historyData = [
        { id: 1, species: 'Wild Boar (멧돼지)', date: '2026.01.14 08:30:15', status: 'Approved', location: 'N36° 29\' 15.4", E127° 16\' 48.2"', address: 'Gangwon-do Cheorwon-gun Gimhwa-eup 100-1', method: 'Rendering (렌더링)', hunter: 'Hong Gil-dong', tool: 'Rifle (엽총)' },
        { id: 2, species: 'Elk (고라니)', date: '2026.01.12 14:20:05', status: 'Pending', location: 'N36° 25\' 10.1", E127° 10\' 22.5"', address: 'Gangwon-do Wonju-si Panbu-myeon', method: 'Burial (매몰)', hunter: 'Hong Gil-dong', tool: 'Trap (올무)' }
    ];

    let html = '<div class="history-list">';
    historyData.forEach(item => {
        const statusClass = item.status === 'Approved' ? 'approved' : 'pending';
        html += `
            <div class="history-item" onclick="showCaptureDetail(${item.id})">
                <div class="history-info">
                    <h3>${item.species}</h3>
                    <p>${item.date}</p>
                </div>
                <div class="status-badge ${statusClass}">${item.status}</div>
            </div>
        `;
    });
    html += '</div>';
    hunterContent.innerHTML = html;
}

// Make this global so it can be called from onclick
window.showCaptureDetail = function (id) {
    // Mock Data Lookup (In real app, fetch by ID)
    const historyData = [
        { id: 1, species: 'Wild Boar (멧돼지)', date: '2026.01.14 08:30:15', status: 'Approved', location: 'N36° 29\' 15.4", E127° 16\' 48.2"', address: 'Gangwon-do Cheorwon-gun Gimhwa-eup 100-1', method: 'Rendering (렌더링)', hunter: 'Hong Gil-dong', tool: 'Rifle (엽총)' },
        { id: 2, species: 'Elk (고라니)', date: '2026.01.12 14:20:05', status: 'Pending', location: 'N36° 25\' 10.1", E127° 10\' 22.5"', address: 'Gangwon-do Wonju-si Panbu-myeon', method: 'Burial (매몰)', hunter: 'Hong Gil-dong', tool: 'Trap (올무)' }
    ];
    const item = historyData.find(d => d.id === id);
    if (!item) return;

    hunterContent.innerHTML = `
        <div class="detail-card">
            <div class="detail-photo">
                <span class="timestamp-overlay">${item.date}</span>
            </div>
            <div class="detail-content">
                <div class="detail-row">
                    <i class="fas fa-paw"></i>
                    <div>
                        <span class="detail-label">Species</span>
                        <span class="detail-value">${item.species}</span>
                    </div>
                </div>
                <div class="detail-row">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="detail-label">Time</span>
                        <span class="detail-value">${item.date}</span>
                    </div>
                </div>
                <div class="detail-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${item.location}</span>
                    </div>
                </div>
                 <div class="detail-row">
                    <i class="fas fa-home"></i>
                    <div>
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${item.address}</span>
                    </div>
                </div>
                <div class="detail-row">
                    <i class="fas fa-fire"></i>
                    <div>
                        <span class="detail-label">Disposal Method</span>
                        <span class="detail-value">${item.method}</span>
                    </div>
                </div>
                <div class="detail-row">
                    <i class="fas fa-user"></i>
                    <div>
                        <span class="detail-label">Hunter</span>
                        <span class="detail-value">${item.hunter}</span>
                    </div>
                </div>
                 <div class="detail-row">
                    <i class="fas fa-tools"></i>
                    <div>
                        <span class="detail-label">Tool</span>
                        <span class="detail-value">${item.tool}</span>
                    </div>
                </div>
            </div>
        </div>
        <button onclick="renderHunterHistory()" class="mode-btn" style="width:100%">Back to List</button>
    `;
};

// Dashboard Screens
function handleDashboardNavigation(target) {
    console.log(`Navigating Dashboard to: ${target}`);

    // Update Title
    const titleMap = {
        'capture-reports': '포획신고내역',
        'user-registration': '사용자등록',
        'statistics': '통계',
        'notifications': '알림기능',
        'settings': '환경설정'
    };
    if (titleMap[target]) pageTitle.textContent = titleMap[target];

    // Render Content
    if (target === 'capture-reports') renderCaptureReports();
    else dashboardContent.innerHTML = `<p>${titleMap[target]} 화면 준비중...</p>`;
}


function renderCaptureReports() {
    const mockData = [
        { no: 1, name: 'Hong Gil-dong', dob: '800101', phone: '010-1234-5678', time: '2026-01-14 08:30', location: 'Gangwon-do Cheorwon-gun...', animal: 'Wild Boar', method: 'Gun', sex: 'Male', weight: '80kg', note: '-' },
        { no: 2, name: 'Hong Gil-dong', dob: '800101', phone: '010-1234-5678', time: '2026-01-12 14:20', location: 'Gangwon-do Wonju-si...', animal: 'Elk', method: 'Trap', sex: 'Female', weight: '45kg', note: '-' },
        { no: 3, name: 'Kim Chul-soo', dob: '750505', phone: '010-9876-5432', time: '2026-01-10 09:15', location: 'Gangwon-do Inje-gun...', animal: 'Wild Boar', method: 'Gun', sex: 'Male', weight: '95kg', note: 'Large' },
    ];

    dashboardContent.innerHTML = `
        <div class="dashboard-controls">
            <div class="search-bar">
                <input type="date" class="search-input">
                <span>~</span>
                <input type="date" class="search-input">
                <input type="text" class="search-input" placeholder="Search by Name, Region...">
                <button class="btn-action btn-dark-green"><i class="fas fa-search"></i></button>
            </div>
            <div class="action-buttons">
                <button class="btn-action btn-green" onclick="alert('Open Write Modal')"><i class="fas fa-pen"></i> Write Report</button>
                <button class="btn-action btn-green" onclick="alert('Generate Legal Form Simulated')"><i class="fas fa-file-contract"></i> Generate Legal Form</button>
                <button class="btn-action btn-dark-green" onclick="alert('Excel Download Simulated')"><i class="fas fa-file-excel"></i> Download Excel</button>
            </div>
        </div>

        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>DOB</th>
                        <th>Phone</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Animal</th>
                        <th>Method</th>
                        <th>Sex</th>
                        <th>Weight/Len</th>
                        <th>Note</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.map(row => `
                        <tr>
                            <td>${row.no}</td>
                            <td>${row.name}</td>
                            <td>${row.dob}</td>
                            <td>${row.phone}</td>
                            <td>${row.time}</td>
                            <td>${row.location}</td>
                            <td>${row.animal}</td>
                            <td>${row.method}</td>
                            <td>${row.sex}</td>
                            <td>${row.weight}</td>
                            <td>${row.note}</td>
                            <td>
                                <button class="btn-action btn-green btn-sm" onclick="showDashboardDetail(${row.no})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div id="dashboard-modal-container"></div>
    `;
}

// Make global for existing renderHunterHistory
window.renderHunterHistory = renderHunterHistory;

window.showDashboardDetail = function (id) {
    const modalContainer = document.getElementById('dashboard-modal-container');
    modalContainer.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
            <div style="background:white; padding:20px; border-radius:10px; width:500px; max-width:90%; position:relative;">
                <h3 style="margin-top:0;">Capture Detail (ID: ${id})</h3>
                <div style="height:200px; background:#eee; margin:10px 0; display:flex; justify-content:center; align-items:center; color:#888;">
                    <i class="fas fa-map-marked-alt" style="font-size:40px;"></i>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:14px;">
                    <div><strong>Hunter:</strong> Hong Gil-dong</div>
                    <div><strong>Species:</strong> Wild Boar</div>
                    <div><strong>Location:</strong> N36° 29' 15.4"</div>
                    <div><strong>Time:</strong> 2026-01-14 08:30</div>
                </div>
                <div style="text-align:right; margin-top:20px;">
                    <button class="btn-action btn-green" onclick="document.getElementById('dashboard-modal-container').innerHTML=''">Close</button>
                </div>
            </div>
        </div>
    `;
};

// Start App
document.addEventListener('DOMContentLoaded', init);
