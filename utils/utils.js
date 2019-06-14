// Success Web Response
const ReS = function(res, data, code) {
    let send_data = { success: true, msg: '请求成功！' };

    if (typeof data == 'object') {
        send_data = Object.assign(send_data, data); //merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data);
};
// Error Web Response
const ReE = function(res, err, code) {
    if (typeof err == 'object' && err.msg) {
        err = err.msg;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, msg: err });
};

module.exports = { ReS, ReE };

module.exports.getParams = getParams = function(req) {
    let queryAry = req.url.split('?')[1].split('&');
    let queryObj = queryAry.reduce((obj, item) => {
        const [key, value] = item.split('=');
        obj[key] = value;
        return obj;
    }, {});
    return queryObj;
};
