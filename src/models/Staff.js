import { v4 as uuidv4 } from 'uuid';

export default class Staff {
    constructor({ id, name, age, role, salary, skills, teamId = null }) {
        this.id = id || uuidv4();
        this.name = name;
        this.age = age;
        this.role = role; // e.g., 'Offensive Coordinator'
        this.salary = salary;
        this.skills = skills || { // { offense, defense, development, scouting }
            offense: 50,
            defense: 50,
            development: 50,
            scouting: 50,
        };
        this.teamId = teamId; // null if a free agent
    }

    getOverallRating() {
        const relevantSkills = Object.values(this.skills);
        if (relevantSkills.length === 0) return 30; // Default base rating
        return Math.round(relevantSkills.reduce((a, b) => a + b, 0) / relevantSkills.length);
    }

    assignTeam(teamId) {
        this.teamId = teamId;
    }
}

