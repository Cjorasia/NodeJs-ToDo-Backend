import express from "express";
// const express = require("express");
const router = express.Router();

//Models
import Todo from '../models/Task';
import Task from '../models/Todo';
import { isNumeric, isEmpty, isBoolean, isInt, toDate} from 'validator';

// Insert
router.post('/', async (req,res) => {
    let { name, priority, description, duedate } = req.body;

    // debug
    console.log(name,priority,description,duedate);

    // Validation
    if (isEmpty(name) || !isInt(priority, {min: 0, max: 2})
                || toDate(duedate) ===null) {
                    res.json({
                        result: "failed",
                        data: {},
                        message: `name must not be empty, priority=0..2 dueDate must be yyyy-mm-dd`
                    })
                }
    
    try{
        
        let newTodo = await Todo.create({
           name,
           priority: parseInt(priority),
           description,
           duedate
        },{
            fields: ["name", "priority","description","duedate"]
        });
        
        if(newTodo){
            res.json({
                result: "ok",
                data: newTodo
            });
        } else {
            res.json({
                result: "failed",
                data: {},
                message: `Insert a new Todo failed`
            });
        }
 
    } catch(error){

        res.json({
            result: "failed",
            data: {},
            message: `Insert a new Todo failed. Error: ${error}`
        });
    }

});

//Update data in DB
router.put('/:id', async(req,res) => {
    const {id} = req.params; // getting id from input link
    const { name, priority, description, duedate} = req.body; // getting more attribute from req.body

    // id must be number
    if (!isNumeric(id)){
        res.json({
            result: "failed",
            data: {},
            message: `id must be a number`
        });
    }

    try{
        let todos = await Todo.findAll({
            attributes: ['id', 'name', 'priority','description','duedate'],
            where: {
                id
            }
        });
        // iterating todos
        if (todos.length > 0){
            //updating one by one
            todos.forEach( async (todo) => {
                await todo.update({
                    name: name? name: todo.name,
                    priority: priority ? priority : todo.priority,
                    description: duedate ? duedate : todo.duedate
                });    
            });

            // response to client
            res.json({
                result: "ok",
                data: todos,
                message: "update a Todo successfully"
            })
        } else {
            res.json({
                result: "failed",
                data: {},
                message: "cannot find Todo to update"
            });
        }
    } catch(error){
        res.json({
            result: "failed",
            data: {},
            message: `Cannot update a Todo. Error: ${error}`
        });

    }
});


// Delete a Todo
router.delete('/:id', async (req,res) =>{
    const {id} = req.params;

    
    try {

        // Delete Task First
        await Task.destroy({
            where: {
                todoid: id
            }
        });

        let numberOfDEletedRows = await Todo.destroy({
            where: {
                id
            }
        });


        // response to client after delete
        res.json({
            result: 'ok', 
            message: "Delete a Todo successfully",
            count: numberOfDEletedRows
        });

    } catch(error){
        res.json({
            result: "failed",
            data: {},
            message: `Delete a TOdo failed. Error: ${error}`

        });
        
    }
});


// Query all data from DB
router.get('/', async (req, res) =>{
    try{
        const todos = await Todo.findAll({
            attributes: ['id', 'name', 'priority', 'description', 'duedate'],
        });
        res.json({
            result: "ok",
            data: todos,
            length : todos.length,
            message: "query list of Todos successfully"
        })
    }catch(error){
            res.json({
                result: " failed",
                data:[],
                length: 0,
                message: `query list of Todos failed. Error: ${error}`
            });
    }
});

// getting by id  i.e select * from todos where id = 2
router.get('/:id', async (req,res) => {
    const {id} = req.params; // get id through parameter
    try{
        let todos = await Todo.findAll({ // await means this function must be finished before running next line
            attributes: ['name', 'priority','description','duedate'],
            where: {
                id: id
            },
            include: {
                model: Task,
                as: "tasks",
                required: false
            }
        });
        if( todos.length > 0){
            res.json({
                result: 'Ok',
                data: todos[0],
                message: "querry list of Todos successfully"
            });
        } else{
            res.json({
                result: "failed",
                data: {},
                message: "Cannot find Todo to show"
            })
        }
    } catch (error){
            res.json({
                result: "failed",
                data: {},
                message: `Cant get by id. Error: ${error}`
            });
    }
});

export default router;