class DataHandler {
    constructor() {

    }

    compareObjectArrays(oldArray, newArray, key) {
        return newArray.filter(newObject => {
            return ! oldArray.some(prevObject => {
                return prevObject[key] === newObject[key];
            });
        });
    }

}

module.exports = DataHandler;