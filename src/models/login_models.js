const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const loginModel = mongoose.model('login', loginSchema);

class login {
  constructor(body){
    this.body = body;
    this.errors = [];
    this.user = null;
  }
  
  async register(){
    this.valida();
    if (this.errors.length > 0) return;
    try{
      const salt = bcryptjs.genSaltSync();
      this.body.password = bcryptjs.hashSync(this.body.password, salt);
      const userExists = await loginModel.findOne({ email: this.body.email });
      if (userExists){
        this.errors.push('E-mail já cadastrado');
        return;
      }
      this.user = await loginModel.create(this.body);
    }
    catch(e){
      console.log(e);
    }
  }

  async login(){
    this.valida();
    if (this.errors.length > 0) return;
    try{
      const user = await loginModel.findOne({ email: this.body.email });
      if (!user){
        this.errors.push('E-mail ou senha incorretos');
        return;
      }

      if (!bcryptjs.compareSync(this.body.password, user.password)){
        this.errors.push('E-mail ou senha incorretos');
        this.user = null;
        return;
      }

      this.user = user;
    }
    catch(e){
      console.log(e);
    }
  }

  valida(){
    this.cleanUp();

    if (!this.body.email) {
      this.errors.push('E-mail é obrigatório');
    } else if (!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido');
    }

    if (!this.body.password) {
      this.errors.push('Senha é obrigatória');
    } else if (this.body.password.length < 3 || this.body.password.length > 50){
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
    }
  }

  cleanUp(){
    for(let key in this.body){
      if ( typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email.trim().toLowerCase(),
      password: this.body.password
    }
  }
}

module.exports = login;
