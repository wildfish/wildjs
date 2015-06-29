import config from "../config";


/*****************************
 * Format a url based on args
 *****************************/
export function formatUrl(url, args) {
    let result = config.apiRoot + url;

    if (args === undefined) {
        return result;
    }

    for (let k in args) {
        result = result.replace("<" + k + ">", args[k]);
    }

    return result;
}
