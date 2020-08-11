let host = document.location.host;
let modal;
let refreshedInterval;
if (host === 'app.jazz.co') {
	refreshedInterval = window.setInterval(checkUrl, 1000);
}
function checkUrl() {
	if (window.location.pathname.includes('message')) {
		loadDocuments();
		return;
	} else {
		console.log('not matched');
	}
}
function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function loadDocuments() {
	clearInterval(refreshedInterval);
	window.setTimeout(addButton, 3000);
}

function handleClick() {
    modal = document.getElementById('modal-div');
    modal.style.display = 'block';
}

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

function injectModal() {
	let modalDiv = document.createElement('div');
	modalDiv.classList.add('modal');
	modalDiv.id = 'modal-div';
    modalDiv.innerHTML = `
    <div class="modal-content">
        <button id='modal-close'>x</button>
        <p>Some text in the Modal..</p>
    </div>`;
    document.body.appendChild(modalDiv);
    bindModalEvent();
}

function bindModalEvent(){
    let modalClose = document.getElementById('modal-close');
    modalClose.addEventListener('click', closeModal)
}

function closeModal(){
    modal.style.display= 'none'
}
