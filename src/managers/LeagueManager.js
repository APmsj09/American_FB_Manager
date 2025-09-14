import Player from '../models/Player.js';
import Team from '../models/Team.js';

class LeagueManager {
    constructor() {
        this.leagueConfigs = {
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
        };
    }

    initializeLeague(leagueType) {
        const config = this.leagueConfigs[leagueType];
        if (!config) throw new Error('Invalid league type');

        const teams = this.generateTeams(config.teams, leagueType);
        const players = this.generatePlayers(teams, config);

        return {
            teams,
            players
        };
    }

    generateTeams(count, leagueType) {
        const teams = [];
        for (let i = 0; i < count; i++) {
            teams.push(new Team({
                id: `team_${i}`,
                name: `Team ${i}`,
                league: leagueType
            }));
        }
        return teams;
    }

    generatePlayers(teams, config) {
        const players = [];
        const firstNames = ['John', 'Mike', 'Tom', 'James', 'Robert'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
        
        teams.forEach(team => {
            for (let i = 0; i < config.playersPerTeam; i++) {
                const player = new Player({
                    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                    position: Player.getValidPositions()[Math.floor(Math.random() * Player.getValidPositions().length)],
                    age: Math.floor(Math.random() * (config.maxAge - config.minAge)) + config.minAge,
                    teamId: team.id,
                    league: team.league,
                    attributes: {
                        speed: Math.floor(Math.random() * 50) + 50,
                        strength: Math.floor(Math.random() * 50) + 50,
                        agility: Math.floor(Math.random() * 50) + 50,
                        awareness: Math.floor(Math.random() * 50) + 50
                    }
                });
                players.push(player);
            }
        });

        return players;
    }

    generateSchedule(teams) {
        // Simple round-robin schedule
        const schedule = [];
        for (let week = 1; week <= 17; week++) {
            const weekGames = [];
            for (let i = 0; i < teams.length; i += 2) {
                if (teams[i + 1]) {
                    weekGames.push({
                        week,
                        homeTeam: teams[i].id,
                        awayTeam: teams[i + 1].id
                    });
                }
            }
            schedule.push(weekGames);
        }
        return schedule;
    }
}

export default LeagueManager;