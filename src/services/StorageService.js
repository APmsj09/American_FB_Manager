// src/services/StorageService.js
export default class StorageService {
    constructor() {
        this.storageKey = 'afm_gameState';
    }

    save(state) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
            console.log('Game state saved.');
            return true;
        } catch (error) {
            console.error('Failed to save game state:', error);
            return false;
        }
    }

    load() {
        const savedState = localStorage.getItem(this.storageKey);
        return savedState ? JSON.parse(savedState) : null;
    }

    reset() {
        localStorage.removeItem(this.storageKey);
    }
}
