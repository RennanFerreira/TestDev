import { Op } from 'sequelize';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({where: {email:req.body.email}})
    if (userExists){
      return res.status(400).json({error:"User already exists"})
    }
    req.body.password_expiration_date = new Date()
    req.body.password_expiration_date.setMonth(req.body.password_expiration_date.getMonth() + 3)
    req.body.created_at = new Date()
    req.body.updated_at = new Date()
    
    await User.create(req.body)
    return res.status(201).json({message:"User created successfully"})
  }

  async getWithParameter(req, res){
    const {field, value} = req.query
    const fieldList = ["name", "email", "login"]
    if (fieldList.includes(field)){
      const users = await User.findAll({
        where: {
            [field]: {
                [Op.iLike]: value
            }
        }
    })
      return res.status(200).json({result: users})
    }
    return res.status(401).json({error:"Unauthorized request"})
  }
  async delete(req, res){
    const userId = req.params.id
    const deletedUser = await User.destroy({
      where: {
        id: userId
      }
    })
    if (deletedUser === 0){
      return res.status(404).json({error:"User not found"})
    }
    return res.status(200).json({message:"User deleted successfully"})
  }
  async update(req, res){
    const userId = req.params.id
    const user = await User.findByPk(userId)
    if (!user){
      return res.status(404).json({error:"User not exists"})
    }
    let status = 200
    try {
      await user.update(req.body)
    } catch (error) {
      status = 400
    }
    return res.status(status).json({message: status == 200?"User updated successfully":"Database error"})
  }
  async resetPassword(req, res){
    const userId = req.params.id
    const user = await User.findByPk(userId)
    if (!user){
      return res.status(404).json({error:"User not exists"})
    }
    await user.update({password:"novasenha2024"})
    
    return res.status(200).json({message:"You new password has been generated", newPassword:"novasenha2024"})
  }
};
export default new UserController();