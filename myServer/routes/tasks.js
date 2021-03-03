import express from "express";
// const express = require("express");
const router = express.Router(); 

//Models
import Todo from '../models/Task';
import Task from '../models/Todo';

// Insert
router.post('/', async (req,res) => {
    try{
        let { todoid, name, isfinished} = req.body;
        let newTask = await Task.create({
            todoid,
            name,
            isfinished
        }, {
            fields: ["todoid", "name", "isfinished"]
        });

        if(newTask) {
            res.json({
                result: "ok",
                data: newTask,
                message: "insert a new Task successfully"
            });
        } else{
            res.json({
                result: "failed",
                data: {},
                message: 'Insert a new Task failed.'
            });
        }
    } catch (error){

    res.json({
        result: "failed",
        data: {},
        message: `Insert a new Taks failed. Error: ${error}`
    })

    }
});


// update
router.put('/:id', async (req, res) => {
    let { id } =req.params;
    let { todoid, name , isfinished } = req.body;
    try{
        let tasks = await Task.findAll({
            attributes: ['id', 'todoid', "name", "isfinished"],
            where: {
                id
            }
        });

        if (tasks.length > 0){
            tasks.forEach(async (task) => {
            await task.update({
                todoid: todoid? todoid : task.todoid,
                name: name ? name : task.name,
                isfinished: isfinished ? isfinished : task.isfinished,
            });
        });

            res.json({
                result: "ok",
                data: tasks,
                message: "update a Task successfully"
            });

        } else {
            res.json({
                result: "failed",
                data:{},
                message: "Cannot find Task to update"
            });
        }
    } catch(error){
            res.json({
                result: "failed",
                data: {},
                message: `Cannot update a Task. Error: ${error}`
            });
    }
});


// Delete
router.delete('/:id', async (req,res) => {
    let { id } = req.params;
    try {
        let numberOfDeletedRows = await Task.destroy({
            where: {
                id
            }
        });
        res.json({
            result: "ok",
            message: "Delete a Task successfully",
            count: numberOfDeletedRows
        });
    } catch (error){
        res.json({
            result: "failed",
            data: {},
            message: `Delete a Task failed. Error: ${error}`
        });
    }
});

// Query
router.get('/', async (req, res) =>{
    try {
        let tasks = await Task.findAll({
            attributes: ['id', "todoid", "name", "isfinished"],
            order: [
                ['name','ASC'] // ascending order
            ],
        });

        res.json({
            result: 'ok',
            data : tasks,
            message: "Query list of tasks successful"
        });
    } catch(error){
        res.json({
            result:'failed',
            data: [],
            message: `Query list of Tasks failed. Error: ${error}`
        });
    }
});


// Query by id
router.get('/todoid/:todoid', async (req, res) =>{
    let {todoid} = req.params;
    try {
        let tasks = await Task.findAll({
            attributes: ["id","todoid","name","isfinished"],
            where: {
                todoid
            }
        });
        if (tasks.length > 0) {
            res.json({
                result: "ok",
                data: tasks[0],
                message: "query list of Task successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find Task to show"
            });
        }

    } catch (error){
        res.json({
            result: "failed",
            data: {},
            message: `Query List of Tasks(by id) failed. Error: ${error}`
        })
    }
});

export default router;