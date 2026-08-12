const Login = require('../models/login_models');

exports.index = (req, res) => { 
    if(req.session.user) return res.render('login-logado');
    return res.render('login');
};

exports.register = async (req, res) => {
    try{
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save(function(){
                return res.redirect('/login/');
            });
            return;
        }
        req.flash('success', 'Seu usuário foi criado com sucesso');
            req.session.save(function(){
                return res.redirect('/login/');
            });
            
        }catch(e){
        console.log(e);
        return res.render('404')
    }

    return;
};

exports.login = async (req, res) => {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save(function(){
                return res.redirect('/login/');
            });
            return;
        }

        req.flash('success', 'Você entrou no sistema');

        req.session.user = login.user;
        req.session.save(function(){
            return res.redirect('/');
        });
};

exports.logout = function(req, res){
    req.session.destroy();
    return res.redirect('/');
}


