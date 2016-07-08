let ExamWaiter = require('./detect.js'),
    select = require('./selector.js'),
    readlineSync = require('readline-sync'),
    spinner = require('simple-spinner');

process.stdout.write("\u001b[2J\u001b[0;0H");
let userName = readlineSync.question('Username: '),
    password = readlineSync.question('Password: ', {
        hideEchoBack: true
    });

process.stdout.write("\u001b[2J\u001b[0;0H");
console.log('Waiting for results...');
spinner.start();

let waiter = new ExamWaiter(userName, password);
waiter.on('results', (results) => {
    let actualResults = select(results);
    spinner.stop();
    process.stdout.write("\u001b[2J\u001b[0;0H");
    console.log('Results are out!');
    console.log('--------------------------------------------------------\nMark\tCourse\n--------------------------------------------------------');
    for (let k in actualResults) {
        if (!actualResults.hasOwnProperty(k)) {
            continue;
        }
        console.log(`${actualResults[k].mark}\t${actualResults[k].name} (${k})`);
    }
    readlineSync.keyIn('\nPress any key to exit.', {
        hideEchoBack: true,
        mask: ''
    });
    process.exit(0); // make VS happy
});
waiter.start();
