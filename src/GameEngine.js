import LeagueManager from './managers/LeagueManager.js';
import GameManager from './managers/GameManager.js';
import StorageService from './services/StorageService.js';
import Coach from './models/Coach.js';

class GameEngine {
    constructor() {
        this.leagueManager = new LeagueManager();
        this.gameManager = new GameManager();
        this.storageService = new StorageService();
        
        this.state = {
            view: 'home',
            gameState: 'initializing',
            leagueType: null,
            userTeamId: null,
            teams: [],
            players: [],
            schedule: [],
            history: [],
            currentWeek: 0,
            currentYear: new Date().getFullYear()
        };
    }

    async initialize(leagueType, userTeamId = null) {
        try {
            // Load saved state or create new league
            const savedState = this.storageService.load();
            if (savedState) {
                this.state = savedState;
                console.log('Loaded saved game state');
                return true;
            }

            // Initialize new league
            const { teams, players } = this.leagueManager.initializeLeague(leagueType);
            
            // Create schedule
            const schedule = this.leagueManager.generateSchedule(teams);

            // Update state
            this.state = {
                ...this.state,
                gameState: 'ready',
                leagueType,
                userTeamId,
                teams,
                players,
                schedule,
                currentWeek: 0,
                currentYear: new Date().getFullYear()
            };

            // Save initial state
            this.storageService.save(this.state);
            return true;
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return false;
        }
    }

    async advanceWeek() {
        try {
            if (this.state.gameState !== 'ready') {
                throw new Error('Game is not in ready state');
            }

            // Simulate games and update state
            this.state = await this.gameManager.advanceWeek(this.state);
            
            // Save updated state
            this.storageService.save(this.state);
            return true;
        } catch (error) {
            console.error('Failed to advance week:', error);
            return false;
        }
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

    saveGame() {
        return this.storageService.save(this.state);
    }

    resetGame() {
        this.storageService.reset();
        this.state = {
            view: 'home',
            gameState: 'initializing',
            leagueType: null,
            userTeamId: null,
            coach: null,
            teams: [],
            players: [],
            schedule: [],
            history: [],
            currentWeek: 0,
            currentYear: new Date().getFullYear()
        };
        return true;
    }

    createCoach(coachData) {
        this.state.coach = new Coach(coachData);
        this.storageService.save(this.state);
        return this.state.coach;
    }

    selectTeam(teamId) {
        if (!this.state.teams.find(t => t.id === teamId)) {
            throw new Error('Invalid team selection');
        }
        this.state.userTeamId = teamId;
        if (this.state.coach) {
            this.state.coach.assignTeam(teamId);
        }
        this.storageService.save(this.state);
        return true;
    }

    getAvailableTeams() {
        return this.state.teams.filter(team => 
            team.league === this.state.leagueType && 
            !this.state.coach?.teamId
        );
    }
}

export default GameEngine;