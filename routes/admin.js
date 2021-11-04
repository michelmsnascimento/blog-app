const express = require('express') //01
const router = express.Router() //01
const mongoose = require('mongoose') //02
require("../model/Categoria") //02 faz a requisição da do Categoria.js dentro da pasta models
const Categoria = mongoose.model("categorias") //02 faz a requisição do model categorias
require("../model/Postagem") //46 faz a requisição da do postagem.js dentro da pasta models
const Postagem = mongoose.model("postagens") 


router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts',(req, res) => {
    res.send('pagina posts')
})
//lista as categorias em http://localhost:8081/admin/categorias adicionado o .lean
router.get('/categorias',(req, res) => { 
    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect("/admin")
    })
    
})
//Tela de cadastro de nova categoria redireciona o POST para /categorias/nova
router.get('/categorias/add',(req, res) => { 
    res.render('admin/addcategorias')
})
//Rota para cadastrar no banco de dados o POST do formulario
router.post('/categorias/nova',(req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros, erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso.")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categotia.")
            res.redirect("/admin")
        })
    }
})

//rota para editar categoria
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria:categoria})
    }).catch((e) => {
        console.log(e);
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        let erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome invalido" })
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug invalido" })
        }
        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome da categoria muito pequeno" })
        }
        if (erros.length > 0) {
            Categoria.findOne({ _id: req.body.id }).lean().then((categoria) => {
                res.render("admin/editcategorias", { categoria: categoria})
            }).catch((err) => {
                req.flash("error_msg", "Erro ao pegar os dados")
                res.redirect("admin/categorias")
            })
            
        } else {


            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar a edição da categoria")
                res.redirect("admin/categorias")
            })

        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        req.redirect("/admin/categorias")
    })
})

//rota para deletar categoria
router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso.")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        req.redirect("/admin/categorias")
    })
})





//rota para add postagens
router.get('/postagens',(req, res) => { 
    Postagem.find().populate("categoria").lean().sort({date:'desc'}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulario")
        res.redirect("/admin")
    })
})

router.get('/postagens/add',(req, res) => { 
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulário")
        res.redirect("/admin")
    })
    
})

router.post('/postagens/nova',(req, res) => {

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros, erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso.")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar Postagem.")
            res.redirect("/admin/postagens")
        })
    }
})


module.exports = router 
//01 exporta para o servidor o router da admin