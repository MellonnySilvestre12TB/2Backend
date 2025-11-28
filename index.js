import express, { response } from "express"
import cors from "cors"
import mysql from "mysql2"

const {DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD} = process.env

const app = express()
const port = 3333

app.use(cors({
    origin: "*"
}))
app.use(express.json())

//Simbolo do objeto no java são as chaves {}

// GET (informações que o Backend envia para o Frontend), POST (gravação do banco de dados), PUT (auteração de informções), PATCH (auteração de informções), DELETE (deletar né ;-;)

//Json é um formato de arquivo, e a diferrença dele pro objeto, é que ele usa "" na chave da propriedade e no valor 
// Sempre que vc acessa um backend a resposta padrão hj em dia é sempre um Json, mas o json é uma informação que o JavaScrip n entende (pois são formatos de arquivos diferentes, mas o json entende o js), então para o js temos sempre converter oq esta em js para Json e quando chega no frontend a gente disconverte 

//Request (Requisição, o frontend faz a requisição) e o Response (Resposta, do backend)

app.get("/", (request, response) => {
    const selectCommand = "SELECT name, email, age FROM mellonnySilvestre"

    database.query(selectCommand, (error, person) =>{
        if(error) {
            console.log(error)
            return
        }

        response.json(person)
    })
})

app.post("/cadastrar", (request, response) => {
    const { name, email, age, password } = request.body.user

    const insertCommand = `
        INSERT INTO mellonnySilvestre(name, email, age, password)
        VALUES (?, ?, ?, ?)
    `

    database.query(insertCommand, [name, email, age, password], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({ message: "Usuário cadastrado com sucesso!"})
    })
})

app.post("/login", (request, response) => {
    const { email, password } = request.body.user

    const selectCommand = "SELECT * FROM mellonnySilvestre WHERE email = ?"

    database.query(selectCommand, [email], (error, user) => {
        if (error) {
            console.log (error)
            return
        }

        if (user.length === 0 || password !== user[0].password){
            response.json({ message: "Email ou senha incorretos!"})
            return
        }

        response.json({ id: user[0].id, name: user[0].name})
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}!`)
})

const database = mysql.createPool({
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionLimit: 10
})