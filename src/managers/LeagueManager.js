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
