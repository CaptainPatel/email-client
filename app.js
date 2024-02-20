import express from 'express';
import multer from 'multer';
import { SMTPClient } from 'emailjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

app.post('/sendForm', upload.single('file'), (req, res) => {
    const { name, email, contact, description, block_no } = req.body;
    const recipientEmail = email;
    const file = req.file;

    const client = new SMTPClient({
        user: process.env.EMAIL,
        password: process.env.PASSWORD,
        host: 'smtp.gmail.com',
        ssl: true,
    });

    const message = {
        text: `
        Name: ${name}
        Email: ${email}
        Contact: ${contact}
        description: ${description}
        block_no./Address : ${block_no}
        `,
        from: `${recipientEmail} <${recipientEmail}>`,
        to: `${process.env.EMAIL} <${process.env.EMAIL}>`,
        subject: 'Print Nikalva Bhai',
        attachment: [
            { data: `Name: ${name}`, alternative: true },
            {
                data: file.buffer, alternative: true, type: 'application/octet-stream', name: 'document.pdf', headers: {
                    'Content-Disposition': 'attachment; filename="document.pdf"',
                }
            },

        ],
    };

    client.send(message, function (err, message) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error sending email' });
        } else {
            console.log('Email sent:', message);
            res.status(200).json({ message: 'File uploaded and email sent successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
