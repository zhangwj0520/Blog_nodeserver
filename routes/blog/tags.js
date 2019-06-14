const express = require('express');
const router = express.Router();
const Tags = require('../../module/Tags');

const { ReS, ReE } = require('../../utils/utils');

//$route GET api/users/test
//@desc 返回的请求的json数据
//@access public
router.get('/test', (req, res) => {
    res.json({
        msg: 'server works'
    });
});

router.get('/', (req, res) => {
    let totalSize = 0;
    Tags.count().then(total => {
        totalSize = total;
        Tags.find({}, { color: 1, value: 1, icon: 1, _id: 0 }).then(json => {
            return ReS(res, { msg: '获取标签!!!', data: json, totalSize });
        });
    });
});
router.post('/', (req, res) => {
    console.log(req.body);
    const tags = new Tags();
    Tags.insertMany(req.body).then(json => {
        return ReS(res, { msg: '添加标签成功!!!' });
    });
});

module.exports = router;
