import { Player } from "../../models/player";
import { EmailMessage } from "./emailMessage";

export interface IEmailSender {
  sendMail(emailMessage: EmailMessage): Promise<void>;
  getEmail(email: string, player: Player, seasonName: string): EmailMessage;
}
