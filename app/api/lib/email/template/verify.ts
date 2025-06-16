import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

export const VerifyEmail = ({
  firstName,
  link,
}: {
  firstName: string;
  link: string;
}) => ({
  subject: `Verify your email ${firstName}!`,
  title: "Verify your email",
  components: [
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Hey ${firstName}!
We need to verify that this email belongs to you.
If you recently signed up on our platform, then please open the link below to confirm the verification:`,
    },
    {
      type: EmailComponentType.BUTTON,
      content: `Verify your email`,
      url: link,
      options: {
        align: "center",
      },
    },
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Please ignore if you haven't signed up on our platform!`,
    },
  ] as EmailComponent[],
});
