const Contato = require('../models/contato_models')


exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos();
  res.render('index', {contatos});
};

