export default class Team {
    constructor({ id, city, name, abbreviation, wins = 0, losses = 0, ties = 0, depthChart = {} }) {
        this.id = id;
        this.city = city;
        this.name = name;
        this.abbreviation = abbreviation;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
        this.depthChart = depthChart; // e.g., { QB: [playerId1, playerId2], ... }
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
