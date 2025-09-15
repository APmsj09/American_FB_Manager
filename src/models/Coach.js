// src/models/Coach.js
export default class Coach {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.age = data.age || 35;
        this.teamId = data.teamId || null;
    }

    assignTeam(teamId) {
        this.teamId = teamId;
    }
}
