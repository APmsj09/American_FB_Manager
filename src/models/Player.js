import { v4 as uuidv4 } from 'uuid';
import AttributeGenerator from '../utils/AttributeGenerator.js';

export default class Player {
    constructor({ id, name, position, age, teamId, league, attributes, potential }) {
        this.id = id || uuidv4();
        this.name = name;
        this.position = position;
        this.age = age;
        this.teamId = teamId;
        this.league = league;
        this.attributes = attributes || AttributeGenerator.generateAttributes(this.position, this.potential);
        this.potential = potential || AttributeGenerator.generatePotential();
    }

    getOverallRating() {
        const posProfile = AttributeGenerator._AttributeGenerator__positionProfiles[this.position];
        if (!posProfile) return 50;

        let totalWeight = 0;
        let weightedSum = 0;

        for (const attr in this.attributes) {
            let weight = 0;
            if (posProfile.primary.includes(attr)) {
                weight = 3;
            } else if (posProfile.secondary.includes(attr)) {
                weight = 2;
            } else if (posProfile.tertiary.includes(attr)) {
                weight = 1;
            }
            
            if (weight > 0) {
                weightedSum += this.attributes[attr] * weight;
                totalWeight += weight;
            }
        }
        
        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
    }
}
