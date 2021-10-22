const mongoose = require('mongoose') //02

const Schema = mongoose.Schema //02

const Categoria = new Schema ({ //02
    codigo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: Date.now
    }
})

mongoose.model("categorias", Categoria) //02