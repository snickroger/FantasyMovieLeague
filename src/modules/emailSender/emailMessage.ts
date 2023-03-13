export class EmailMessage {
  public from = "Fantasy Movie League <movie@nickroge.rs>";
  public to: string;
  public bcc: string;
  public subject: string;
  public text: string;

  constructor(recipient: string, bcc: string, messageBody: string, seasonName: string) {
    this.to = recipient;
    this.bcc = bcc;
    this.subject = `Your Fantasy Movie League Submissions: ${seasonName}`;
    this.text = messageBody;
  }
}
