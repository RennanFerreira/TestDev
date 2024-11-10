import { Op } from 'sequelize';
import User from '../models/User';
import bcrypt from 'bcryptjs';

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
        attributes:["login", "name", "last_name", "email", "status", "password_expiration_date", "access_group"],where: {
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
    const user = await User.findByPk(req.userId)
    console.log(JSON.stringify(user))
    if(user.access_group !== 'superadmin' ){
      return res.status(401).json({error:"User lacks privilege"})
    }
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
    // Pega o id pela url
    const userId = req.params.id

    // Compara o id com a pk e retorna o usuário que os dois valores forem correspondentes
    const user = await User.findByPk(userId)

    if (!user){
      // Retorna um erro se o o id e a pk não forem correspondentes
      return res.status(404).json({error:"User not exists"})
    }

    // Cria uma variavel que receberá como valor a data/hora atual no momento da criação
    let newDate = new Date()
    
    // Checa se o campo pass foi preenchido, sendo positivo, atualiza a expiration_date
    if (req.body.password){
      await user.update({password_expiration_date: newDate.setMonth(newDate.getMonth() + 3)})
    }
    // codigo 200 = sucesso
    let status = 200

    // As informações além da expiration date serão atualizadas ou um erro será retornado
    try {
      await user.update(req.body)
    } catch (error) {
      // codigo 400 = erro
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
    const newDate = new Date()
    newDate.setMonth(newDate.getMonth() + 3)

    await user.update({password:"novasenha2024", password_expiration_date: newDate})
    
    return res.status(200).json({message:"You new password has been generated", newPassword:"novasenha2024"})
  }
  async index(req, res){
    const users = await User.findAll({attributes:["id","login", "name", "last_name", "email", "status", "password_expiration_date", "access_group"]})
    return res.status(200).json(users)
  }
  async getById(req, res){
    const userId = req.params.id
    const user = await User.findByPk(userId, {attributes:["id","login", "name", "last_name", "email", "status", "password_expiration_date", "access_group"]})
    return res.status(200).json(user)
  }
};
export default new UserController();