const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");
const pergunta = require("./database/PerguntaModel");
const resposta = require("./database/RespostaModel");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//database connection
connection.authenticate().then(()=>{
    console.log("Conexão realizada com sucesso com o MySql!");
}).catch((error)=>{
    console.log(error);
})

//Informa onde estão os arquivos de Visualizados na tela
app.set('view engine','ejs');
//Informa onde estão os arquivos estáticos
app.use(express.static('public'));
//Body Parser


//Rotas
app.get("/",(req,res)=>{
    pergunta.findAll({raw: true,order:[
        ['id','DESC'] //ASC = Crescente, DESC = Decrecente
    ]}).then(pergunta =>{
        res.render("index",{
            pergunta: pergunta
        })
    })
    
});

app.get("/perguntar",(req,res)=>{
     res.render("perguntar")
});

app.post("/salvarPergunta",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
});

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo;
    var id = req.body.valueId;
    resposta.create({
        corpo: corpo,
        perguntaId: id
    }).then(() => {
        res.redirect("/pergunta/" + id)
    });
});

app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id;
    pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){

            resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id','DESC']
                ] 
            }).then(resposta => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    resposta: resposta
                })
            });
         }else{
            res.redirect("/")
        }
    });
});


//Servidor
app.listen(4000,()=>{
    console.log("Servidor rodando na url http://localhost:4000")
});