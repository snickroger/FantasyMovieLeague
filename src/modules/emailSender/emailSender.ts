import mailgun from "mailgun-js";
import { Player } from "../../models/player";
import { EmailMessage } from "./emailMessage";
import { IEmailSender } from "./iemailSender";

export class EmailSender implements IEmailSender {
  public async sendMail(emailMessage: EmailMessage): Promise<void> {
    if (process.env.MAILGUN_API_KEY === undefined) {
      console.error("Mailgun API Key not set");
      return;
    }
    const apiKey = process.env.MAILGUN_API_KEY || "";
    const domain = process.env.MAILGUN_DOMAIN || "";
    const mg = mailgun({ apiKey, domain });

    const mailgunEnvelope = {
      "from": emailMessage.from,
      "to": emailMessage.to,
      "bcc": emailMessage.bcc,
      "subject": emailMessage.subject,
      "text": emailMessage.text,
      "h:sender": emailMessage.from,
    };

    try {
      await mg.messages().send(mailgunEnvelope);
    } catch (e) {
      console.error(e);
    }
  }

  public getEmail(email: string, player: Player, seasonName: string): EmailMessage {
    const messageBody = this.getText(player, seasonName);
    const recipient = `${player.name} <${email}>`;
    const bcc = process.env.MAILGUN_BCC || "";
    return new EmailMessage(recipient, bcc, messageBody, seasonName);
  }

  private getText(player: Player, seasonName: string): string {
    let bonus1Movie = "";
    let bonus2Movie = "";
    let messageBody = `Hey ${player.name},

    Here are the share selections you just made for the Fantasy Movie League (${seasonName}):

    `;
    for (const share of player.shares) {
      messageBody += `\t${share.movie.name}: ${share.numShares}\n`;
      if (player.bonus1Id === share.movie.id) {
        bonus1Movie = share.movie.name;
      }
      if (player.bonus2Id === share.movie.id) {
        bonus2Movie = share.movie.name;
      }
    }

    messageBody += `
    \tBest Movie Bonus: ${bonus1Movie}
    \tWorst Movie Bonus: ${bonus2Movie}

    --
    Thanks,
    Nick

    `;
    return messageBody;
  }
}
