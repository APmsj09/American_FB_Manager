export default class GameManager {
    async advanceWeek(state) {
        state.currentWeek++;
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
        
        state.gameResults[week] = [];

        weekGames.forEach(game => {
            const homeTeam = state.teams.find(t => t.id === game.home.id);
            const awayTeam = state.teams.find(t => t.id === game.away.id);
            if (homeTeam && awayTeam) {
                const result = this.simulateGame(homeTeam, awayTeam, state.players);
                state.gameResults[week].push(result);

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
        const homeOVR = this.calculateTeamOverall(homeTeam, allPlayers);
        const awayOVR = this.calculateTeamOverall(awayTeam, allPlayers);

        const homeScore = Math.floor((homeOVR * 0.4) + (Math.random() * 35) + 3); // +3 home field advantage
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
        
        return starterCount > 0 ? totalRating / starterCount : 50; 
    }

    endSeason(state) {
        console.log(`End of ${state.currentYear} season.`);
        state.currentYear++;
        state.currentWeek = 0;
        state.teams.forEach(t => t.resetRecord());
    }

    getStandings(teams) {
        return [...teams].sort((a, b) => {
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            return a.losses - b.losses;
        });
    }
}

