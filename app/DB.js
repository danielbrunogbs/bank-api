import mongoose from 'mongoose'

async function connect()
{
	try
	{
		await mongoose.connect("mongodb+srv://desenvolvimento:123@bootcamp.k3ciq.mongodb.net/bootcamp?retryWrites=true&w=majority", {
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