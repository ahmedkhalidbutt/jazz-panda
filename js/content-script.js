let host = document.location.host;
let modal, refreshedInterval, templateSelect;
let baseUrl = '';


init();

function init() {
	console.log(host);
	if (host === 'app.jazz.co') {
		refreshedInterval = window.setInterval(checkUrl, 1000);
	}
}

/**
 * check if url matches with the message parameter
 */

function checkUrl() {
	if (window.location.pathname.includes('message')) {
		fetchApiKey();
	} else {
		console.log('not matched');
	}
}

/**
 * Fetch API Key from chrome storage
 */
function fetchApiKey() {
	chrome.storage.sync.get([ 'baseUrl' ], function(result) {
		console.log(result);
		if (result.baseUrl) {
			baseUrl = result.baseUrl;
			stopInterval();
		} else {
			alert('Set API Key');
		}
	});
}

/**
 * clears the interval for url check and calls add button function
 */

function stopInterval() {
	clearInterval(refreshedInterval);
	window.setTimeout(addButton, 3000);
}

/**
 * adds fetch document button to the page and injects modal in the page
 */

function addButton() {
	let mainDiv = document.querySelector('.jz-candidate-application-bar');
	let applicationBarDiv = document.querySelector('.jz-candidate-application-bar-actions');
	let documentsDiv = document.createElement('div');
	documentsDiv.innerHTML = `<button class="btn btn-lg btn-default" style = "margin: 0px 10px" id="fetch-document">Fetch Document</button>`;
	mainDiv.insertBefore(documentsDiv, applicationBarDiv);
	let fetchBtn = document.getElementById('fetch-document');
	fetchBtn.addEventListener('click', handleClick);
	injectModal();
}

/**
 * inserts a new dom element before the existing dom element
 * @param {dom element} newNode | new created dom element 
 * @param {dom element} referenceNode | existing element in dom
 */

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * handle fetch document button click to hide the modal
 */

function handleClick() {
	modal = document.getElementById('modal-div');
	modal.style.display = 'block';
}

/**
 * adds modal to page and call a function to fetch templates from api
 */

function injectModal() {
	let modalDiv = document.createElement('div');
	modalDiv.classList.add('modal');
	modalDiv.id = 'modal-div';
	modalDiv.innerHTML = `
    <div class="modal-content">
        <button id='modal-close'>x</button>
        <select id="templateSelect" class="templates">
            <option selected disabled hidden value="0">Select Template</option>
         </select>
    </div>`;
	document.body.appendChild(modalDiv);

	//bind events to modal
	bindModalEvent();

	// fetch the templates from api
	fetchTemplates();
}

/**
 * Modal elements events
 */

function bindModalEvent() {
	let modalClose = document.getElementById('modal-close');
	modalClose.addEventListener('click', closeModal);
}

function closeModal() {
	modal.style.display = 'none';
	templateSelect.selectedIndex = 0;
}

/**
 * fetches templates from api and call a function to populate the received templates
 */

function fetchTemplates() {
	chrome.runtime.sendMessage({ baseUrl, type: 'fetchTemplates' }, function(response) {
		populateTemplates(response.templates);
	});
}

/**
 * populates the templates select element with template options fetched from api
 * @param {array} templates 
 */

function populateTemplates(templates) {
	templateSelect = document.getElementById('templateSelect');
	templateSelect.addEventListener('change', function() {
		handleChange(this);
	});

	let templatesArr = templates;

	//Populate all options in the category select
	templatesArr.forEach((template) => {
		let option = document.createElement('option');
		option.innerHTML = template.name;
		option.id = template.id;
		option.value = template.id;
		templateSelect.appendChild(option);
	});
}

/**
 * handle template select change
 * @param {dom element} selectBox | template select dom element 
 */

function handleChange(selectBox) {
	let selectedValue = selectBox.value;
	let candidateData = fetchCandidateDetails();
	candidateData.documentId = selectedValue;
	let requestObj = candidateData;
	console.log(candidateData);
}

/**
 * fetches the candidate details from the page
 */

function fetchCandidateDetails() {
	let emailDiv = document.querySelector('.meta-email');
	let email = emailDiv.getElementsByTagName('a')[0].innerHTML;
	let prospectEmail = document.getElementById('candidate-dropbox-email').value;
	return {
		email,
		prospectEmail
	};
}
