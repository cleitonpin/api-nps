import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class NpsController {
    

    async execute(req: Request, res: Response) {
        const { survey_id } = req.params;

        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUsers = await surveyUsersRepository.find({ survey_id, value: Not(IsNull()) })

        const detractors = surveyUsers.filter(surveys => surveys.value >= 0 && surveys.value <= 6).length;
        const passives = surveyUsers.filter(surveys => surveys.value >= 7 && surveys.value <= 8).length;
        const promoters = surveyUsers.filter(surveys => surveys.value >= 9 && surveys.value <= 10).length;
        const totalAnswer = surveyUsers.length;

        const npsValue = Number(((promoters - detractors) / totalAnswer) * 100).toFixed(2);

        return res.status(200).json({
            detractors,
            passives,
            promoters,
            totalAnswer,
            nps: npsValue
        })
    }
}

export { NpsController }