import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

export const SosAlert = ({
  firstName,
  link,
}: {
  firstName: string;
  link: string;
}) => ({
  subject: `S.O.S Alert`,
  components: [
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Hey ${firstName}!
We received a request for S.O.S Alert!

Please click on the button below to view the alert.`,
    },
    {
      type: EmailComponentType.BUTTON,
      content: `View Alert`,
      url: link,
      options: {
        align: "center",
      },
    },
    {
      type: EmailComponentType.PARAGRAPH,
      content: `Please ignore if you haven't  requested a S.O.S Alert.`,
    },
  ] as EmailComponent[],
});
