import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppErrors } from "../errors/AppErros";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class AnswerController {
    

    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await surveyUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppErrors('Survey user does not exist');
        }

        surveyUser.value = Number(value);

        await surveyUsersRepository.save(surveyUser);

        return res.status(200).json(surveyUser)
    }
}

export { AnswerController }