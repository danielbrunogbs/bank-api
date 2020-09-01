import mongoose from 'mongoose'

async function connect()
{
	try
	{
		let user = process.env.DB_USERNAME;
		let password = process.env.DB_PASSWORD;
		let database = process.env.DB_DATABASE;

		await mongoose.connect(`mongodb+srv://${user}:${password}@${database}.k3ciq.mongodb.net/bootcamp?retryWrites=true&w=majority`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useFindAndModify: false,
			// useCreateIndex: true
		});
	}
	catch(e)
	{
		console.log(e);
	}
}

export default { connect };