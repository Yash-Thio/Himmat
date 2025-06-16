import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

export const ResetPassword = ({
  firstName,
  link,
}: {
  firstName: string;
  link: string;
}) => ({
  subject: `Reset your password!`,
  components: [
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Hey ${firstName}!
We received request to reset your password!  

Please click on the button below to reset your password.`,
    },
    {
      type: EmailComponentType.BUTTON,
      content: `Reset your password`,
      url: link,
      options: {
        align: "center",
      },
    },
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Please ignore if you haven't  requested a password reset.`,
    },
  ] as EmailComponent[],
});
