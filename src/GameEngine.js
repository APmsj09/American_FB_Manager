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

    async initialize(isNewGame, coachData, teamId, progressCallback, teamsData = null) {
        this.state.gameState = 'initializing';
        if (progressCallback) progressCallback(5, 'Initializing game engine...');
        
        if (!isNewGame) {
            if (progressCallback) progressCallback(10, 'Checking for saved game...');
            const savedState = this.storageService.load();
            if (savedState) {
                if (progressCallback) progressCallback(20, 'Loading saved game data...');
                this.state = savedState;
                if (progressCallback) progressCallback(30, 'Restoring teams...');
                this.state.teams = this.state.teams.map(t => new Team(t));
                if (progressCallback) progressCallback(50, 'Restoring players...');
                this.state.players = this.state.players.map(p => new Player(p));
                if (progressCallback) progressCallback(70, 'Restoring coaches...');
                this.state.coaches = this.state.coaches.map(c => new Coach(c));
                if (progressCallback) progressCallback(90, 'Finalizing game state...');
                this.state.gameState = 'ready';
                if (progressCallback) progressCallback(100, 'Load complete!');
                return;
            } else {
                alert("No saved game found in local storage.");
                return;
            }
        }

        // New Game Initialization
        if (progressCallback) progressCallback(10, 'Starting new game initialization...');
        this.state = this.getInitialState(); 
        
        if (!teamsData) {
            throw new Error('Teams data is required for new game initialization');
        }

        if (progressCallback) progressCallback(20, 'Loading team data...');
        const proTeamsData = teamsData.pro;
        
        if (progressCallback) progressCallback(30, 'Creating teams...');
        const { teams, players, coaches } = this.leagueManager.initializeLeague(proTeamsData);
        this.state.teams = teams;

        if (progressCallback) progressCallback(40, 'Generating players...');
        this.state.players = players;

        if (progressCallback) progressCallback(50, 'Assigning coaches...');
        this.state.coaches = coaches;

        if (progressCallback) progressCallback(60, 'Generating season schedule...');
        this.state.schedule = this.leagueManager.generateSchedule(teams);

        if (progressCallback) progressCallback(70, 'Creating head coach...');
        this.state.coach = new Coach(coachData);

        if (progressCallback) progressCallback(80, 'Assigning team...');
        this.selectTeam(teamId);

        if (progressCallback) progressCallback(90, 'Saving initial game state...');
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
