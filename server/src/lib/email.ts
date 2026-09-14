import { Resend } from "resend";
import { env } from "../env.js";

const resend = new Resend(env.RESEND_API_KEY);
const FROM = "DevBoard <notifications@devboard.app>";

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) console.error("Resend send error:", error);
  } catch (err) {
    console.error("Email send failed:", err); // rule 12: email sending never throws
  }
}

export async function sendInviteEmail(params: {
  to: string;
  workspaceName: string;
  inviterName: string;
  token: string;
}) {
  const acceptUrl = `${env.FRONTEND_URL}/invite?token=${params.token}`;
  await sendEmail({
    to: params.to,
    subject: `${params.inviterName} invited you to ${params.workspaceName} on DevBoard`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#8b5cf6;">You've been invited to DevBoard</h2>
      <p><strong>${params.inviterName}</strong> invited you to join <strong>${params.workspaceName}</strong>.</p>
      <a href="${acceptUrl}" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#8b5cf6,#06b6d4);color:white;text-decoration:none;border-radius:5px;margin-top:12px;">Accept invite</a>
      <p style="color:#9090a8;font-size:13px;margin-top:24px;">This invite expires in 7 days.</p>
    </div>`,
  });
}
