// src/models/Staff.js
export default class Staff {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || 'No Name';
        this.age = data.age || 45;
        this.role = data.role || 'Assistant'; // e.g., Head Coach, Offensive Coordinator
        this.salary = data.salary || 500000;

        // Skills out of 100
        this.skills = {
            offense: data.skills?.offense || 50,
            defense: data.skills?.defense || 50,
            development: data.skills?.development || 50,
            scouting: data.skills?.scouting || 50
        };

        this.teamId = data.teamId || null; // null if they are a free agent
    }

    getOverall() {
        const skillValues = Object.values(this.skills);
        return Math.round(skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length);
    }
}
