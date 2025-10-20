class AttributeGenerator {
    static #positionProfiles = {
        QB: { primary: ['throwing_power', 'throwing_accuracy', 'awareness', 'intelligence'], secondary: ['agility', 'stamina', 'leadership'], tertiary: ['speed', 'strength'] },
        RB: { primary: ['speed', 'agility', 'carrying', 'strength'], secondary: ['stamina', 'awareness', 'blocking'], tertiary: ['catching'] },
        WR: { primary: ['speed', 'catching', 'agility', 'awareness'], secondary: ['stamina', 'route_running'], tertiary: ['strength', 'blocking'] },
        TE: { primary: ['catching', 'blocking', 'strength'], secondary: ['speed', 'awareness', 'route_running'], tertiary: ['agility', 'carrying'] },
        OL: { primary: ['strength', 'blocking', 'awareness'], secondary: ['stamina', 'footwork'], tertiary: ['agility', 'speed'] },
        DL: { primary: ['strength', 'tackling', 'block_shedding'], secondary: ['awareness', 'stamina', 'power_moves'], tertiary: ['agility', 'speed'] },
        LB: { primary: ['tackling', 'awareness', 'strength', 'speed'], secondary: ['coverage', 'block_shedding'], tertiary: ['catching', 'agility'] },
        DB: { primary: ['speed', 'coverage', 'awareness', 'agility'], secondary: ['tackling', 'catching'], tertiary: ['strength', 'block_shedding'] },
        K: { primary: ['kicking_power', 'kicking_accuracy'], secondary: ['awareness'], tertiary: [] },
        P: { primary: ['punting_power', 'punting_accuracy'], secondary: ['awareness'], tertiary: [] },
    };

    static generateAttributes(position, potential = 1.0) {
        const attributes = {
            // Physical
            speed: 50, strength: 50, agility: 50, stamina: 50,
            // Mental
            awareness: 50, intelligence: 50, leadership: 50,
            // QB Skills
            throwing_power: 50, throwing_accuracy: 50,
            // Ball Skills
            catching: 50, carrying: 50, route_running: 50,
            // O-Line / D-Line
            blocking: 50, tackling: 50, block_shedding: 50, power_moves: 50, footwork: 50,
            // Defensive Back
            coverage: 50,
            // Kicking
            kicking_power: 50, kicking_accuracy: 50, punting_power: 50, punting_accuracy: 50,
        };

        const profile = this.#positionProfiles[position];
        if (!profile) return attributes;

        Object.keys(attributes).forEach(attr => {
            let rating;
            if (profile.primary.includes(attr)) {
                rating = this.#generateAttributeValue(70, 95, potential); // High base for key skills
            } else if (profile.secondary.includes(attr)) {
                rating = this.#generateAttributeValue(60, 85, potential);
            } else if (profile.tertiary.includes(attr)) {
                rating = this.#generateAttributeValue(45, 75, potential);
            } else {
                rating = this.#generateAttributeValue(20, 60, potential); // Lower floor for non-essential skills
            }
            attributes[attr] = Math.min(99, Math.max(15, rating)); // Clamp values
        });

        return attributes;
    }

    static #generateAttributeValue(min, max, potential) {
        const baseValue = min + (Math.random() * (max - min));
        // Apply potential more strongly to affect the final rating
        const finalValue = baseValue * potential;
        return Math.floor(finalValue);
    }
    
    /**
     * Generates a potential modifier based on talent tiers.
     * @param {string} tier - The talent level ('elite', 'good', 'average', 'backup').
     * @returns {number} A potential modifier, typically between 0.8 and 1.2.
     */
    static generatePotential(tier = 'average') {
        const ranges = {
            elite:      { base: 1.1, variance: 0.08 },  // 90+ OVR players
            good:       { base: 1.0, variance: 0.08 },  // 80-89 OVR players
            average:    { base: 0.9, variance: 0.1 },   // 70-79 OVR players
            backup:     { base: 0.8, variance: 0.1 },   // <70 OVR players
        };

        const spec = ranges[tier] || ranges.average;
        
        // Use a simple randomizer for variance for now
        const varianceAmount = (Math.random() - 0.5) * 2 * spec.variance; // Creates a range from -variance to +variance
        const potential = spec.base + varianceAmount;

        return Math.max(0.7, potential); // Ensure a minimum potential
    }
}

export default AttributeGenerator;

