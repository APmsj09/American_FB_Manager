class StorageService {
    constructor() {
        this.storageKey = 'gameState';
    }

    save(state) {
        try {
            // Deep clone the state to prevent circular references
            const stateToSave = JSON.parse(JSON.stringify(state));
            const serializedState = JSON.stringify(stateToSave);
            localStorage.setItem(this.storageKey, serializedState);
            console.log('Game state saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game state:', error);
            return false;
        }
    }

    load() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error('Failed to load game state:', error);
            return null;
        }
    }

    reset() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Game state reset successfully');
            return true;
        } catch (error) {
            console.error('Failed to reset game state:', error);
            return false;
        }
    }

    exportState() {
        const state = this.load();
        if (!state) return null;

        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    async importState(jsonFile) {
        try {
            const text = await jsonFile.text();
            const state = JSON.parse(text);
            this.save(state);
            return true;
        } catch (error) {
            console.error('Failed to import game state:', error);
            return false;
        }
    }
}

export default StorageService;