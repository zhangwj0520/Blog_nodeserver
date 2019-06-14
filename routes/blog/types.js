const express = require('express');
const router = express.Router();
const Types = require('../../module/ArtTypes');

const { ReS, ReE } = require('../../utils/utils');

//$route GET api/users/test
//@desc 返回的请求的json数据
//@access public

router.get('/', (req, res) => {
    let totalSize = 0;
    Types.count().then(total => {
        totalSize = total;
        Types.find({}, { value: 1, _id: 0 }).then(json => {
            return ReS(res, { msg: '获取类型!!!', data: json, totalSize });
        });
    });
});
router.post('/', (req, res) => {
    Types.insertMany(req.body.data).then(json => {
        return ReS(res, { msg: '添加类型成功!!!' });
    });
});

module.exports = router;
