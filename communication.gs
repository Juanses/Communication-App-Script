function SendEmail(list,template,keywords){
  list.forEach(function(row){
    //I prepare the data to populate the email
    var htmlBody = HtmlService.createHtmlOutputFromFile(template).getContent();
    //I replace the values on the template with the values in the object
    keywords["prefixe"] = row[0];
    keywords["nom"] = row[1];
    for (var key in keywords) {
      if(key == "nom"){
        htmlBody = htmlBody.replace("%"+key+"%", keywords[key].toProperCase());
      }
      else{
        htmlBody = htmlBody.replace("%"+key+"%", keywords[key]);
      }
      //Logger.log("key " + key + " has value " + myArray[key]);
    }
    //Logger.log(htmlBody);
    
    logevent({"requestid":keywords["requestid"],"type":"email","id":row[2],"category":keywords["type"]})
    MailApp.sendEmail(row[2],keywords["subject"],"This message requires HTML support to view.",{name: 'Juan mHealthQuality',htmlBody: htmlBody});
    
  },template,keywords);
}

function sendtowebhook (url,payload){
  var options =
      {
        "method"  : "POST",
        "payload" : payload,   
        "followRedirects" : true,
        "muteHttpExceptions": true
      };
  
  var result = UrlFetchApp.fetch(url, options);
}


function sendtoslack (message){
  // Make a POST request with a JSON payload.
  //https://zapier.com/help/slack/#tips-formatting-your-slack-messages
  var data = {
    'message': message
  };
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  //UrlFetchApp.fetch('https://hooks.zapier.com/hooks/catch/2479763/r4up7r/', options);
  UrlFetchApp.fetch('https://hook.integromat.com/rpj3sa5o8hejm5qqk5vivl58css9467v', options);
}
