const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, } = req.body
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckEmail = re.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'error',
                message: 'The input is requied'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'error',
                message: 'The input email is invalid'
            })
        } else if (confirmPassword !== password) {
            return res.status(200).json({
                status: 'error',
                message: 'The cofirm password is not equal to the password'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckEmail = re.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'error',
                message: 'The input is requied'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'error',
                message: 'The input email is invalid'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        })
        return res.status(200).json({ ...newResponse, refresh_token })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'You are log out'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.params.id
        const { currentPassword, newPassword } = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.changePassword(userId, currentPassword, newPassword)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUser = async (req, res) => {
    try {
        const userIds = req.body.ids
        if (!userIds) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userIds is required'
            })
        }
        const response = await UserService.deleteManyUser(userIds)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const { limit, page, sortField, sortOrder, ...filters } = req.query
        const sort = {
            field: sortField,
            order: sortOrder
        };
        const response = await UserService.getAllUser(Number(limit) || null, Number(page) || 0, sort, filters)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email", email)
        if (!email) {
            return res.status(200).json({
                status: 'error',
                message: 'The email is required'
            });
        }
        const response = await UserService.generateOtp(email);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(200).json({
                status: 'error',
                message: 'All fields are required'
            });
        }
        const response = await UserService.resetPassword(email, otp, newPassword);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    changePassword,
    deleteUser,
    deleteManyUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    forgotPassword,
    resetPassword
}