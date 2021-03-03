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


export default router;
