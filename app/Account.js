import mongoose from 'mongoose'

const schema = mongoose.Schema({

	name: {
		type: String,
		required: true
	},

	agencia: {
		type: Number,
		required: true
	},

	conta: {
		type: Number,
		required: true
	},

	balance: {
		type: Number,
		required: true,
		validate(value){ if(value < 0) throw new Error('Valor negativo não permitido!'); },
		min: 0
	}

});

const account = mongoose.model('account', schema);

export default { account };