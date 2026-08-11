const KEYS = {
    tasks: 'flowboard.tasks',
    categories: 'flowboard.categories'
};

function read(key, fallback){
    try{
        const raw = localStorage.getItem(key);
        if(raw === null) return fallback; 
        return JSON.parse(raw);
    }catch(exception)
    {
        throw new Error(`Reading Failed: ${exception.message}`, {cause: exception}); 
    }

}

function write(key, value){
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }catch(exception) {
        throw new Error(`Writing Failed: ${exception.message}`, {cause: exception});
    }
}

export const loadTask = (fallback=[]) => read(KEYS.tasks, fallback);
export const saveTasks = (tasks) => write(KEYS.tasks, tasks);

export const loadCategories = (fallback = []) => read(KEYS.categories, fallback);
export const saveCategories = (categories) => write(KEYS.categories, categories);

export { KEYS };