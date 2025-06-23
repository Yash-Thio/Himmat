import { getRenderedTemplate } from "@backend/lib/email/html";
import { getRenderedTemplateText } from "@backend/lib/email/text";
import { EmailComponent } from "@backend/lib/email/types";

import { sendEmail } from "./driver";
import { ResetPassword } from "./template/reset-password";
import { SosAlert } from "./template/sos-alert";
import { VerifyEmail } from "./template/verify";

export const Template = {
  VerifyEmail,
  ResetPassword,
  SosAlert,
};

export function sendTemplateEmail<T extends keyof typeof Template>(
  to: string,
  template: T,
  meta: Parameters<(typeof Template)[T]>[0],
) {
  return sendEmail(
    getTemplate(template, [
      {
        to,
        meta,
      },
    ]),
  );
}

export function getTemplate<T extends keyof typeof Template>(
  template: T,
  data: {
    to: string;
    meta: Parameters<(typeof Template)[T]>[0];
  }[],
) {
  return data.map(({ to, meta }) => {
    const method: {
      subject: string;
      title?: string;
      components: EmailComponent[];
    } = Template[template](meta);
    return {
      to,
      subject: method.subject,
      text: getRenderedTemplateText(
        method.title || method.subject,
        method.components,
      ),
      html: getRenderedTemplate(
        method.title || method.subject,
        method.components,
      ),
    };
  });
}

export function sendBatchTemplateEmail<T extends keyof typeof Template>(
  template: T,
  data: {
    to: string;
    meta: Parameters<(typeof Template)[T]>[0];
  }[],
) {
  return sendEmail(getTemplate(template, data));
}
