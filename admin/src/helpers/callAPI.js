import constants from './../contants/contants'

const axios = require('axios').default;
axios.defaults.baseURL = constants.BASE_URL;

const connect = async function (url = "", data = {}, token = "", type) {
  let options = {};
  // console.log("Token: ", token)
  if (token) {
    options = {
      headers: token
    };
  }
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

export default connect;
