const express = require('express');
const router = express.Router();
const User = require('../../module/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { ReS, ReE } = require('../../utils/utils');
const { secretOrkey } = require('../../config/config');

const passport = require('passport');

router.get('/test', (req, res) => {
    res.json({
        msg: 'server works',
    });
});

router.post('/register', (req, res) => {
    const { userName, passWord, phoneNumber } = req.body;
    //查询数据库
    User.findOne({
        $or: [{ userName }, { phoneNumber }],
    }).then(json => {
        if (json) {
            let msg = '用户名已经存在!!!';
            if (json.phoneNumber === phoneNumber) {
                msg = '手机号码已经存在!!!';
            }
            return ReE(res, { msg });
        } else {
            const newPas = crypto
                .createHmac('sha256', secretOrkey) //我们首先调用crypto模块中的createHmac()方法，通过sha256算法对明文进行哈希化。
                .update(passWord)
                .digest('hex');
            const newUser = new User({
                userName,
                passWord: newPas,
                phoneNumber,
            });
            newUser.save().then(data => {
                return ReS(res, { msg: '注册成功!!!', data });
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { userName, passWord, phoneNumber, activeKey } = req.body;

    if (activeKey === 'account') {
        const newPas = crypto
            .createHmac('sha256', secretOrkey) //我们首先调用crypto模块中的createHmac()方法，通过sha256算法对明文进行哈希化。
            .update(passWord)
            .digest('hex');
        User.findOne({
            userName,
        }).then(json => {
            if (!json) {
                return ReE(res, { msg: '用户不存在!!' }, 404);
            } else if (json.isActive === false) {
                return ReE(res, { msg: '账号未激活!!' }, 403);
            } else if (newPas !== json.passWord) {
                return ReE(res, { msg: '密码错误!!' }, 403);
            } else {
                const { _id, userName, phoneNumber, identity } = json;
                // jwtoken.sign('规则', '加密名字', '{过期时间}', '箭头函数');
                jwt.sign(
                    {
                        _id,
                        phoneNumber,
                        identity,
                        userName,
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                        iat: Math.floor(Date.now() / 1000) - 30,
                    },
                    secretOrkey,
                    (err, token) => {
                        if (err) throw err;
                        console.log(token);
                        return ReS(res, {
                            msg: '登录成功!!!',
                            token: 'Bearer ' + token,
                            identity,
                            userName,
                            phoneNumber,
                        });
                    }
                );
            }
        });
    } else {
    }
});
module.exports = router;
