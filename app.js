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
    console.log("idhar aagya");
    const { name, email, contact, description, block_no, room_no, products, price } = req.body;
    const recipientEmail = email;
    const file = req.file;

    const client = new SMTPClient({
        user: process.env.EMAIL,
        password: process.env.PASSWORD,
        host: 'smtp.gmail.com',
        ssl: true,
    });

    // Build the text content of the email
    let emailText = `Name: ${name}\nEmail: ${email}\n`;

    if (contact) {
        emailText += `Contact: ${contact}\n`;
    }

    if (description) {
        emailText += `Description: ${description}\n`;
    }

    if (block_no) {
        emailText += `Block No./Address: ${block_no}\n`;
    }

    if (room_no) {
        emailText += `Room No.: ${room_no}\n`;
    }

    if (Array.isArray(products) && products.length > 0) {
        const formattedProducts = products.map(product => `- ${product}`).join(' | ');
        emailText += `Products: ${formattedProducts}\n`;
    }

    if (price) {
        emailText += `Price: ${price}\n`;
    }

    const message = {
        text: emailText,
        from: `${recipientEmail} <${recipientEmail}>`,
        to: `${process.env.EMAIL} <${process.env.EMAIL}>`,
        subject: 'jaldhi kar',
        attachment: [
            { data: `Name: ${name}`, alternative: true },
            {
                data: file?.buffer || '', // Check if file is present
                alternative: true,
                type: 'application/octet-stream',
                name: 'document.pdf',
                headers: {
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
