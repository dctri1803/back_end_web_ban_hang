const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');
const EmailService = require('../services/EmailService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'error',
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is not found'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (err) {
            reject(err)
        }
    })
}

const changePassword = (userId, currentPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: userId
            });

            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }

            const isMatch = bcrypt.compareSync(currentPassword, user.password);

            if (!isMatch) {
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu hiện tại của bạn không đúng'
                });
                return;
            }

            const isSameAsCurrent = bcrypt.compareSync(newPassword, user.password);

            if(isSameAsCurrent) {
                resolve({
                    status: 'ERR',
                    message: 'Cần đặt mật khẩu mới khác với mật khẩu hiện tại'
                })
            }

            const hash = bcrypt.hashSync(newPassword, 10);

            user.password = hash;
            await user.save();

            resolve({
                status: 'OK',
                message: 'Đổi mật khẩu thành công'
            });
        } catch (err) {
            reject(err);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser == null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not found'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (err) {
            reject(err)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser == null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not found'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete user successfully',
            })

        } catch (err) {
            reject(err)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({_id: ids})

            resolve({
                status: 'OK',
                message: 'Delete users successfully',
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getAllUser = ( limit, page, sort, filters ) => {
    return new Promise(async (resolve, reject) => {
        try {

            let filterObject = {};
            if (filters) {
                Object.keys(filters).forEach(key => {
                    filterObject[key] = { $regex: filters[key]}; 
                });
            }

            const totalUser = await User.countDocuments(filterObject)
            let query = User.find(filterObject).limit(limit).skip(page*limit)

            if(sort.field && sort.order) {
                const sortObject = {}
                sortObject[sort.field] = sort.order
                query = query.sort(sortObject)
            }

            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser,
                totalUser: totalUser,
                currentPage: Number(page + 1),
                totalPage: Math.ceil(totalUser / limit)
            })

        } catch (err) {
            reject(err)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user == null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Details user',
                data: user
            })

        } catch (err) {
            reject(err)
        }
    })
}

const generateOtp = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit OTP
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            EmailService.sendOtp(email, otp);
            await user.save();

            resolve({
                status: 'OK',
                message: 'OTP generated',
                data: { otp } // for testing purposes, in production do not send OTP in response
            });
        } catch (err) {
            reject(err);
        }
    });
};

const resetPassword = (email, otp, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }
            if (user.otp !== otp || new Date() > user.otpExpiry) {
                resolve({
                    status: 'ERR',
                    message: 'Invalid or expired OTP'
                });
                return;
            }

            const hash = bcrypt.hashSync(newPassword, 10);
            user.password = hash;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            resolve({
                status: 'OK',
                message: 'Password reset successfully'
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    changePassword,
    updateUser,
    deleteUser,
    deleteManyUser,
    getAllUser,
    getDetailsUser,
    generateOtp,
    resetPassword
}