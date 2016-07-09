let ExamWaiter = require('./detect.js'),
    select = require('./selector.js'),
    readlineSync = require('readline-sync'),
    spinner = require('simple-spinner'),
    clearConsole = () => {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    },
    colours = require('colors'),
    userName = readlineSync.question('Username: '.yellow),
    password = readlineSync.question('Password: '.yellow, {
        hideEchoBack: true
    });

clearConsole();
console.log('Waiting for results...'.cyan);
spinner.start();

let waiter = new ExamWaiter(userName, password);
waiter.on('results', (results) => {
    let actualResults = select(results);
    spinner.stop();
    clearConsole();
    console.log('Results are out!'.green);
    console.log('--------------------------------------------------------');
    console.log('Mark\tCourse'.yellow);
    console.log('--------------------------------------------------------');
    for (let k in actualResults) {
        if (!actualResults.hasOwnProperty(k)) {
            continue;
        }
        console.log(`${actualResults[k].mark.cyan}\t${actualResults[k].name} (${k})`);
    }
    readlineSync.keyIn('\nPress any key to exit.'.black.bgWhite, {
        hideEchoBack: true,
        mask: ''
    });
    process.exit(0); // make VS happy
});

waiter.on('loginFailure', () => {
    spinner.stop();
    clearConsole();
    console.log('Hmmmm.... either your login details were incorrect or something is broken.'.red.bold);
    process.exit(-1);
});
waiter.start();
