const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  console.log("headers: ")
  const user = users.find( (user) => user.username == username)
  if( !user ) {
    return response.status(408).json({message: "User not found"})
  }
  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const user = request.body
  const newUser = {
    id: uuidv4(),
    name: user.name,
    username: user.username,
    todos: []
  }
  users.push(newUser)
  response.status(200).send('Success')
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const  todo  = request.body
  const newTodo = {
    id: uuidv4(),
    title: todo.title,
    done: false, 
    deadline: todo.deadline,
    created_at: new Date()
  }
  user.todos.push(newTodo)
  return response.status(200).send('Todo sucessfuly created!')
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request 
  const { id } = request.params
  const todoUpdate = request.body
  const todo = user.todos.find( (todo) => todo.id == id)
  if(todo){
    //return response.status(200).send("Successfuly updated")
    user.todos.map(
      (todo) => {
        if( todo.id == id){
          todo.title = todoUpdate.title,
          todo.deadline = todoUpdate.deadline
          return response.status(200).send('Todo successfuly updated')
        }
      }
    )
  } else {
    return response.status(400).json({ error: 'Todo not found'})
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const todo = user.todos.find( (todo) => todo.id == id)
  if(todo){
    //return response.status(200).send("Successfuly updated")
    user.todos.map(
      (todo) => {
        if( todo.id == id){
          todo.done = true
          return response.status(200).send('Todo done')
        }
      }
    )
  } else {
    return response.status(400).json({ error: 'Todo not found'})
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const todo = user.todos.find( (todo) => todo.id == id)
  if(todo) {
    user.todos.splice(todo, 1)
  } else {
    return response.status(400).json({ error: 'Todo not found'})
  }
});

module.exports = app;