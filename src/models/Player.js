// src/models/Player.js
export default class Player {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.position = data.position || 'N/A';
        this.age = data.age || 21;
        this.teamId = data.teamId || null;
        this.league = data.league || '';
        this.attributes = data.attributes || {};
    }

    getOverallRating() {
        if (!this.attributes || Object.keys(this.attributes).length === 0) {
            return 50;
        }
        const attrs = Object.values(this.attributes);
        return Math.round(attrs.reduce((sum, val) => sum + val, 0) / attrs.length);
    }
}
