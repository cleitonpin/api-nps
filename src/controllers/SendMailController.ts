import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import path from 'path'
import { AppErrors } from "../errors/AppErros";

class SendMailController {

    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does no exists' })
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        if (!survey) {
            throw new AppErrors('Surveys does not exists' );
        }

        const surveyUserExist = await surveyUsersRepository.findOne({
            where: { user_id: user.id , value: null },
            relations: ["user", "survey"]
        })
        
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: '',
            link: process.env.URL_MAIL
        };

        const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'nps.mail.hbs');

        if (surveyUserExist) {
            variables.id = surveyUserExist.id;
            await SendMailService.send(email, survey.title, variables, npsPath);
            return res.json(surveyUserExist)
        }

        const surveyUser = surveyUsersRepository.create({ 
            user_id: user.id,
            survey_id
        });
        await surveyUsersRepository.save(surveyUser);
        // Envio de email
        try {
            variables.id = surveyUser.id;
            await SendMailService.send(email, survey.title, variables, npsPath);
        } catch (e) {
            console.log(e)
        }

        return res.json(surveyUser);
    }

    async delete (req: Request, res: Response) {
        
    }
}

export { SendMailController };

