
class LocalStorageManager {
    constructor(key) {
        if (!key) {
            throw new Error("Storage Key is required")
        }
        this.key = key;
        
    }

    set(value){
        if (value === undefined){
            throw new Error("Cannot store undefined value.")
        }
        const serializedValue = JSON.stringify(value)
        localStorage.setItem(this.key , serializedValue)

    }


    get(){
        const item = localStorage.getItem(this.key)
        if (item == null){
            throw new Error("No stored keys found")
        }
        try {
            return JSON.parse(item)
        } catch (error) {
            return item            
        }

    }

    delete(){
        localStorage.removeItem(this.key);
    }

    exists(){
        return localStorage.getItem(this.key) !== null;
        
    }


}

export default LocalStorageManager