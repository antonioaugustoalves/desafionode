const express = require("express");
const cors = require("cors");

const { v4: uuid, v4:isUuid} = require('uuid');

const app = express();
app.use(express.json());

app.use(cors());
const repositories = [];

function validateIndexRepository(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error:'Invalid project id'});
  }
  next();
}

app.use('/repositories/:id', validateIndexRepository);
app.use('/repositories/:id/like', validateIndexRepository);

app.get("/", (request, response, next)=>{
  return response.status(200).json({message:'App is running...'});
})

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const{title, url, techs, likes} = request.body;
  const repository = {id:uuid(), title, url, techs, likes:0};
  repositories.push(repository);
  return response.json(repository);
  
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const idxRepository = repositories.findIndex(repository => repository.id === id); 

  if(idxRepository < 0){
    return response.status(400).json({error:"Repository not found..."});
  }

  const newRepository = {
    id, 
    title,
    url,
    techs,
    likes: repositories[idxRepository].likes
  };

  if(!title || !url || !techs){
    return response.status(400).json({likes: 0})
  }

  repositories[idxRepository] = newRepository;
  return response.json(newRepository);
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const idxRepository = repositories.findIndex(repository => repository.id === id); 

  if(idxRepository <0){
    return response.status(400).json({error:"Repository not found..."});
  }

  repositories.splice(idxRepository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repository = repositories.find((repository )=> repository.id === id); 

  if(!repository){
    return response.status(400).json({error:"Repository not found..."});
  }


  repository.likes++;
 
  return response.json(repository);
});

module.exports = app;
