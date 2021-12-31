
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.data = new SlashCommandBuilder()
	.setName('search')
	.setDescription('Searches the wiki and returns the content of the page')
	.addStringOption(option =>
		option.setName('keyword')
			.setDescription('The keyword(s) to search for')
			.setRequired(true));
