export type SendEmailInput = {
  to: string
  subject: string
  text: string
}

/**
 * Dev stub: logs email content instead of sending.
 * Replace the body with a real provider later (Resend, SES, …).
 */
export async function sendEmail({ to, subject, text }: SendEmailInput) {
  console.info("================================================")
  console.info("[email]", {
    to,
    subject,
    text,
  })
}
