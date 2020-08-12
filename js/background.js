/**
 * gets message send from the content script and sends response back
 *  @param {function} | function having request body, the sender of request and send response call back
 * @param {object} | request - request sent by sender
 * @param {object} | sender of the request 
 * @param {function} | sendResponse - to send response back to the sender
 */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let { pandaDocApi, type } = request;
	switch (type) {
		case 'fetchTemplates': {
			fetchTemplates(pandaDocApi).then((response) =>
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
async function fetchTemplates(apiKey) {
	var myHeaders = new Headers();
	myHeaders.append('Authorization', `API-Key ${apiKey}`);
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	let response = await fetch('https://api.pandadoc.com/public/v1/templates', requestOptions);
	let responseBody = await response.json();
	return responseBody;
}
