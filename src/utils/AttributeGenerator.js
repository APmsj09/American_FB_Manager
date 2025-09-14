class AttributeGenerator {
    static #positionProfiles = {
        QB: {
            primary: ['throwing_power', 'throwing_accuracy', 'awareness', 'intelligence'],
            secondary: ['agility', 'stamina', 'leadership'],
            tertiary: ['speed', 'strength']
        },
        RB: {
            primary: ['speed', 'agility', 'carrying'],
            secondary: ['strength', 'stamina', 'awareness'],
            tertiary: ['blocking', 'catching']
        },
        WR: {
            primary: ['speed', 'catching', 'agility'],
            secondary: ['awareness', 'stamina'],
            tertiary: ['strength', 'blocking']
        },
        TE: {
            primary: ['catching', 'blocking'],
            secondary: ['strength', 'speed', 'awareness'],
            tertiary: ['agility', 'carrying']
        },
        OL: {
            primary: ['strength', 'blocking'],
            secondary: ['awareness', 'stamina'],
            tertiary: ['agility', 'speed']
        },
        DL: {
            primary: ['strength', 'tackling'],
            secondary: ['awareness', 'stamina'],
            tertiary: ['agility', 'speed']
        },
        LB: {
            primary: ['tackling', 'awareness', 'strength'],
            secondary: ['speed', 'coverage'],
            tertiary: ['catching', 'agility']
        },
        DB: {
            primary: ['speed', 'coverage', 'awareness'],
            secondary: ['agility', 'tackling'],
            tertiary: ['catching', 'strength']
        }
    };

    static generateAttributes(position, potential = 1.0) {
        const attributes = {
            // Physical attributes
            speed: 50,
            strength: 50,
            agility: 50,
            stamina: 50,
            
            // Mental attributes
            awareness: 50,
            intelligence: 50,
            leadership: 50,
            
            // Skill attributes
            throwing_power: 50,
            throwing_accuracy: 50,
            catching: 50,
            carrying: 50,
            blocking: 50,
            tackling: 50,
            coverage: 50
        };

        const profile = this.#positionProfiles[position];
        if (!profile) return attributes;

        // Generate attributes based on position profile
        Object.keys(attributes).forEach(attr => {
            if (profile.primary.includes(attr)) {
                attributes[attr] = this.#generateAttributeValue(0.8, 1.0, potential);
            } else if (profile.secondary.includes(attr)) {
                attributes[attr] = this.#generateAttributeValue(0.6, 0.9, potential);
            } else if (profile.tertiary.includes(attr)) {
                attributes[attr] = this.#generateAttributeValue(0.4, 0.7, potential);
            } else {
                attributes[attr] = this.#generateAttributeValue(0.3, 0.6, potential);
            }
        });

        return attributes;
    }

    static #generateAttributeValue(min, max, potential) {
        const baseValue = Math.random() * (max - min) + min;
        const potentialModifier = Math.random() * potential;
        return Math.floor((baseValue + potentialModifier) * 50);
    }

    static generatePotential() {
        // Generate a value between 0.8 and 1.2 with normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const normalRandom = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return Math.min(Math.max(1 + (normalRandom * 0.2), 0.8), 1.2);
    }
}

export default AttributeGenerator;