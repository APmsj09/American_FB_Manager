class LocalStorage {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Saved ${key} successfully`);
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }
}