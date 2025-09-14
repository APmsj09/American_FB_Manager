class Coach {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.age = data.age || 30;
        this.experience = data.experience || 0;
        this.teamId = data.teamId || null;
        this.attributes = {
            leadership: data.attributes?.leadership || 50,
            strategy: data.attributes?.strategy || 50,
            recruiting: data.attributes?.recruiting || 50,
            development: data.attributes?.development || 50
        };
        this.history = data.history || [];
    }

    updateAttributes(newAttributes) {
        Object.assign(this.attributes, newAttributes);
    }

    assignTeam(teamId) {
        this.teamId = teamId;
    }

    addSeasonToHistory(seasonData) {
        this.history.push({
            year: seasonData.year,
            teamId: this.teamId,
            wins: seasonData.wins,
            losses: seasonData.losses,
            ties: seasonData.ties
        });
        this.experience++;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            experience: this.experience,
            teamId: this.teamId,
            attributes: { ...this.attributes },
            history: [...this.history]
        };
    }
}

export default Coach;