class Player {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.position = data.position || '';
        this.age = data.age || 0;
        this.teamId = data.teamId || null;
        this.league = data.league || '';
        this.attributes = {
            speed: data.attributes?.speed || 50,
            strength: data.attributes?.strength || 50,
            agility: data.attributes?.agility || 50,
            awareness: data.attributes?.awareness || 50
        };
        this.stats = {
            games: data.stats?.games || 0,
            touchdowns: data.stats?.touchdowns || 0,
            yards: data.stats?.yards || 0
        };
    }

    static getValidPositions() {
        return ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB'];
    }

    updateStats(gameStats) {
        this.stats.games++;
        Object.assign(this.stats, gameStats);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            position: this.position,
            age: this.age,
            teamId: this.teamId,
            league: this.league,
            attributes: { ...this.attributes },
            stats: { ...this.stats }
        };
    }
}

export default Player;