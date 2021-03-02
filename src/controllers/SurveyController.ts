import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyController {

    async index(req: Request, res: Response) {
        const surveyRepository = getCustomRepository(SurveyRepository);
        const allSurveys = await surveyRepository.find();

        return res.status(200).json(allSurveys)
    }

    async create(req: Request, res: Response) {
        const { title, description } = req.body;
        const surveyRepository = getCustomRepository(SurveyRepository);


        const user = surveyRepository.create({
            title, description
        });

        await surveyRepository.save(user);

        return res.status(201).json(user)
    }

    async delete (req: Request, res: Response) {
        
    }
}

export { SurveyController };

