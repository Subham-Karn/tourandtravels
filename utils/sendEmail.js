import transporter from "../config/nodemailer.js";

const sendMail = async (email, token) => {

    const resetLink = `http://localhost:4000/auth/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Bihar Travel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",

        html: `
            <h2>Password Reset Request</h2>

            <p>Hello,</p>

            <p>You requested to reset your password.</p>

            <a
                href="${resetLink}"
                style="
                    background:#ffa500;
                    color:#fff;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>

            <br>

            <p>Bihar Travel</p>
        `,
    });

};

export default sendMail;