const Prompt = require('../src/Prompt');

const test = new Prompt({
    commands: [
        {
            name: 'install',
            aliases: ['i'],
            description: `Install a package`
        }
    ]
});

process.on('uncaughtException', (error) => {console.log(error.message);process.exit()});
let interaction = test.reply();

console.log(interaction)