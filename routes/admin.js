const express = require('express') //01
const router = express.Router() //01
const mongoose = require('mongoose') //02
require("../model/Categoria") //02 faz a requisição da do Categoria.js dentro da pasta models
const Categoria = mongoose.model("categorias") //02 faz a requisição do model categorias

router.get('/', (req, res) => { //01
    res.render('admin/index')
})

router.get('/posts',(req, res) => { //01
    res.send('pagina posts')
})

router.get('/categorias',(req, res) => { //01
    res.render('admin/categorias')
})
//Rota para cadastrar no banco de dados o POST do formulario
router.POST('/categorias/nova',(req, res) => { //02
    //adiciona os dados recuperados em um objeto novaCategoria
    const novaCategoria = {
        codigo: req.body.codigo,
        descricao: req.body.descricao
    }
    new Categoria(novaCategoria).save().then(() => {
        console.log("Código salvo com sucesso!")
    }).catch((err) => {
        console.log("Erro ao salvar Código" + err)
    })

})

router.get('/categorias/add',(req, res) => { //01
    res.render('admin/addcategorias')
})

module.exports = router //01 exporta para o servidor o router da admin