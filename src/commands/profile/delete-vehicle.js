const Command = require('../../structures/Command');

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-vehicle',
			group: 'me',
			memberName: 'delete-vehicle',
			description: 'Deletes a vehicle from your profile.',
      example: [ 'delete-vehicle 2017 Honda Pilot', 'delete-vehicle 2019 Honda Accord Touring' ],
			args: [
				{
					key: 'year',
					prompt: 'What year is the vehicle? (i.e. 2017)',
          type: 'integer',
          validate: text => {
            if (text.length === 4) return true;
            return 'Year must be 4 digits.';
          }
        },
        {
					key: 'make',
					prompt: 'What make is the vehicle? (i.e. Toyota, Honda, etc.)',
					type: 'string'
				},
        {
					key: 'model',
					prompt: 'What model is the vehicle? (i.e. Prius, Pilot, etc.)',
					type: 'string'
				},
        {
					key: 'trim',
					prompt: 'What trim is the vehicle? (i.e. Touring, EX-L, etc.)',
          type: 'string',
          default: ""
				}
			]
		});
	}

	async run(message, { year, make, model, trim }) {
    const client = this.client;
    const User = client.orm.Model('DiscordUser');
    const messageUser = message.author;
    
    let user = await User.find(messageUser.id);

    if (!user) {
      message.reply("You have not added any vehicles yet!");
      return;
    }

    trim = trim.length ? trim : null
    let vehicle = {
      discord_user_id: user.id,
      vehicle_year: year,
      vehicle_make: make,
      vehicle_model: model,
      vehicle_trim: trim
    }
    // if (trim) {
    //   vehicle.vehicle_trim = trim;
    // }
    
    let vehiclesToDelete = await user.discord_user_vehicles.where(vehicle).then((results) => {
      console.log("Deleting Record:",results.toJSON());
      results.forEach(async (result) => {
        await result.destroy();
      });
      if (results.length) {
        message.reply("That vehicle has been deleted.");
      } else {
        message.reply("I could not find that vehicle in your profile.")
      }
    });
  }
}