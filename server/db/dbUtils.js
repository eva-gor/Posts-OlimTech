const fs = require('fs');
const { TABLE_NAMES } = require('./tables/tables');
const lockfile = require('proper-lockfile');

let TEST_MODE = false;

exports.setTestMode = (testMode) => {
    TEST_MODE = testMode;
};

const getTablePath = (tableName) => TEST_MODE ? `./db/tables/test/${tableName}.json` : `./db/tables/${tableName}.json`;

exports.getTable = (tableName) => {
    return new Promise((resolve, reject) => {
        const foo = (res, rej) => {
            const filePath = getTablePath(tableName);
            const isLocked = lockfile.checkSync(filePath)
            if (!isLocked) {
                try {
                    lockfile.lockSync(filePath)
                    fs.readFile(filePath, 'utf8' , (err, data) => {
                        lockfile.unlockSync(filePath)
                        try {
                            const jsonData = JSON.parse(data);
                            res(err ? [] : jsonData);
                        } catch (err) {
                            setTimeout(() => {
                                foo(resolve, reject);
                            }, 200);
                        }
                    });
                } catch (err) {
                    lockfile.unlockSync(filePath)
                }
            } else {
                setTimeout(() => {
                    foo(resolve, reject);
                }, 200);
            }
        }
        foo(resolve, reject)
    });
};

exports.updateTable = (tableName, newTable) => {
    return new Promise((resolve, reject) => {
        const foo = (res, rej) => {
            const filePath = getTablePath(tableName);
            const isLocked = lockfile.checkSync(filePath)
            if (!isLocked) {
                if (Array.isArray(newTable) && Object.values(TABLE_NAMES).includes(tableName)) {
                    try {
                        lockfile.lockSync(filePath);
                        fs.writeFile(filePath, `${JSON.stringify(newTable)}`, (err) => {
                            lockfile.unlock(filePath);
                            err ? rej(err) : res(newTable);
                        });
                    } catch (err) {
                        lockfile.unlockSync(filePath);
                        rej(err);
                    }
                } else {
                    tableWritting[tableName] = false;
                    tryCounts = 0;
                    rej(new Error(`Error while ${tableName} updating`));
                }
            } else {
                setTimeout(() => {
                    foo(res, rej);
                }, 200);
            }
        };
        foo(resolve, reject)
    });
}

exports.generateId = async (tableName) => {
    let table = await this.getTable(tableName);
    let maxId = 0;
    table.forEach(item =>{
        if (item.id > maxId) maxId = item.id;
    });
    return ++maxId;
}

exports.resetTestTables = () => {
    const initTestMode = TEST_MODE;
    this.setTestMode(true);
    const tableNames = Object.values(TABLE_NAMES);
    tableNames.forEach(async (tableName, idx) => {
        await this.updateTable(tableName, []);
        if (idx === tableNames.length) this.setTestMode(initTestMode);
    });
}