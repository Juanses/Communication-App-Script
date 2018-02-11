var CommunicationClass = function(){
  
  this.sendtoPushBullet = function(token,data){   
    switch(data["type"]){
      case "note":
        var options = {
          'method' : 'post',
          'headers' : {"Access-Token":token},
          'contentType': 'application/json',
          'payload' : JSON.stringify(data)
        };
        UrlFetchApp.fetch('https://api.pushbullet.com/v2/pushes', options);
        break;
    }
  }
  
  this.sendPDFAttachment = function (to,subject,text,fileid){
    // Send an email with two attachments: a file from Google Drive (as a PDF) and an HTML file.
    var file = DriveApp.getFileById(fileid);
    MailApp.sendEmail(to, subject, text, {
      name: 'Juan Sebastián SUAREZ VALENCIA',
      attachments: [file.getAs(MimeType.PDF)]
    });
  }
  
  this.SendEmail =function(list,template,keywords){
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
  
  this.sendtowebhook = function(url,payload){
    var options =
        {
          "method"  : "POST",
          "payload" : payload,   
          "followRedirects" : true,
          "muteHttpExceptions": true
        };
    
    var result = UrlFetchApp.fetch(url, options);
  }
  
  this.sendtoslack = function(message){
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
  
  this.checkemail = function(emailadress){
    var response = UrlFetchApp.fetch('http://apilayer.net/api/check?access_key=2c633dc5186a0b58982efcbfe1c4c5c2&email='+emailadress+'&smtp=1&format=1');
    var dataAll = JSON.parse(response.getContentText());
    if (dataAll["smtp_check"] && dataAll["mx_found"]){
      return true;
    }
    else{
      return false;
    }
  }
}

