class Player {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.position = data.position || '';
        this.age = data.age || 0;
        this.teamId = data.teamId || null;
        this.league = data.league || '';
        this.attributes = {
            // Physical attributes
            speed: data.attributes?.speed || 50,
            strength: data.attributes?.strength || 50,
            agility: data.attributes?.agility || 50,
            stamina: data.attributes?.stamina || 50,
            
            // Mental attributes
            awareness: data.attributes?.awareness || 50,
            intelligence: data.attributes?.intelligence || 50,
            leadership: data.attributes?.leadership || 50,
            
            // Skill attributes
            throwing_power: data.attributes?.throwing_power || 50,
            throwing_accuracy: data.attributes?.throwing_accuracy || 50,
            catching: data.attributes?.catching || 50,
            carrying: data.attributes?.carrying || 50,
            blocking: data.attributes?.blocking || 50,
            tackling: data.attributes?.tackling || 50,
            coverage: data.attributes?.coverage || 50
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