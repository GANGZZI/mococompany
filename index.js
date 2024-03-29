// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, InteractionType } = require('discord.js');
const keepAlive = require('./server.js');
// const autoReboot = require('./schedule.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log('Ready!');
  client.user.setActivity('/명령어', { type: "LISTENING" });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
keepAlive();
// autoReboot();