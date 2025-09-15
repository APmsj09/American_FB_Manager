import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Coach from '../models/Coach.js';
import NameGenerator from '../utils/NameGenerator.js';
import AttributeGenerator from '../utils/AttributeGenerator.js';

export default class LeagueManager {
    initializeLeague(teamsData) {
        const teams = teamsData.map(data => new Team(data));

        const players = teams.flatMap(team =>
            Array.from({ length: 53 }, () => { // Pro teams have 53 players
                const position = ['QB', 'WR', 'RB', 'TE', 'OL', 'DL', 'LB', 'DB'][Math.floor(Math.random() * 8)];
                return new Player({
                    name: NameGenerator.generateFullName(),
                    position: position,
                    age: Math.floor(Math.random() * 10) + 22,
                    teamId: team.id,
                    league: 'pro',
                    attributes: AttributeGenerator.generateAttributes(position)
                });
            })
        );

        // NEW: Create a default depth chart for each team
        teams.forEach(team => {
            const teamPlayers = players.filter(p => p.teamId === team.id);
            const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB'];
            positions.forEach(pos => {
                team.depthChart[pos] = teamPlayers
                    .filter(p => p.position === pos)
                    .sort((a, b) => b.getOverallRating() - a.getOverallRating())
                    .map(p => p.id);
            });
        });

        const coaches = teams.map(team => new Coach({
            name: NameGenerator.generateFullName(),
            teamId: team.id
        }));

        // NEW: Generate a pool of available staff
        const availableStaff = this.generateStaff(50);

        return { teams, players, coaches, availableStaff };
    }

    // NEW METHOD
    generateStaff(count) {
        const staffPool = [];
        const roles = ['Offensive Coordinator', 'Defensive Coordinator', 'Special Teams Coach', 'Scout'];
        for (let i = 0; i < count; i++) {
            staffPool.push(new Staff({
                name: NameGenerator.generateFullName(),
                age: Math.floor(Math.random() * 30) + 30,
                role: roles[Math.floor(Math.random() * roles.length)],
                salary: Math.floor(Math.random() * 500000) + 250000,
                skills: {
                    offense: Math.floor(Math.random() * 50) + 30,
                    defense: Math.floor(Math.random() * 50) + 30,
                    development: Math.floor(Math.random() * 50) + 30,
                    scouting: Math.floor(Math.random() * 50) + 30,
                }
            }));
        }
        return staffPool;
    }

    generateSchedule(teams) {
        const schedule = [];
        for (let week = 1; week <= 17; week++) {
            const weekGames = [];
            let tempTeams = [...teams];
            tempTeams.sort(() => Math.random() - 0.5); 
            
            while (tempTeams.length > 1) {
                const homeTeam = tempTeams.shift();
                const awayTeam = tempTeams.pop();
                weekGames.push({
                    week,
                    homeTeam: homeTeam.id,
                    awayTeam: awayTeam.id
                });
            }
            schedule.push(weekGames);
        }
        return schedule;
    }
}
