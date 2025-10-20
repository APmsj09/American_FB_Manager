import LeagueManager from './managers/LeagueManager.js';
import GameManager from './managers/GameManager.js';
import StorageService from './services/StorageService.js';
import Coach from './models/Coach.js';
import Team from './models/Team.js';
import Player from './models/Player.js';
import Staff from './models/Staff.js';

export default class GameEngine {
    constructor() {
        this.leagueManager = new LeagueManager();
        this.gameManager = new GameManager();
        this.storageService = new StorageService();
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            view: 'home',
            gameState: 'initializing',
            currentPhase: 'setup',
            leagueType: 'pro',
            userTeamId: null,
            teams: [],
            players: [],
            staff: [],
            availableStaff: [],
            gameResults: {},
            schedule: [],
            history: [],
            coaches: [],
            currentWeek: 0,
            currentYear: new Date().getFullYear()
        };
    }

    async initialize(isNewGame, coachData, teamId, allTeamsData, progressCallback) {
        this.state.gameState = 'initializing';
        if (progressCallback) progressCallback(5, 'Initializing...', 'Preparing game engine');

        if (!isNewGame) {
            if (progressCallback) progressCallback(10, 'Loading Game...', 'Checking for saved game');
            const savedState = this.storageService.load();
            if (savedState) {
                await this.loadState(savedState, progressCallback);
                return;
            } else {
                console.error("No saved game found in local storage.");
                // Ideally, reset to start screen
                return;
            }
        }

        if (progressCallback) progressCallback(10, 'New Game...', 'Starting new game initialization');
        this.state = this.getInitialState();

        if (!allTeamsData) throw new Error('Teams data is required for new game initialization');

        if (progressCallback) progressCallback(20, 'New Game...', 'Loading team data');
        const proTeamsData = allTeamsData.pro;

        // Await the new async league generation
        const { teams, players, coaches, availableStaff } = await this.leagueManager.initializeLeague(proTeamsData, progressCallback);
        this.state.teams = teams;
        this.state.players = players;
        this.state.coaches = coaches;
        this.state.availableStaff = availableStaff;

        if (progressCallback) progressCallback(70, 'New Game...', 'Creating your coach');
        this.state.coach = new Coach(coachData);

        if (progressCallback) progressCallback(80, 'New Game...', 'Assigning your team');
        this.selectTeam(teamId);

        if (progressCallback) progressCallback(90, 'New Game...', 'Finalizing league creation');
        this.state.gameState = 'ready';
        this.state.currentPhase = 'offseason';
        this.storageService.save(this.state);

        if (progressCallback) progressCallback(100, 'Setup Complete', 'Welcome to the Offseason!');
    }
    
    async loadState(state, progressCallback) {
        if (progressCallback) progressCallback(10, 'Loading Game...', 'Loading saved game data');
        this.state = state;

        if (!this.state.currentPhase) {
            this.state.currentPhase = this.state.currentWeek === 0 ? 'offseason' : 'regular_season';
        }

        if (progressCallback) progressCallback(30, 'Loading Game...', 'Restoring players');
        this.state.players = this.state.players.map(p => new Player(p));
        
        if (progressCallback) progressCallback(50, 'Loading Game...', 'Restoring coaches & staff');
        this.state.coaches = this.state.coaches.map(c => new Coach(c));
        this.state.availableStaff = this.state.availableStaff ? this.state.availableStaff.map(s => new Staff(s)) : [];

        if (progressCallback) progressCallback(70, 'Loading Game...', 'Restoring teams');
        this.state.teams = this.state.teams.map(t => new Team(t));

        if (progressCallback) progressCallback(80, 'Loading Game...', 'Rebuilding schedule');
        const teamsMap = new Map(this.state.teams.map(t => [t.id, t]));
        this.state.schedule = this.state.schedule.map(week => {
            return week.map(game => {
                if (!game || !game.home || !game.away) return game;
                const homeTeam = teamsMap.get(game.home.id || game.home);
                const awayTeam = teamsMap.get(game.away.id || game.away);
                return { ...game, home: homeTeam, away: awayTeam };
            });
        });

        if (progressCallback) progressCallback(90, 'Loading Game...', 'Finalizing game state');
        this.state.gameState = 'ready';
        if (progressCallback) progressCallback(100, 'Load Complete', 'Game loaded successfully!');
    }

    startNewSeason() {
        console.log("Starting new season...");
        this.state.currentPhase = 'preseason';
        this.state.currentWeek = 1;
        this.state.schedule = this.leagueManager.generateSchedule(this.state.teams);
    }

    async advanceWeek() {
        if (this.state.gameState !== 'ready') return;

        if (this.state.currentPhase === 'offseason') {
            this.startNewSeason();
        } else {
            this.state = await this.gameManager.advanceWeek(this.state);
        }

        this.storageService.save(this.state);
    }

    getStandings() {
        return this.gameManager.getStandings(this.state.teams);
    }

    getUserTeam() {
        return this.state.teams.find(team => team.id === this.state.userTeamId);
    }

    getTeamPlayers(teamId) {
        return this.state.players.filter(player => player.teamId === teamId);
    }

    selectTeam(teamId) {
        this.state.userTeamId = teamId;
        if (this.state.coach) {
            this.state.coach.assignTeam(teamId);
        }
    }
}

