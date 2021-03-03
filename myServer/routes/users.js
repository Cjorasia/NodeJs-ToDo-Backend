import express from "express";
import User from "../models/User";
var router = express.Router();

/* GET users listing. */
  // router.get('/', function(req, res, next) {
  //   res.send('respond with a resource');
  // });


//Models
import Task from '../models/Task';
import {
  isEmpty, toDate, isURL, isEmail 
} from 'validator';


// Register User
router.post('/register', async (req, res) => {
  // User should secure password beforre sending
  let {name, password, email, profileURL, gender, dob} = req.body;

  if (isEmpty(name) || isEmpty(password) 
     || !isEmail(email) || !isURL(profileURL) 
     || isEmpty(gender) || toDate(dob) ===null){
       res.json({
         result: "failed",
         data: {},
         message: `name,password,gender must be not empty. Email,profileURL,dob must be in correct format`
       });
       return;
     }

     try{
        let newUser = await User.create({
            name,
            password,
            email,
            profileurl: profileURL,
            gender,
            dob,
        },{
          fields: ["name", "password", "email", "profileurl", "gender", "dob"]
        });
        if(newUser){
          res.json({
            result: "ok",
            data: newUser,
            message: `Insert a new User successfully`
          });
        } else {
          res.json({
            result: "failed",
            data : {},
            message: `Insert a new User failed`
          });
        }
     } catch(error){
        res.json ({
            result: "failed",
            data: {},
            message: `Insert a new User failed. Error: ${error}`
        });
     }
});


// Login User
router.post('/login', async (req, res) => {
  let {name , email } = req.body; //password must be compared with 'encoded password' from client
  // console.log(`name: ${name}, password ${password}, email = ${email}, profileURL = ${profileURL}, gender = ${gender}, `)

  if (isEmpty(name) || !isEmail(email)) {
    res.json({
      result: 'failed',
      data: {},
      message : `name must not be empty. EMail must be in correct format`
    });
  }
  try{
    let users = await User.findAll({
      attributes: ["name", "password", "email", "profileurl", "gender","dob"],
      where: {
        name,
        email
      }
    });
    if (users.length >0){
      res.json({
        result: 'ok',
        data: users[0],
        message: `Login user successfully`
      });
    } else{
      res.json({
        result: "failed",
        data: {},
        message: `Cannot find user, check your name and email`
      });
    }

  } catch(error){  
      re.json({
        result: "failed",
        data: {},
        message: `Login user failed. Error: ${error}`
      });
  }

});

export default router;
