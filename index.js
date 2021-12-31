
const { token } = require('./config.json');

const { Client, Intents } = require('discord.js');
const { search } = require('./scrape');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

class Command {

	constructor(max, run) {
		this.max = max;
		this.run = run;
		this.cooldowns = {};
	}

}

var commands = {

	search: new Command(5, async int => {

		await int.deferReply();

		try {
			var content = await search(int.options.getString('keyword'));
		}
		catch (err) {
			console.log(err);
			var content = null;
		}

		if (content == null) await int.editReply('No results found');
		else await int.editReply({ files: [{
			attachment: Buffer.from(content, 'utf-8'),
			name: 'wiki.txt'
		}] });
	
	}),

};

client.once('ready', () => {
	console.log(`logged in as ${ client.user.tag }`);
});

client.on('interactionCreate', async int => {

	if (!int.isCommand() 
	 || int.guildId == null
	 || !commands.hasOwnProperty(int.commandName)
	) return;

	let command = commands[int.commandName];
	if (!command.cooldowns.hasOwnProperty(int.guildId)) command.cooldowns[int.guildId] = new Set();
	let guild = command.cooldowns[int.guildId];
	if (guild.size >= command.max 
	 || guild.has(int.member.id)
	) return await int.reply({ content: 'This command is on cooldown', ephemeral: true });

	guild.add(int.member.id);
	await command.run(int);
	guild.delete(int.member.id);

});

client.login(token);