/**
 * gets message send from the content script and sends response back
 *  @param {function} | function having request body, the sender of request and send response call back
 * @param {object} | request - request sent by sender
 * @param {object} | sender of the request 
 * @param {function} | sendResponse - to send response back to the sender
 */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let { baseUrl, type } = request;
	switch (type) {
		case 'fetchTemplates': {
			fetchTemplates(baseUrl).then((response) =>
				sendResponse({
					templates: response.results
				})
			);
			return true;
		}
		default:
			return true;
	}
});

/**
 * fetches the templates from the pandadoc api
 * @param {string} apiKey 
 */
async function fetchTemplates(baseUrl) {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	let response = await fetch(`${baseUrl}/api/v1/templates`, requestOptions);
	let responseBody = await response.json();
	return responseBody;
}
