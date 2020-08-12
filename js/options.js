//Add event listener to the submit option values button
let submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener('click', getOptionValues);

/**
 * gets options values set by the user
 */

function getOptionValues () {

    //get values from user options
    let pandadocApiKey = document.getElementById('pandadocApi').value;
    console.log(pandadocApiKey);
    if(pandadocApiKey !== ''){

        //Set the pandadocapi to chrome storage
        chrome.storage.sync.set({
            "pandadocApiKey": pandadocApiKey,
        });
        window.close();
    }
    else 
    if(pandadocApiKey == ''){
        alert("Enter API KEY");
    }
}