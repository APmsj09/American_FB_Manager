export default class Team {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.city = data.city || 'Unknown';
        this.name = data.name || 'Team';
        this.abbreviation = data.abbreviation || 'TM';
        this.conference = data.conference || null;
        this.division = data.division || null;
        this.population = data.population || 0;
        this.prestige = data.prestige || 50; // Default prestige
        
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
}
