import UserService from '../services/UserService.js';
import res from 'express/lib/response.js'

class UserController {
  async register(req, res) {
    try{
      console.log(`[${(new Date()).toISOString()}] - UserController.register - ${JSON.stringify(req.body)}`);
      const user = await UserService.registerUser(req.body);
      res.status(201).json(user);
    } catch(error){
      res.status(400).json({error: error.message});
    }
  }

  async login(req, res) {
    try{
      console.log(`[${(new Date()).toISOString()}] - UserController.login - ${JSON.stringify(req.query)}`);
      const user = await UserService.loginUser(req.query);
      res.status(200).json(user);
    } catch(error){
      res.status(400).json({error: error.message});
    }
  }

  async getAllUsers(req,res){
    try{
      console.log(`[${(new Date()).toISOString()}] - UserController.getAllUsers - ${JSON.stringify(req.body)}`);
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error){
      res.status(400).json({error: error.message});
    }
  }
}

export default new UserController();

//module.exports = new UserController();