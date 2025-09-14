class GameManager {
    constructor() {
        this.currentWeek = 0;
        this.currentYear = new Date().getFullYear();
    }

    async advanceWeek(state) {
        this.currentWeek++;
        
        if (this.currentWeek <= 17) {
            await this.simulateGames(state);
        } else {
            await this.endSeason(state);
        }
        
        return state;
    }

    async simulateGames(state) {
        const weekGames = state.schedule[this.currentWeek - 1] || [];
        
        weekGames.forEach(game => {
            const homeTeam = state.teams.find(t => t.id === game.homeTeam);
            const awayTeam = state.teams.find(t => t.id === game.awayTeam);
            
            if (homeTeam && awayTeam) {
                this.simulateGame(homeTeam, awayTeam);
            }
        });
    }

    simulateGame(homeTeam, awayTeam) {
        const homeScore = Math.floor(Math.random() * 35);
        const awayScore = Math.floor(Math.random() * 35);
        
        if (homeScore > awayScore) {
            homeTeam.updateRecord('win');
            awayTeam.updateRecord('loss');
        } else if (awayScore > homeScore) {
            homeTeam.updateRecord('loss');
            awayTeam.updateRecord('win');
        } else {
            homeTeam.updateRecord('tie');
            awayTeam.updateRecord('tie');
        }

        return {
            homeTeam: homeTeam.id,
            awayTeam: awayTeam.id,
            homeScore,
            awayScore
        };
    }

    async endSeason(state) {
        // Record season history
        const seasonRecord = {
            year: this.currentYear,
            teams: state.teams.map(team => ({
                id: team.id,
                name: team.name,
                wins: team.wins,
                losses: team.losses,
                ties: team.ties
            }))
        };

        // Add season to history
        state.history.push(seasonRecord);

        // Update team histories and reset records
        state.teams.forEach(team => {
            team.addToHistory(seasonRecord);
            team.resetRecord();
        });

        // Reset for next season
        this.currentWeek = 0;
        this.currentYear++;

        return state;
    }

    getStandings(teams) {
        return [...teams].sort((a, b) => {
            const aWinPct = (a.wins + 0.5 * a.ties) / (a.wins + a.losses + a.ties);
            const bWinPct = (b.wins + 0.5 * b.ties) / (b.wins + b.losses + b.ties);
            return bWinPct - aWinPct;
        });
    }
}

export default GameManager;