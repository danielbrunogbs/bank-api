function index(req, res, send)
{
	res.status(200).send({ title: 'BANK-API', version: 'BETA' });
}

export default { index };