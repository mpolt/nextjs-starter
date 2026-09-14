type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
};

/**
 * Dev mailer: logs emails to the console until a real provider is wired up.
 */
export function sendEmail({ to, subject, text }: SendEmailOptions) {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[email] No mail provider configured — message logged to console only. Wire up a real provider in src/lib/email.ts before going live.",
    );
  }

  console.info("\n========== EMAIL (dev) ==========");
  console.info(`To: ${to}`);
  console.info(`Subject: ${subject}`);
  console.info(text);
  console.info("=================================\n");
}
