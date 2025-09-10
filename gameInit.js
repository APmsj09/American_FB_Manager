class GameInitializer {
    static initializeLeague(leagueType) {
        const league = {
            highschool: {
                teams: 32,
                playersPerTeam: 50,
                minAge: 14,
                maxAge: 18
            },
            college: {
                teams: 32,
                playersPerTeam: 85,
                minAge: 18,
                maxAge: 23
            },
            pro: {
                teams: 32,
                playersPerTeam: 53,
                minAge: 21,
                maxAge: 40
            }
        }[leagueType];

        return {
            teams: this.generateTeams(league.teams, leagueType),
            players: this.generatePlayers(league.teams * league.playersPerTeam, league),
            staff: this.generateStaff(league.teams * 10),
            history: this.generateHistory(league.teams, 5) // 5 years of history
        };
    }

    static generateHistory(numTeams, years) {
        const history = [];
        for (let year = 2020; year < 2020 + years; year++) {
            const seasonRecord = {
                year,
                standings: Array.from({length: numTeams}, (_, i) => ({
                    teamId: `team_${i}`,
                    wins: Math.floor(Math.random() * 16),
                    losses: Math.floor(Math.random() * 16),
                    ties: Math.floor(Math.random() * 2)
                }))
            };
            history.push(seasonRecord);
        }
        return history;
    }
}