jest.autoMockOff();

var formatUrl = require('../urls').formatUrl;
var config = require('../../config');


describe("Format url patterns", () => {
    it("should replace <name> with values", () => {
        const data = {id: 1};
        let url = "/test/<id>/";
        let newUrl = formatUrl(url, data);

        expect(newUrl).toBe(config.apiRoot + "/test/1/");
    });

    it("should return the original url if no paramters were passed", () => {
        let url = "/test/";
        let newUrl = formatUrl(url);
        expect(newUrl).toBe(config.apiRoot + "/test/");
    });

    it("should not ", () => {

    })
});
