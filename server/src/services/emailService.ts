import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            console.log(`Email sent successfully to ${options.to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendCredentialsEmail(
        to: string,
        employeeName: string,
        loginId: string,
        password: string
    ): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background-color: white;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .credentials-box {
                        background-color: #f0f4ff;
                        border: 2px solid #667eea;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .credential-item {
                        margin: 15px 0;
                        padding: 10px;
                        background-color: white;
                        border-radius: 5px;
                    }
                    .label {
                        font-weight: bold;
                        color: #667eea;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .value {
                        font-size: 16px;
                        color: #333;
                        font-family: 'Courier New', monospace;
                        background-color: #f9f9f9;
                        padding: 8px;
                        border-radius: 4px;
                        display: inline-block;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border: 1px solid #ffc107;
                        color: #856404;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-size: 14px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to Dayflow HRMS!</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${employeeName}</strong>,</p>
                        
                        <p>Welcome to the team! Your employee account has been created successfully. Below are your login credentials to access the Dayflow HRMS portal:</p>
                        
                        <div class="credentials-box">
                            <h3 style="margin-top: 0; color: #667eea;">Your Login Credentials</h3>
                            
                            <div class="credential-item">
                                <span class="label">Login ID:</span>
                                <span class="value">${loginId}</span>
                            </div>
                            
                            <div class="credential-item">
                                <span class="label">Temporary Password:</span>
                                <span class="value">${password}</span>
                            </div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Important Security Notice:</strong>
                            <ul style="margin: 10px 0;">
                                <li>This is a temporary password. You will be required to change it on your first login.</li>
                                <li>Please keep your credentials confidential and do not share them with anyone.</li>
                                <li>Choose a strong password that includes uppercase, lowercase, numbers, and special characters.</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
                                Login to Portal
                            </a>
                        </div>
                        
                        <p>If you have any questions or need assistance, please contact your HR administrator.</p>
                        
                        <p>Best regards,<br>
                        <strong>Dayflow HRMS Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2026 Dayflow HRMS. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: '🔑 Your Dayflow HRMS Login Credentials',
            html,
        });
    }
}

export default new EmailService();
