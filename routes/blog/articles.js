const express = require('express');
const router = express.Router();
const Articles = require('../../module/Articles');
const AuthorInfo = require('../../module/AuthorInfo');

const { ReS, ReE, getParams } = require('../../utils/utils');

//$route GET api/users/test
//@desc 返回的请求的json数据
//@access public
router.get('/test', (req, res) => {
    res.json({
        msg: 'server works'
    });
});

router.post('/', (req, res) => {
    const newArt = new Articles({
        title: req.body.title,
        access: req.body.access,
        tag: req.body.tag,
        abstract: req.body.abstract,
        type: req.body.type,
        content: req.body.content,
        nature: req.body.nature
    });
    newArt
        .save()
        .then(art => {
            console.log(art);
            return ReS(res, { msg: '创建成功!!!' });
        })
        .catch(err => console.log(err));
});

router.put('/', (req, res) => {
    let { _id, ...data } = req.body;
    console.log(data);

    Articles.findOneAndUpdate(
        {
            _id: _id
        },
        data,
        { new: true }
    ).then(data => {
        return ReS(res, { data, msg: '更新成功!!!' });
    });
});

router.get('/', (req, res) => {
    const { pageIndex, pageSize, ...obj } = getParams(req);
    console.log(obj);
    let skipnum = (pageIndex - 1) * pageSize; //跳过数

    let totalSize = 0;
    Articles.count().then(total => {
        totalSize = total;
        Articles.find(obj)
            .sort({ create_at: -1 })
            .skip(skipnum)
            .limit(Number(pageSize))
            .exec((err, data) => {
                ReS(res, { data: data, totalSize, msg: '数据请求成功!!!' });
                // res.send({ });
            });
    });
});
router.get('/:id', (req, res) => {
    //console.log(req.params.id)
    let tempAccess = 0;
    Articles.findOne({
        _id: req.params.id
    }).then(data => {
        tempAccess = data.access + 1;
        Articles.find({ _id: req.params.id }, (err, data) => {
            var temp = data[0];
            temp.access = tempAccess;
            temp.save();
        });
        res.send(data);
    });
});

//search
router.post('/search', (req, res) => {
    const { pageIndex, pageSize, title, type, nature } = req.body;
    let skipnum = (pageIndex - 1) * pageSize;
    let obj = {};
    if (title) {
        obj.title = title;
    }
    if (type) {
        obj.type = type;
    }
    if (nature) {
        obj.nature = nature;
    }
    Articles.find(obj).exec((err, data) => {
        let len = data.length;
        // console.log(data[skipnum])
        //let newData = data.slice(skipnum, pageSize);
        // console.log(newData);
        res.send({ len, data });
    });
    // Articles.find(obj).skip(skipnum).limit(Number(pageSize)).exec((err, data)=>{
    //   res.send(data.reverse());
    // })
    // let tmp = req.url.split("?")[1];
    // let [pageIndex, pageSize] = tmp.split('&');
    // pageIndex = pageIndex.split('=')[1]; // 当前页
    // pageSize = pageSize.split('=')[1]; // 一页有多少条数据
    // let skipnum = (pageIndex - 1) * pageSize;   //跳过数
    // Articles.find().skip(skipnum).limit(Number(pageSize)).exec((err, data) => {
    //   res.send(data.reverse());
    // })
});

router.delete('/delete/:id', (req, res) => {
    Articles.deleteOne({
        _id: req.params.id
    }).then(data => {
        Articles.count((err, count) => {
            AuthorInfo.find(
                {
                    _id: '5bb78386250532209f443968'
                },
                (err, doc) => {
                    (doc[0].ArticleNum = count), (doc[0].lastArticle = data);
                    doc[0].save();
                }
            );
        });
        res.send(data);
    });
});

module.exports = router;
