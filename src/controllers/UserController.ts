import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import * as yup from 'yup';
import { AppErrors } from "../errors/AppErros";

class UserController {

    async index(req: Request, res: Response) {
        const userRepository = getCustomRepository(UserRepository);
        const users = await userRepository.find();

        return res.status(200).json(users)
    }

    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        if (!(await schema.isValid(req.body))) {
            throw new AppErrors('Validation Failed!');
        }
        const userRepository = getCustomRepository(UserRepository);

        const userExists = await userRepository.findOne({ 
            email
        })
        
        if (userExists) {
            throw new AppErrors("User with this email already exists");
        }
        const user = userRepository.create({
            name, email
        });

        await userRepository.save(user);

        return res.status(201).json(user)
    }

    async delete (req: Request, res: Response) {
        
    }
}

export { UserController };
