// src/services/StorageService.js
export default class StorageService {
    constructor() {
        this.storageKey = 'afm_gameState';
    }

    save(state) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
            console.log('Game state saved to local storage.');
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

    exportToFile(state) {
        try {
            const jsonString = JSON.stringify(state, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `afm_save_${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('Game state exported successfully.');
        } catch (error) {
            console.error('Failed to export game state:', error);
        }
    }
}
