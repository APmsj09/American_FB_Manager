// src/models/Team.js
export default class Team {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.league = data.league || '';
        this.wins = data.wins || 0;
        this.losses = data.losses || 0;
        this.ties = data.ties || 0;
        this.history = data.history || [];
    }

    updateRecord(result) {
        if (result === 'win') this.wins++;
        else if (result === 'loss') this.losses++;
        else if (result === 'tie') this.ties++;
    }

    resetRecord() {
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
    }

    addToHistory(seasonData) {
        this.history.push({
            year: seasonData.year,
            wins: this.wins,
            losses: this.losses,
            ties: this.ties
        });
    }
}
