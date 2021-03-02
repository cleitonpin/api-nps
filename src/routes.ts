import { Router } from "express";
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";
import { SendMailController } from "./controllers/SendMailController";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const surveyUsersController = new SendMailController();
const answerUsersController = new AnswerController();
const npsController = new NpsController();

router.route('/user')
    .post(userController.create)
    .get(userController.index);

router.route('/survey')
    .post(surveyController.create)
    .get(surveyController.index);

router.post('/sendMail', surveyUsersController.execute);
router.get('/answers/:value', answerUsersController.execute)
router.get('/nps/:survey_id', npsController.execute)

export { router }