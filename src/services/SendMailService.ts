import fs from 'fs';
import hbs from 'handlebars';
import nodemail, { Transporter } from 'nodemailer';

class SendMailService {

    private client: Transporter

    constructor() {
        nodemail.createTestAccount().then(account => {
            const transporter = nodemail.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })
            this.client = transporter;
        });

    }

    async send(to: string, subject: string, variables: object, path: string) {
        
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const mailTemplateParse = hbs.compile(templateFileContent);
        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com.br>"
        });

        console.log(message.messageId);
        console.log(`Preview URL % ${nodemail.getTestMessageUrl(message)}`)
    }
}

export default new SendMailService();