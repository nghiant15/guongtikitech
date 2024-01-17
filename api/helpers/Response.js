
module.exports = function (status, message, data, is_success) {
    var res = {
        status: status,
        message: message,
        data: data,
        is_success: is_success
    }

    res.status = status;
    res.message = message;
    res.data = data;
    res.is_success = is_success;
    return res;
}
