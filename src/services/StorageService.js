const SAVE_KEY = 'american_fb_manager_save';

export default class StorageService {
    save(state) {
        try {
            const stateString = JSON.stringify(state);
            localStorage.setItem(SAVE_KEY, stateString);
            console.log("Game saved successfully.");
        } catch (error) {
            console.error("Error saving game state:", error);
        }
    }

    load() {
        try {
            const stateString = localStorage.getItem(SAVE_KEY);
            if (stateString) {
                console.log("Save game found.");
                return JSON.parse(stateString);
            }
            console.log("No save game found.");
            return null;
        } catch (error) {
            console.error("Error loading game state:", error);
            return null;
        }
    }

    exportToFile(state) {
        try {
            const stateString = JSON.stringify(state, null, 2);
            const blob = new Blob([stateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fb_manager_save_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Game exported to file successfully.");
        } catch (error) {
            console.error("Error exporting game state to file:", error);
        }
    }
}
