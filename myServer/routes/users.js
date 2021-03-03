import express from "express";
var router = express.Router();

/* GET users listing. */
  // router.get('/', function(req, res, next) {
  //   res.send('respond with a resource');
  // });


// REgister User
router.post('/register', async (req, res) => {
  // User should secure password beforre sending

  if (isEmpty(name) || isEmpty(password) 
     || !isEmpty(email) || !isEmpty(profileURL) 
     || isEmpty(gender) || toDate(dob) ===null){
       res.json({
         result: "failed",
         data: {},
         message: `name,password,gender must be not empty. Email,profileURL,dob must be in correct forat`
       });
       return;
     }
});

export default router;
