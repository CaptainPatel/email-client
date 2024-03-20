import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

app.post('/sendForm', upload.single('file'), async (req, res) => {
    console.log("idhar aagya");
    const { name, email, contact, description, block_no, room_no, products, price } = req.body;
    const file = req.file;

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

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'jaldhi kar',
        text: emailText,
        attachments: [
            {
                filename: 'document.pdf',
                content: file?.buffer || "",
            }
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
        res.status(200).json({ message: 'File uploaded and email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
