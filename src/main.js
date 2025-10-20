import GameEngine from './GameEngine.js';

const game = new GameEngine();
let allTeamsData = null;

// --- UI Rendering ---
const renderUI = () => {
    if (game.state.gameState !== 'ready') return;
    
    const userTeam = game.getUserTeam();
    document.getElementById('teamInfo').innerHTML = `<p class="text-lg font-bold">${userTeam?.city || ''} ${userTeam?.name || 'No Team'}</p>`;
    
    // Update Phase and Week/Year Display
    const phase = game.state.currentPhase || 'setup';
    const week = game.state.currentWeek;
    const year = game.state.currentYear;
    const advanceBtn = document.getElementById('advanceWeekBtn');
    
    document.getElementById('phaseDisplay').textContent = phase.replace('_', ' ');
    
    if (phase === 'offseason') {
        document.getElementById('weekYearDisplay').textContent = `Year: ${year}`;
        advanceBtn.textContent = 'Start Season';
    } else {
        document.getElementById('weekYearDisplay').textContent = `Week: ${week} | Year: ${year}`;
        advanceBtn.textContent = 'Advance Week';
    }

    // Render current view
    const view = game.state.view;
    const viewContainer = document.getElementById('viewContainer');
    if (view === 'home') viewContainer.innerHTML = `<div class="bg-gray-800 p-6 rounded-lg"><h2>Welcome, Coach!</h2><p>Select a view from the sidebar.</p></div>`;
    else if (view === 'roster') renderRoster();
    else if (view === 'staff') renderStaff();
    else if (view === 'depthChart') renderDepthChart();
    else if (view === 'standings') renderStandings();
    else if (view === 'schedule') renderSchedule();
};

const renderRoster = () => {
    const players = game.getTeamPlayers(game.state.userTeamId);
    document.getElementById('viewContainer').innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">Team Roster</h2>
            <div class="table-container">
                <table class="w-full text-left">
                    <thead><tr class="bg-gray-700">
                        <th class="p-4 rounded-tl-lg">Name</th><th class="p-4">POS</th><th class="p-4">Age</th><th class="p-4 rounded-tr-lg">OVR</th>
                    </tr></thead>
                    <tbody>${players.map(p => `
                        <tr class="border-t border-gray-700">
                            <td class="p-4">${p.name}</td><td class="p-4">${p.position}</td><td class="p-4">${p.age}</td><td class="p-4">${p.getOverallRating()}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
};

const renderStandings = () => {
    const standings = game.getStandings();
    document.getElementById('viewContainer').innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">League Standings</h2>
            <div class="table-container">
                <table class="w-full text-left">
                    <thead><tr class="bg-gray-700">
                        <th class="p-4 rounded-tl-lg">Team</th><th class="p-4">W</th><th class="p-4">L</th><th class="p-4 rounded-tr-lg">T</th>
                    </tr></thead>
                    <tbody>${standings.map(t => `
                        <tr class="border-t border-gray-700 ${t.id === game.state.userTeamId ? 'bg-green-900' : ''}">
                            <td class="p-4">${t.city} ${t.name}</td><td class="p-4">${t.wins}</td><td class="p-4">${t.losses}</td><td class="p-4">${t.ties}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
};

const renderSchedule = () => {
    if (game.state.currentPhase === 'offseason' || game.state.schedule.length === 0) {
        document.getElementById('viewContainer').innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
                <h2 class="text-2xl font-bold mb-4">Schedule</h2>
                <p>The schedule will be generated at the start of the preseason.</p>
            </div>`;
        return;
    }
    const userSchedule = game.state.schedule.flat().filter(g => g.home.id === game.state.userTeamId || g.away.id === game.state.userTeamId);
    document.getElementById('viewContainer').innerHTML = `
         <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">Your Schedule</h2>
            <div class="table-container">
                <table class="w-full text-left">
                    <thead><tr class="bg-gray-700">
                        <th class="p-4 rounded-tl-lg">Week</th><th class="p-4">Opponent</th><th class="p-4 rounded-tr-lg">Location</th>
                    </tr></thead>
                    <tbody>${userSchedule.map(g => {
                        const isHome = g.home.id === game.state.userTeamId;
                        const opponent = isHome ? g.away : g.home;
                        return `<tr class="border-t border-gray-700 ${g.week === game.state.currentWeek ? 'bg-blue-900' : ''}">
                            <td class="p-4">${g.week}</td><td class="p-4">${opponent.city} ${opponent.name}</td><td class="p-4">${isHome ? 'Home' : 'Away'}</td>
                        </tr>`
                    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
};

const renderStaff = () => {
    document.getElementById('viewContainer').innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">Team Staff</h2>
            <p>Staff view coming soon. Here you will manage your coordinators and scouts.</p>
        </div>`;
};

const renderDepthChart = () => {
    document.getElementById('viewContainer').innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">Depth Chart</h2>
            <p>Depth chart management coming soon. Here you will set your starters.</p>
        </div>`;
};

// --- Loading and Initialization ---
const showScreen = (screenId) => {
    ['loadingScreen', 'startScreen', 'setupScreen', 'gameContainer'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
};

const updateLoadingProgress = (percentage, status, details = '') => {
    const loadingBar = document.getElementById('loadingBar');
    const loadingStatus = document.getElementById('loadingStatus');
    const loadingDetails = document.getElementById('loadingDetails');
    
    if(loadingBar) loadingBar.style.width = `${percentage}%`;
    if(loadingStatus) loadingStatus.textContent = `${status} (${percentage}%)`;
    if(loadingDetails) loadingDetails.textContent = details || `Please wait...`;
};

async function startGame(isNew, coachData, teamId) {
    showScreen('loadingScreen');
    await game.initialize(isNew, coachData, teamId, allTeamsData, updateLoadingProgress);
    showScreen('gameContainer');
    renderUI();
}

async function loadGameFromFile(state) {
    showScreen('loadingScreen');
    await game.loadState(state, updateLoadingProgress);
    showScreen('gameContainer');
    renderUI();
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    showScreen('loadingScreen');
    updateLoadingProgress(10, 'Loading', 'Fetching team data...');
    try {
        const response = await fetch('https://raw.githubusercontent.com/APmsj09/American_FB_Manager/refs/heads/main/data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        allTeamsData = await response.json();
        
        const teamSelect = document.getElementById('teamSelection');
        const proTeams = allTeamsData.pro;
        teamSelect.innerHTML = proTeams.map(team => `<option value="${team.id}">${team.city} ${team.name}</option>`).join('');
        updateLoadingProgress(100, 'Ready', 'Data loaded.');
        showScreen('startScreen');
    } catch (error) {
        console.error("Failed to load team data:", error);
        alert('Could not fetch team data. Please check the console and refresh.');
    }

    document.getElementById('newGameBtn').addEventListener('click', () => showScreen('setupScreen'));
    
    document.getElementById('loadGameBtn').addEventListener('click', () => {
        startGame(false);
    });

    document.getElementById('loadFileBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const state = JSON.parse(e.target.result);
                loadGameFromFile(state);
            } catch (error) {
                alert('Error: Could not read or parse the save file.');
            }
        };
        reader.readAsText(file);
    });

    document.getElementById('advanceWeekBtn').addEventListener('click', async () => {
        await game.advanceWeek();
        renderUI();
    });

    document.getElementById('saveGameBtn').addEventListener('click', () => {
        game.storageService.exportToFile(game.state);
    });

    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            game.state.view = e.currentTarget.dataset.view;
            renderUI();
        });
    });

    document.getElementById('setupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const coachName = document.getElementById('coachName').value;
        const coachAge = document.getElementById('coachAge').value;
        const teamId = document.getElementById('teamSelection').value;
        
        if (!teamId) {
            alert("Please select a team.");
            return;
        }

        await startGame(true, { name: coachName, age: coachAge }, teamId);
    });
});

