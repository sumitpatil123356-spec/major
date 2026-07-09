import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

const resendApiKey = process.env.RESEND_API_KEY || "";

export const sendEmailWithResend = createServerFn({ method: "POST" })
  .validator(
    z.object({
      to: z.string().email(),
      subject: z.string(),
      html: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    console.log(
      `[Resend Server Function] Attempting to send email. To: ${data.to}, Subject: ${data.subject}`,
    );

    if (!resendApiKey || resendApiKey === "re_your_resend_api_key_here") {
      console.log(`[Resend MOCK MODE] API key is missing. Simulation:
      ----------------------------------------
      To: ${data.to}
      Subject: ${data.subject}
      Body: ${data.html.replace(/<[^>]*>/g, "")}
      ----------------------------------------`);
      return { success: true, mock: true };
    }

    try {
      const resend = new Resend(resendApiKey);
      const result = await resend.emails.send({
        from: "ReShelf Alerts <onboarding@resend.dev>",
        to: data.to,
        subject: data.subject,
        html: data.html,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
      return { success: true, id: result.data.id };
    } catch (err) {
      console.error("[Resend Error]:", err);
      throw err;
    }
  });
