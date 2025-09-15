import Player from '../models/Player.js';
import Team from '../models/Team.js';
import Coach from '../models/Coach.js';
import NameGenerator from '../utils/NameGenerator.js';
import AttributeGenerator from '../utils/AttributeGenerator.js';

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
        const coaches = this.generateCoaches(teams, leagueType);

        return {
            teams,
            players,
            coaches
        };
    }

    generateCoaches(teams, leagueType) {
        const coaches = [];
        const leagueMinAge = {
            'pro': 35,
            'college': 30,
            'highschool': 25
        };
        const leagueMaxAge = {
            'pro': 70,
            'college': 65,
            'highschool': 60
        };

        teams.forEach(team => {
            // Generate head coach
            const coach = new Coach({
                name: NameGenerator.generateFullName(),
                age: Math.floor(Math.random() * (leagueMaxAge[leagueType] - leagueMinAge[leagueType])) + leagueMinAge[leagueType],
                teamId: team.id,
                experience: Math.floor(Math.random() * 20),
                attributes: {
                    leadership: Math.floor(Math.random() * 30) + 70,  // Head coaches have high leadership
                    strategy: Math.floor(Math.random() * 40) + 60,
                    recruiting: Math.floor(Math.random() * 40) + 60,
                    development: Math.floor(Math.random() * 40) + 60
                }
            });
            coaches.push(coach);
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
    }, // Add comma here since this appears to be part of an object literal

    generatePlayers(teams, config) {
        const players = [];
        const positionNeeds = {
            QB: 3, RB: 4, WR: 6, TE: 3, OL: 8, DL: 8, LB: 8, DB: 10
        };
        
        teams.forEach(team => {
            // Generate players by position needs
            Object.entries(positionNeeds).forEach(([position, count]) => {
                for (let i = 0; i < count; i++) {
                    const potential = AttributeGenerator.generatePotential();
                    const player = new Player({
                        name: NameGenerator.generateFullName(),
                        position: position,
                        age: Math.floor(Math.random() * (config.maxAge - config.minAge)) + config.minAge,
                        teamId: team.id,
                        league: team.league,
                        attributes: AttributeGenerator.generateAttributes(position, potential)
                    });
                    players.push(player);
                }
            });

            // Fill remaining roster spots with random positions
            const currentCount = Object.values(positionNeeds).reduce((a, b) => a + b, 0);
            const remainingSpots = config.playersPerTeam - currentCount;
            
            for (let i = 0; i < remainingSpots; i++) {
                const position = Player.getValidPositions()[Math.floor(Math.random() * Player.getValidPositions().length)];
                const potential = AttributeGenerator.generatePotential();
                const player = new Player({
                    name: NameGenerator.generateFullName(),
                    position: position,
                    age: Math.floor(Math.random() * (config.maxAge - config.minAge)) + config.minAge,
                    teamId: team.id,
                    league: team.league,
                    attributes: AttributeGenerator.generateAttributes(position, potential)
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