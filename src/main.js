import GameEngine from './GameEngine.js';

const game = new GameEngine();

// --- UI Rendering ---
const renderUI = () => {
    if (game.state.gameState !== 'ready') return;
    
    // Update Header
    const userTeam = game.getUserTeam();
    document.getElementById('teamInfo').innerHTML = `<p class="text-lg font-bold">${userTeam?.name || 'No Team'}</p>`;
    document.getElementById('weekYearDisplay').textContent = `Week: ${game.state.currentWeek} | Year: ${game.state.currentYear}`;
    
    // Render current view
    const view = game.state.view;
    const viewContainer = document.getElementById('viewContainer');
    if (view === 'home') viewContainer.innerHTML = `<div class="bg-gray-800 p-6 rounded-lg"><h2>Welcome, Coach!</h2><p>Select a view from the sidebar.</p></div>`;
    else if (view === 'roster') renderRoster();
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
                            <td class="p-4">${t.name}</td><td class="p-4">${t.wins}</td><td class="p-4">${t.losses}</td><td class="p-4">${t.ties}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
};

const renderSchedule = () => {
    const userSchedule = game.state.schedule.flat().filter(g => g.homeTeam === game.state.userTeamId || g.awayTeam === game.state.userTeamId);
    document.getElementById('viewContainer').innerHTML = `
         <div class="bg-gray-800 rounded-lg p-6 shadow-md w-full">
            <h2 class="text-2xl font-bold mb-4">Your Schedule</h2>
            <div class="table-container">
                <table class="w-full text-left">
                    <thead><tr class="bg-gray-700">
                        <th class="p-4 rounded-tl-lg">Week</th><th class="p-4">Opponent</th><th class="p-4 rounded-tr-lg">Location</th>
                    </tr></thead>
                    <tbody>${userSchedule.map(g => {
                        const isHome = g.homeTeam === game.state.userTeamId;
                        const opponentId = isHome ? g.awayTeam : g.homeTeam;
                        const opponent = game.state.teams.find(t => t.id === opponentId);
                        return `<tr class="border-t border-gray-700 ${g.week === game.state.currentWeek ? 'bg-blue-900' : ''}">
                            <td class="p-4">${g.week}</td><td class="p-4">${opponent.name}</td><td class="p-4">${isHome ? 'Home' : 'Away'}</td>
                        </tr>`
                    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
};

// --- Loading and Initialization ---
const showScreen = (screenId) => {
    ['loadingScreen', 'startScreen', 'setupScreen', 'gameContainer'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
};

const updateLoadingProgress = (percentage, status) => {
    document.getElementById('loadingBar').style.width = `${percentage}%`;
    document.getElementById('loadingStatus').textContent = status;
};

async function startGame(isNew, coachData, teamId) {
    showScreen('loadingScreen');
    await game.initialize(isNew, coachData, teamId, updateLoadingProgress);
    showScreen('gameContainer');
    renderUI();
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newGameBtn').addEventListener('click', () => showScreen('setupScreen'));
    
    document.getElementById('loadGameBtn').addEventListener('click', () => {
        startGame(false);
    });

    document.getElementById('advanceWeekBtn').addEventListener('click', async () => {
        await game.advanceWeek();
        renderUI();
    });

    document.getElementById('saveGameBtn').addEventListener('click', () => {
        game.saveGame();
        alert('Game Saved!');
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
        const teamContainer = document.getElementById('teamSelectionContainer');

        if (teamContainer.classList.contains('hidden')) {
            // First step: create coach and show teams
            await game.initialize(true, {name: coachName, age: coachAge}, null, ()=>{}); // Quick init to get teams
            const teamSelect = document.getElementById('teamSelection');
            teamSelect.innerHTML = game.state.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
            teamContainer.classList.remove('hidden');
        } else {
            // Second step: select team and start game
            const teamId = document.getElementById('teamSelection').value;
            await startGame(true, {name: coachName, age: coachAge}, teamId);
        }
    });
});
