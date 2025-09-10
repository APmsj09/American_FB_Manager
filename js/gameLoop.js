class GameLoop {
    static async advanceWeek(state) {
        state.currentWeek++;
        
        // Simulate games
        if (state.currentWeek <= 17) {
            this.simulateGames(state);
        } else {
            await this.endSeason(state);
        }
        
        GameState.save(state);
        return state;
    }

    static simulateGames(state) {
        // Simple game simulation
        state.teams.forEach((team, i) => {
            if (i % 2 === 0) {
                const opponent = state.teams[i + 1];
                if (opponent) {
                    const homeScore = Math.floor(Math.random() * 35);
                    const awayScore = Math.floor(Math.random() * 35);
                    
                    if (homeScore > awayScore) {
                        team.wins++;
                        opponent.losses++;
                    } else if (awayScore > homeScore) {
                        team.losses++;
                        opponent.wins++;
                    } else {
                        team.ties++;
                        opponent.ties++;
                    }
                }
            }
        });
    }

    static async endSeason(state) {
        state.currentWeek = 0;
        state.currentYear++;
        
        // Record history
        state.history.push({
            year: state.currentYear - 1,
            teams: state.teams.map(t => ({
                name: t.name,
                wins: t.wins,
                losses: t.losses,
                ties: t.ties
            }))
        });

        // Reset team records
        state.teams.forEach(team => {
            team.wins = 0;
            team.losses = 0;
            team.ties = 0;
        });

        GameState.save(state);
    }
}