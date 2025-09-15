import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Coach from '../models/Coach.js';
import NameGenerator from '../utils/NameGenerator.js';
import AttributeGenerator from '../utils/AttributeGenerator.js';

export default class LeagueManager {
    initializeLeague(leagueType) {
        const teams = Array.from({ length: 16 }, (_, i) => new Team({
            id: `team_${i}`,
            name: `Team ${i + 1}`,
            league: leagueType
        }));

        const players = teams.flatMap(team =>
            Array.from({ length: 25 }, () => {
                const position = ['QB', 'WR', 'RB', 'TE', 'OL', 'DL', 'LB', 'DB'][Math.floor(Math.random() * 8)];
                return new Player({
                    name: NameGenerator.generateFullName(),
                    position: position,
                    age: Math.floor(Math.random() * 10) + 22,
                    teamId: team.id,
                    league: team.league,
                    attributes: AttributeGenerator.generateAttributes(position)
                });
            })
        );

        const coaches = teams.map(team => new Coach({
            name: NameGenerator.generateFullName(),
            teamId: team.id
        }));

        return { teams, players, coaches };
    }

    generateSchedule(teams) {
        const schedule = [];
        for (let week = 1; week <= 17; week++) {
            const weekGames = [];
            let tempTeams = [...teams];
            // Simple shuffling for variety each week
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
