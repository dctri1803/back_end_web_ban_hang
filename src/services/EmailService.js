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
        <div> alt="Sản phẩm"> </div>
        </div>`
    })

    let info = await transporter.sendMail({
        from: '"Dịch vụ 👻" của TAKA', // sender address
        to: `${email}`, // list of receivers
        subject: "Đơn hàng của bạn", // Subject line
        text: "Đơn hàng của bạn đã đặt tại TAKA", // plain text body
        html: `<div><b>Cảm ơn bạn đã đặt hàng tại TAKA</b></div>${listItem}`, // html body
    });
}

const sendOtp = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Service 👻" from TAKA',
        to: `${email}`,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        html: `<div>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</div>`,
    });
};

module.exports = {
    sendEmailCreateOrder,
    sendOtp
}