class Team {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.league = data.league || '';
        this.wins = data.wins || 0;
        this.losses = data.losses || 0;
        this.ties = data.ties || 0;
        this.budget = data.budget || 50000000; // Default $50M budget
        this.history = data.history || [];
    }

    updateRecord(result) {
        switch (result) {
            case 'win':
                this.wins++;
                break;
            case 'loss':
                this.losses++;
                break;
            case 'tie':
                this.ties++;
                break;
        }
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

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            league: this.league,
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            budget: this.budget,
            history: [...this.history]
        };
    }
}

export default Team;