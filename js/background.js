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
					templates: response
				})
			);
			return true;
		}
		case 'postTemplate': {
			let { baseUrl, selectedTemplate, documentName, candidateDetails } = request;
			postTemplate(baseUrl, selectedTemplate, documentName, candidateDetails).then((response) => {
				sendResponse({
					sent: true
				});
			});
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

async function postTemplate(baseUrl, selectedTemplate, documentName, candidateDetails) {
	let { email, prospectEmail } = candidateDetails;
	var myHeaders = new Headers();
	myHeaders.append('Authorization', 'API-Key 72bb32e425f5a38949c0378ebe8cf66873cf494a');
	myHeaders.append('Accept', 'application/json');

	var formdata = new FormData();
	formdata.append('template_id', selectedTemplate);
	formdata.append('email', email);
	formdata.append('applicant_id', prospectEmail);
	formdata.append('document_name', documentName);

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: formdata,
		redirect: 'follow'
	};

	fetch(`${baseUrl}/api/v1/documents`, requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log('error', error));
}
