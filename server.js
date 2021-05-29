require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');

console.log(process.env.API_TOKEN)

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({ error: 'Unauthorized Request' })
    }

    next()
})

function handleGetTypes(req, res){
    res.json(validTypes)
}

function handleGetPokemon(req, res){
    let response = POKEDEX.pokemon;

    if(req.query.name){
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name)
        )
    }

    if(req.query.type){
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type))
    }

    res.json(response)
}

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.get('/types', handleGetTypes)

app.get('/pokemon', handleGetPokemon)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

