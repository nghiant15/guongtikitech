const axios = require('axios').default;
axios.defaults.baseURL = "https://services.ghtklab.com";

const connect = async function (url = "", data = {}, type) {

    let options = {
        headers: {
            'Content-Type': 'application/json',
            'Token': "dFC8c89c6b8108f46b8e653B929634c7cfe98E6c"
        },
    };

    try {
        switch (type) {
            case "GET":
                let get = await axios.get(url, data, options);
                if (get.is_success == false) {
                    return null;
                }
                return get.data;
            case "POST":
                let post = await axios.post(url, data, options);
                if (post.is_success == false) {
                    return null;
                }
                return post.data;
            case "PUT":
                let put = await axios.put(url, data, options);
                if (put.is_success == false) {
                    return null;
                }
                return put.data;
            case "DELETE":
                let del = await axios.delete(url, data, options);
                if (del.is_success == false) {
                    return null;
                }
                return del.data;
        }

    } catch (reason) {
        return reason;
    }


}

module.exports = connect;
