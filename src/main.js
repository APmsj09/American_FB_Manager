import GameEngine from './GameEngine.js';
import Player from './models/Player.js';
import Team from './models/Team.js';
import Coach from './models/Coach.js';

const game = new GameEngine();
let allTeamsData = null; // Variable to store the loaded team data

// --- UI Rendering ---
const renderUI = () => {
    if (game.state.gameState !== 'ready') return;
    
    const userTeam = game.getUserTeam();
    document.getElementById('teamInfo').innerHTML = `<p class="text-lg font-bold">${userTeam?.city || ''} ${userTeam?.name || 'No Team'}</p>`;
    document.getElementById('weekYearDisplay').textContent = `Week: ${game.state.currentWeek} | Year: ${game.state.currentYear}`;
    
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
                            <td class="p-4">${t.city} ${t.name}</td><td class="p-4">${t.wins}</td><td class="p-4">${t.losses}</td><td class="p-4">${t.ties}</td>
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
                            <td class="p-4">${g.week}</td><td class="p-4">${opponent.city} ${opponent.name}</td><td class="p-4">${isHome ? 'Home' : 'Away'}</td>
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
    // Pass the loaded team data into the game engine for initialization
    await game.initialize(isNew, coachData, teamId, allTeamsData, updateLoadingProgress);
    showScreen('gameContainer');
    renderUI();
}

async function loadGameFromStateObject(state) {
    showScreen('loadingScreen');
    // Manually load the state and re-hydrate the class instances
    game.state = state;
    game.state.teams = game.state.teams.map(t => new Team(t));
    game.state.players = game.state.players.map(p => new Player(p));
    game.state.coaches = game.state.coaches.map(c => new Coach(c));
    game.state.gameState = 'ready';
    updateLoadingProgress(100, 'Load complete!');
    
    showScreen('gameContainer');
    renderUI();
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch team data as soon as the page loads
    try {
        const response = await fetch('https://raw.githubusercontent.com/APmsj09/American_FB_Manager/refs/heads/main/data.json');
        allTeamsData = await response.json();
        
        // Populate the team selection dropdown on the setup screen
        const teamSelect = document.getElementById('teamSelection');
        const proTeams = allTeamsData.pro;
        teamSelect.innerHTML = proTeams.map(team => `<option value="${team.id}">${team.city} ${team.name}</option>`).join('');
    } catch (error) {
        console.error("Failed to load team data:", error);
        const teamSelect = document.getElementById('teamSelection');
        teamSelect.innerHTML = `<option value="">Error loading teams</option>`;
    }

    document.getElementById('newGameBtn').addEventListener('click', () => showScreen('setupScreen'));
    
    document.getElementById('loadGameBtn').addEventListener('click', () => {
        startGame(false); // isNewGame = false, loads from localStorage
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
                loadGameFromStateObject(state);
            } catch (error) {
                alert('Error: Could not read or parse the save file.');
                console.error('File load error:', error);
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

        // Start the game with all the collected info in one step
        await startGame(true, { name: coachName, age: coachAge }, teamId);
    });
});
