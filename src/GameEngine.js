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

    async initialize(isNewGame, coachData, teamId, allTeamsData, progressCallback) {
        this.state.gameState = 'initializing';
        if (progressCallback) progressCallback(5, 'Initializing...', 'Preparing game engine');
        
        if (!isNewGame) {
            if (progressCallback) progressCallback(10, 'Loading Game...', 'Checking for saved game');
            const savedState = this.storageService.load();
            if (savedState) {
                if (progressCallback) progressCallback(20, 'Loading Game...', 'Loading saved game data');
                this.state = savedState;
                if (progressCallback) progressCallback(30, 'Loading Game...', 'Restoring teams');
                this.state.teams = this.state.teams.map(t => new Team(t));
                if (progressCallback) progressCallback(50, 'Loading Game...', 'Restoring players');
                this.state.players = this.state.players.map(p => new Player(p));
                if (progressCallback) progressCallback(70, 'Loading Game...', 'Restoring coaches');
                this.state.coaches = this.state.coaches.map(c => new Coach(c));
                if (progressCallback) progressCallback(90, 'Loading Game...', 'Finalizing game state');
                this.state.gameState = 'ready';
                if (progressCallback) progressCallback(100, 'Load Complete', 'Game loaded successfully!');
                return;
            } else {
                alert("No saved game found in local storage.");
                // This should ideally reset the view to the start screen
                return;
            }
        }

        // New Game Initialization
        if (progressCallback) progressCallback(10, 'New Game...', 'Starting new game initialization');
        this.state = this.getInitialState(); 
        
        if (!allTeamsData) throw new Error('Teams data is required for new game initialization');

        if (progressCallback) progressCallback(20, 'New Game...', 'Loading team data');
        const proTeamsData = allTeamsData.pro;
        
        if (progressCallback) progressCallback(30, 'New Game...', 'Creating teams, players, and coaches');
        const { teams, players, coaches } = this.leagueManager.initializeLeague(proTeamsData);
        this.state.teams = teams;
        this.state.players = players;
        this.state.coaches = coaches;

        if (progressCallback) progressCallback(60, 'New Game...', 'Generating season schedule');
        this.state.schedule = this.leagueManager.generateSchedule(teams);

        if (progressCallback) progressCallback(70, 'New Game...', 'Creating your coach');
        this.state.coach = new Coach(coachData);

        if (progressCallback) progressCallback(80, 'New Game...', 'Assigning your team');
        this.selectTeam(teamId);

        if (progressCallback) progressCallback(90, 'New Game...', 'Saving initial game state');
        this.state.gameState = 'ready';
        this.storageService.save(this.state);
        
        if (progressCallback) progressCallback(100, 'Setup Complete', 'Ready to play!');
    }

    async advanceWeek() {
        if (this.state.gameState !== 'ready') return;
        this.state = await this.gameManager.advanceWeek(this.state);
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
