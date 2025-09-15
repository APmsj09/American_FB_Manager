import LeagueManager from './managers/LeagueManager.js';
import GameManager from './managers/GameManager.js';
import StorageService from './services/StorageService.js';
import Coach from './models/Coach.js';
import Team from './models/Team.js';
import Player from './models/Player.js';

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
            leagueType: 'pro',
            userTeamId: null,
            teams: [],
            players: [],
            schedule: [],
            history: [],
            coaches: [],
            currentWeek: 0,
            currentYear: new Date().getFullYear()
        };
    }

    async initialize(isNewGame, coachData, teamId, progressCallback) {
        this.state.gameState = 'initializing';
        if (progressCallback) progressCallback(10, 'Starting up...');
        
        if (!isNewGame) {
            const savedState = this.storageService.load();
            if (savedState) {
                if (progressCallback) progressCallback(50, 'Loading saved data...');
                this.state = savedState;
                this.state.teams = this.state.teams.map(t => new Team(t));
                this.state.players = this.state.players.map(p => new Player(p));
                this.state.coaches = this.state.coaches.map(c => new Coach(c));
                if (progressCallback) progressCallback(100, 'Load complete!');
                this.state.gameState = 'ready';
                return;
            } else {
                alert("No saved game found in local storage.");
                return;
            }
        }

        // New Game Initialization
        this.state = this.getInitialState(); 
        if (progressCallback) progressCallback(20, 'Generating league...');
        const proTeamsData = allTeamsData.pro;
        const { teams, players, coaches } = this.leagueManager.initializeLeague(proTeamsData);
        this.state.teams = teams;
        this.state.players = players;
        this.state.coaches = coaches;

        if (progressCallback) progressCallback(60, 'Creating schedule...');
        this.state.schedule = this.leagueManager.generateSchedule(teams);

        if (progressCallback) progressCallback(80, 'Finalizing...');
        this.state.coach = new Coach(coachData);
        this.selectTeam(teamId);

        this.state.gameState = 'ready';
        this.storageService.save(this.state); // Save to local storage on creation
        if (progressCallback) progressCallback(100, 'Setup complete!');
    }

    async advanceWeek() {
        if (this.state.gameState !== 'ready') return;
        this.state = await this.gameManager.advanceWeek(this.state);
        this.storageService.save(this.state); // Save to local storage after each week
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
