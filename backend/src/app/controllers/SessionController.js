import { Op } from 'sequelize';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionController {
  async store(req, res) {
    // Pega login e senha que o usuario preencheu
    const {login, password} = req.body

    // Compara os valores do login inserido com o login do banco de dados
    const user = await User.findOne({where: {login}})

    // Caso a compração não tenha sucesso, retorna um erro
    if(!user){
      return res.status(401).json({error:"Login or password is incorrect"})
    }

    if(user.status !== 'ativo'){
      return res.status(401).json({error:"Unauthorized"})
    }

    // Checa se a senha corresponde ao cadastro
    if(!(await user.checkPassword(password))){
      return res.status(401).json({error:"Login or password is incorrect"})
    }

    // Das informações que foram obtidas na linha 13, separa id e nível de acesso
    const {id, access_group} = user
    if(access_group === 'user'){
      return res.status(401).json({error:"User lacks privilege"})
    }

    // Retorna um json web token que permite que o usuário acesse a aplicação e determina a duração da sessão(7 dias)
    return res.status(200).json({token: jwt.sign({id, access_group}, authConfig.secret, {
      expiresIn: authConfig.expiresIn
    })})
  }
};
export default new SessionController();