//Add event listener to the submit option values button
let submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener('click', getOptionValues);

/**
 * gets options values set by the user
 */

function getOptionValues () {

    //get values from user options
    let baseUrl = document.getElementById('baseUrl').value;
    console.log(baseUrl);
    if(baseUrl !== ''){

        //Set the pandadocapi to chrome storage
        chrome.storage.sync.set({
            "baseUrl": baseUrl,
        });
        window.close();
    }
    else 
    if(baseUrl == ''){
        alert("Enter Base Url");
    }
}