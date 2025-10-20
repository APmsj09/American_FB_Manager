import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Coach from '../models/Coach.js';
import Staff from '../models/Staff.js';
import NameGenerator from '../utils/NameGenerator.js';
import AttributeGenerator from '../utils/AttributeGenerator.js';

export default class LeagueManager {
    /**
     * Asynchronously initializes a new league with realistic roster structures and talent distribution.
     * This process is chunked to prevent UI freezing during world generation.
     * @param {Array} teamsData - The raw data for the teams in the league.
     * @param {Function} progressCallback - A function to call with progress updates.
     * @returns {Object} An object containing the generated teams, players, coaches, and staff.
     */
    async initializeLeague(teamsData, progressCallback) {
        const teams = teamsData.map(data => new Team(data));
        const totalTeams = teams.length;
        let players = [];
        
        // This function forces the async loop to pause, allowing the browser to render UI updates.
        const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

        // Generate players for each team asynchronously
        for (let i = 0; i < totalTeams; i++) {
            const team = teams[i];
            const teamPlayers = this.#generateRoster(team.id);
            players.push(...teamPlayers);

            const progress = 30 + Math.round(((i + 1) / totalTeams) * 40);
            if (progressCallback) {
                progressCallback(progress, 'Generating League...', `Created roster for the ${team.city} ${team.name}`);
            }
            await yieldToMain(); // Prevents the loading screen from freezing
        }

        // Set up depth charts after all players are created
        teams.forEach(team => {
            const teamPlayers = players.filter(p => p.teamId === team.id);
            this.#generateDepthChart(team, teamPlayers);
        });

        // Generate coaches and available staff
        const coaches = this.#generateCoaches(teams);
        const availableStaff = this.#generateStaff(50);

        return { teams, players, coaches, availableStaff };
    }

    /**
     * Generates a realistic 53-man roster for a given team ID with varied talent levels.
     * @param {string} teamId - The ID of the team to generate the roster for.
     * @returns {Array<Player>} An array of new Player instances.
     */
    #generateRoster(teamId) {
        // Defines a realistic count of players for each position group on a 53-man roster.
        const rosterTemplate = {
            QB: 3, RB: 4, WR: 6, TE: 3, OL: 9,
            DL: 9, LB: 7, DB: 10, K: 1, P: 1,
        };

        // Defines the talent distribution for the roster.
        const talentDistribution = [
            ...Array(2).fill('elite'),
            ...Array(8).fill('good'),
            ...Array(25).fill('average'),
            ...Array(18).fill('backup')
        ];

        // Shuffle the talent pool to randomize distribution across positions.
        talentDistribution.sort(() => Math.random() - 0.5);
        
        const teamPlayers = [];
        for (const [position, count] of Object.entries(rosterTemplate)) {
            for (let i = 0; i < count; i++) {
                const talentTier = talentDistribution.pop() || 'backup';
                const potential = AttributeGenerator.generatePotential(talentTier);
                teamPlayers.push(new Player({
                    name: NameGenerator.generateFullName(),
                    position: position,
                    age: Math.floor(Math.random() * 6) + 21, // Younger age range for rookies
                    teamId: teamId,
                    league: 'pro',
                    attributes: AttributeGenerator.generateAttributes(position, potential),
                    potential: potential // Store potential for future development
                }));
            }
        }
        return teamPlayers;
    }

    /**
     * Creates a default depth chart for a team based on player overall ratings.
     * @param {Team} team - The team instance to create the depth chart for.
     * @param {Array<Player>} teamPlayers - The list of players on the team.
     */
    #generateDepthChart(team, teamPlayers) {
        const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P'];
        positions.forEach(pos => {
            team.depthChart[pos] = teamPlayers
                .filter(p => p.position === pos)
                .sort((a, b) => b.getOverallRating() - a.getOverallRating())
                .map(p => p.id);
        });
    }

    /**
     * Generates a head coach for each team.
     * @param {Array<Team>} teams - The list of teams.
     * @returns {Array<Coach>} An array of new Coach instances.
     */
    #generateCoaches(teams) {
         return teams.map(team => new Coach({
            name: NameGenerator.generateFullName(),
            teamId: team.id
        }));
    }

    /**
     * Generates a pool of available staff members (coordinators, scouts).
     * @param {number} count - The number of staff members to generate.
     * @returns {Array<Staff>} An array of new Staff instances.
     */
    #generateStaff(count) {
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
        // A simple scheduler; for a real game, a more complex, balanced algorithm is needed.
        for (let week = 1; week <= 17; week++) {
            const weekGames = [];
            let tempTeams = [...teams].sort(() => Math.random() - 0.5);
            
            while (tempTeams.length > 1) {
                const home = tempTeams.shift();
                const away = tempTeams.pop();
                weekGames.push({ week, home, away });
            }
            schedule.push(weekGames);
        }
        return schedule;
    }
}

