class GameState {
    static initial = {
        view: 'home',
        gameState: 'initializing',
        currentYear: 2025,
        currentWeek: 0,
        userTeamId: null,
        leagueType: null,
        teams: [],
        players: [],
        staff: [],
        history: [],
        schedule: [],
        teamBudget: 50000000, // $50M starting budget
    };

    static save(state) {
        localStorage.setItem('gameState', JSON.stringify(state));
        console.log("Game state saved");
    }

    static load() {
        const saved = localStorage.getItem('gameState');
        return saved ? JSON.parse(saved) : this.initial;
    }

    static reset() {
        localStorage.clear();
        return this.initial;
    }
}