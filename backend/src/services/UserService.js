import UserRepository from '../repositories/UserRepository.js';

class UserService {
  async registerUser(userData){
    try{
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }
    } catch (e){
      console.error(e);
      throw new Error(e);
    }

    const userId = await UserRepository.createUser(userData);
    // const token = await UserRepository.findToken(userId);
    return {
      // token
      userId
    };
  }

  async loginUser(userData){
    const existingUser = await UserRepository.loginUser(userData);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return existingUser.id;
  }

  async getAllUsers(){
    const users = await UserRepository.getAllUsers();
    return users;
  }
}

export default new UserService();

//module.exports = new UserService();