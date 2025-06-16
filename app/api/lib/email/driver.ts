import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  emails: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }[],
) {
  if (emails.length > 1) {
    return resend.batch.send(
      emails.slice(0, 100).map((data) => ({
        from: "himmat@resend.dev",
        replyTo: "himmat@resend.dev",
        ...data,
      })),
    );
  }
  const email = emails[0];
  if (email)
    return resend.emails.send({
      from: "himmat@resend.dev",
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: "himmat@resend.dev",
    });
}
