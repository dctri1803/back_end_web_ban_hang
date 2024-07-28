const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let listItem = ''
    orderItems.forEach((order) => {
        listItem += `<div>
        <div>Bạn đã đặt hàng thành công</div>
        <div>Sản phẩm: <b>${order.name}</b>, số lượng: <b>${order.amount}</b>, giá tiền: <b>${order.price}</b></div>
        <div><img src=${order.image} alt="Sản phẩm"> </div>
        </div>`
    })

    let info = await transporter.sendMail({
        from: '"Dịch vụ 👻"  TAKA', // sender address
        to: `${email}`, // list of receivers
        subject: "Đơn hàng của bạn", // Subject line
        text: "Đơn hàng của bạn đã đặt tại TAKA", // plain text body
        html: `<div><b>Cảm ơn bạn đã đặt hàng tại TAKA</b></div>${listItem}`, // html body
    });
}

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



module.exports = {
    sendEmailCreateOrder
}