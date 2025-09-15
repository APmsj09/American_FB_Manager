export default class GameManager {
    async advanceWeek(state) {
        state.currentWeek++;
        // NOTE: The preseason logic is handled inside simulateWeek
        this.simulateWeek(state);

        if (state.currentWeek > 17) { // End of Regular Season
            this.endSeason(state);
        }
        return state;
    }

    simulateWeek(state) {
        const week = state.currentWeek;
        const isPreseason = week <= 4;
        const weekGames = state.schedule[week - 1] || [];
        
        state.gameResults[week] = []; // Initialize results for the week

        weekGames.forEach(game => {
            const homeTeam = state.teams.find(t => t.id === game.homeTeam);
            const awayTeam = state.teams.find(t => t.id === game.awayTeam);
            if (homeTeam && awayTeam) {
                const result = this.simulateGame(homeTeam, awayTeam, state.players);
                state.gameResults[week].push(result);

                // Only update the W/L record if it's not the preseason
                if (!isPreseason) {
                    if (result.homeScore > result.awayScore) {
                        homeTeam.updateRecord('win');
                        awayTeam.updateRecord('loss');
                    } else if (result.awayScore > result.homeScore) {
                        homeTeam.updateRecord('loss');
                        awayTeam.updateRecord('win');
                    } else {
                        homeTeam.updateRecord('tie');
                        awayTeam.updateRecord('tie');
                    }
                }
            }
        });
    }

    simulateGame(homeTeam, awayTeam, allPlayers) {
        // Calculate team strength based on starters from the depth chart
        const homeOVR = this.calculateTeamOverall(homeTeam, allPlayers);
        const awayOVR = this.calculateTeamOverall(awayTeam, allPlayers);

        // A simple sim engine: strength + randomness + home field advantage
        const homeScore = Math.floor((homeOVR * 0.4) + (Math.random() * 35) + 3); // +3 for home field
        const awayScore = Math.floor((awayOVR * 0.4) + (Math.random() * 35));
        
        return {
            homeTeam: homeTeam.id,
            awayTeam: awayTeam.id,
            homeScore,
            awayScore,
        };
    }
    
    calculateTeamOverall(team, allPlayers) {
        let totalRating = 0;
        let starterCount = 0;
        const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB'];

        positions.forEach(pos => {
            const starterId = team.depthChart[pos]?.[0];
            if (starterId) {
                const starter = allPlayers.find(p => p.id === starterId);
                if (starter) {
                    totalRating += starter.getOverallRating();
                    starterCount++;
                }
            }
        });
        
        return starterCount > 0 ? totalRating / starterCount : 50; // Return 50 if no starters found
    }

    endSeason(state) { /* ... no changes ... */ }
    getStandings(teams) { /* ... no changes ... */ }
}
