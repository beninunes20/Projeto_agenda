const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  data: { type: Date, default: Date.now },
});

const contatoModel = mongoose.model('contato', contatoSchema);

class Contato {
  constructor(body){
    this.body = body;
    this.errors = [];
    this.contato = null;
  };

  async register(){
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await contatoModel.create(this.body);
  }

  valida(){
    this.cleanUp();
  
    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido');
    };

    if(!this.body.nome) {this.errors.push('Nome é um campo obrigatório')};
    if(!this.body.email && !this.body.telefone){
      this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone');
    };
  };
  
  cleanUp(){
    for (const key in this.body) {
      if (this.body[key] === undefined || this.body[key] === null) {
        this.body[key] = '';
      }

      if (typeof this.body[key] !== 'string') {
        this.body[key] = String(this.body[key]).trim();
      } else {
        this.body[key] = this.body[key].trim();
      }
    }

    this.body = {
      nome: this.body.nome || '',
      sobrenome: this.body.sobrenome || '',
      email: this.body.email || '',
      telefone: this.body.telefone || '',
    };
  }

  async edit(id){
    if(typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, {new: true});
  };

  // Métodos estáticos
  static async buscaPorId(id){
    if (typeof id !== 'string') return null;
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const contato = await contatoModel.findById(id);
    return contato;
  };

  static async buscaContatos(){
    const contatos = await contatoModel.find()
      .sort({ data: -1 });
    return contatos;
  };

  static async delete(id){
    if(typeof id !== 'string') return;

    const contato = await contatoModel.findOneAndDelete({
      _id: id
    });
    return contato;
  };


};

module.exports = Contato;
