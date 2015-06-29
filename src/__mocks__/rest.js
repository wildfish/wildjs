const requests = [];

class FakeRequest {
    constructor(onSuccess, onFail) {
        this.onSuccess = onSuccess;
        this.onFail = onFail;
    }

    success(data) {
        this.onSuccess(data);
    }

    fail(errors) {
        this.onFail(errors);
    }
}


function makeFakeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const request = new FakeRequest((response) => {
            resolve(response);
        }, reject);
        request.data = data;
        requests.push(request);
    });
}


export default {
    get(url, data) {
        return makeFakeRequest(url, data);
    },

    post(url, data) {
        return makeFakeRequest(url, data);
    },

    put(url, data) {
        return makeFakeRequest(url, data);
    },

    patch(url, data) {
        return makeFakeRequest(url, data);
    },

    "delete"(url, data) {
        return makeFakeRequest(url, data);
    },

    success(data) {
        requests[0].success(data);
    },

    fail(errors) {
        requests[0].fail(errors);
    }
};
