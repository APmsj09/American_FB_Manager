class LeagueInitializer {
    static generateTeam(id, name, league) {
        return {
            id,
            name,
            league,
            wins: 0,
            losses: 0,
            ties: 0,
            budget: 50000000,
            history: []
        };
    }

    static generatePlayer(teamId, league) {
        const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB'];
        const firstNames = ['John', 'Mike', 'Tom', 'James', 'Robert'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
        
        return {
            id: crypto.randomUUID(),
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            position: positions[Math.floor(Math.random() * positions.length)],
            age: Math.floor(Math.random() * (league === 'pro' ? 15 : 5)) + (league === 'pro' ? 21 : 14),
            teamId,
            league,
            attributes: {
                speed: Math.floor(Math.random() * 50) + 50,
                strength: Math.floor(Math.random() * 50) + 50,
                agility: Math.floor(Math.random() * 50) + 50,
                awareness: Math.floor(Math.random() * 50) + 50
            },
            stats: {
                games: 0,
                touchdowns: 0,
                yards: 0
            }
        };
    }

    static initializeLeague(leagueType) {
        const teams = [];
        const players = [];
        const NUM_TEAMS = 32;
        const PLAYERS_PER_TEAM = leagueType === 'pro' ? 53 : 85;

        // Generate teams
        for (let i = 0; i < NUM_TEAMS; i++) {
            const teamId = `team_${i}`;
            teams.push(this.generateTeam(teamId, `Team ${i}`, leagueType));
            
            // Generate players for each team
            for (let j = 0; j < PLAYERS_PER_TEAM; j++) {
                players.push(this.generatePlayer(teamId, leagueType));
            }
        }

        return { teams, players };
    }
}