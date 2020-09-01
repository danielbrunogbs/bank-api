import Account from '../Account.js'

async function index(req, res, next)
{
	try
	{
		let accounts = await Account.account.find(req.query);

		res.status(200).send(accounts);
	}
	catch(e)
	{
		next(e);
	}
}

async function deposit(req, res, next)
{
	try
	{
		let agencia = req.body.agencia;
		let conta = req.body.conta;
		let valor = req.body.valor;

		let account = await Account.account.findOneAndUpdate({ agencia, conta }, { $inc: { balance: valor } }, { new: true });

		if(!account)
			throw new Error('Registro não encontrado!');

		res.status(200).send(account);
	}
	catch(e)
	{
		next(e);
	}
}

async function withdraw(req, res, next)
{
	try
	{
		let agencia = req.body.agencia;
		let conta = req.body.conta;
		let valor = req.body.valor + 1;

		let account = await Account.account.findOne({ agencia, conta });

		if(valor > account.balance)
			throw new Error('Saldo insuficiente!');

		valor = valor - (valor * 2);

		let update = await Account.account.findOneAndUpdate({ agencia, conta }, { $inc: { balance: valor } }, { new: true });

		if(!update)
			throw new Error('Registro não encontrado!');

		res.status(200).send(update);
	}
	catch(e)
	{
		next(e);
	}
}

async function drop(req, res, next)
{
	try
	{
		let drop = await Account.account.findOneAndDelete(req.query);

		if(!drop)
			throw new Error('Conta não encontrada!');

		let resume = await Account.account.countDocuments({ agencia: req.query.agencia });

		res.status(200).send({ active_accounts: resume, message: 'Conta fechada com sucesso!' });
	}
	catch(e)
	{
		next(e);
	}
}

async function average(req, res, next)
{
	try
	{
		let agencia = parseInt(req.query.agencia);

		let count = await Account.account.countDocuments({ agencia });

		let accounts = await Account.account.aggregate([
			{ $project: { name: true, agencia: true, conta: true, balance: true, _id: false } },
			{ $match: { agencia } },
			{ $group: { _id: '$_id', total: { $sum: '$balance' } } }
		]);

		let response = {
			agencia,
			average: accounts[0].total / count
		};

		res.status(200).send(response);
	}
	catch(e)
	{
		next(e);
	}
}

async function minimal(req, res, next)
{
	try
	{
		let quantity = parseInt(req.params.quantity);

		let accounts = await Account.account.find({}, { _id: false }).sort({ balance: 1 }).limit(quantity);

		res.status(200).send(accounts);
	}
	catch(e)
	{
		next(e);
	}
}

async function max(req, res, next)
{
	try
	{
		let quantity = parseInt(req.params.quantity);

		let accounts = await Account.account.find({}, { _id: false }).sort({ balance: -1, name: 1 }).limit(quantity);

		res.status(200).send(accounts);
	}
	catch(e)
	{
		next(e);
	}
}

async function transfer(req, res, next)
{
	try
	{
		let contaOrigem = req.body.contaOrigem;
		let contaDestino = req.body.contaDestino;
		let valor = req.body.valor;
		let taxa = 0;

		let accounts = await Account.account.find({ conta: { $in: [contaOrigem, contaDestino] } });

		if(accounts.length < 2 || accounts.length < 1)
			throw new Error('Não é possível realizar a transferência!');

		if(accounts[0].agencia != accounts[1].agencia)
			taxa = 8;

		let discount = valor + taxa;
		
		if(accounts[0].balance < discount)
			throw new Error('Saldo insuficiente!');

		let updateOrigem = await Account.account.findOneAndUpdate({ _id: accounts[0]._id }, { $inc: { balance: discount - (2 * discount) } }, { new: true });

		if(!updateOrigem)
			throw new Error('Falha ao discontar valor!');

		let updateDestino = await Account.account.findOneAndUpdate({ _id: accounts[1]._id }, { $inc: { balance: valor } });

		if(!updateDestino)
			throw new Error('Falha ao receber valor!');

		res.status(200).send(updateOrigem);
	}
	catch(e)
	{
		next(e);
	}
}

async function migrate(req, res, next)
{
	try
	{
		let accounts = await Account.account.aggregate([
			{ $project: { agencia: 1, balance: 1 } },
			{ $group: { _id: '$agencia', max: { $max: { balance: '$balance', id: '$_id' } } } }
		]);

		accounts = accounts.map(register => register.max.id);

		let updates = await Account.account.updateMany({ _id: { $in: accounts } }, { agencia: 99 });

		if(!updates)
			throw new Error('Não foi possível migrar as contas!');

		accounts = await Account.account.find({ agencia: 99 });

		res.status(200).send(accounts);
	}
	catch(e)
	{
		next(e);
	}
}

export default { index, deposit, withdraw, drop, average, minimal, max, transfer, migrate };