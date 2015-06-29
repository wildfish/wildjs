//function getCookie (name) {
//    // From https://docs.djangoproject.com/en/1.7/ref/contrib/csrf/
//    var cookieValue = null, cookies, i, cookie;
//    if (document.cookie && document.cookie !== "") {
//        cookies = document.cookie.split(";");
//        for (i = 0; i < cookies.length; i += 1) {
//            cookie = cookies[i].trim(); // Doesn't work in all browsers
//            // Does this cookie string begin with the name we want?
//            if (cookie.substring(0, name.length + 1) === (name + "=")) {
//                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                break;
//            }
//        }
//    }
//    return cookieValue;
//}

const extraHeaders = {};


function makeRequest (url, method, data) {
    return new Promise((resolve, reject) => {

        url += "?format=json";

        const req = new XMLHttpRequest();

        // We don't want CSRF tokens if we are using this as
        // a public API for now
        //if (method !== "GET") {
        //    req.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        //}

        if (req.overrideMimeType !== undefined) {
            req.overrideMimeType("application/json");
        }

        req.open(method, url, true);
        req.setRequestHeader("Content-Type", "application/json");

        for (let key in extraHeaders) {
            req.setRequestHeader(key, extraHeaders[key]);
        }

        // When done processing data
        req.onreadystatechange = function () {
            if (req.readyState !== 4) {
                return;
            }

            if (req.status >= 200 && req.status <= 299) {
                if (req.responseText) {
                    resolve(JSON.parse(req.responseText));
                } else {
                    resolve();
                }
            } else {
                reject(JSON.parse(req.responseText));
            }
        };

        req.send(JSON.stringify(data));
    });
}


const rest = {
    get: function (url, data) {
        return makeRequest(url, "GET", data);
    },

    post: function (url, data) {
        return makeRequest(url, "POST", data);
    },

    put: function (url, data) {
        return makeRequest(url, "PUT", data);
    },

    patch: function (url, data) {
        return makeRequest(url, "PATCH", data);
    },

    "delete": function (url, data) {
        return makeRequest(url, "DELETE", data);
    },

    setAditionalHeaders: function (key, value) {
        extraHeaders[key] = value;
    },

    removeHeader: function(key) {
        if (key in extraHeaders) {
            delete extraHeaders[key];
        }
    }
};


export {rest};
