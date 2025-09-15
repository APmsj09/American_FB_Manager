export default class GameManager {
    async advanceWeek(state) {
        state.currentWeek++;
        if (state.currentWeek <= 17) {
            this.simulateWeek(state);
        } else {
            this.endSeason(state);
        }
        return state;
    }

    simulateWeek(state) {
        const weekGames = state.schedule[state.currentWeek - 1] || [];
        weekGames.forEach(game => {
            const homeTeam = state.teams.find(t => t.id === game.homeTeam);
            const awayTeam = state.teams.find(t => t.id === game.awayTeam);
            if (homeTeam && awayTeam) {
                this.simulateGame(homeTeam, awayTeam);
            }
        });
    }

    simulateGame(homeTeam, awayTeam) {
        const homeScore = Math.floor(Math.random() * 40);
        const awayScore = Math.floor(Math.random() * 40);

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
    }

    endSeason(state) {
        state.history.push({
            year: state.currentYear,
            teams: state.teams.map(t => ({ ...t }))
        });

        state.teams.forEach(team => {
            team.resetRecord();
        });

        state.currentWeek = 0;
        state.currentYear++;
    }

    getStandings(teams) {
        return [...teams].sort((a, b) => b.wins - a.wins);
    }
}
