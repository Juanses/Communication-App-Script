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
  
  this.SendMultipleEmailfromTemplate = function(emaildata,templatename,keywords){
    //var templatename = "template.html"
    //var emaildata = {"to":"juan@carians.fr,juan@carians.fr","subject":"subject","name":"Nombre"};
    //var keywords = {"juan@carians.fr":{"nom":"SUAREZ","prenom":"Juan"},"juan@bress.fr":{"nom":"VALENCIA","prenom":"Sebastian"}};
    
    //I prepare the data to populate the email
    var template = HtmlService.createHtmlOutputFromFile(templatename).getContent();
    
    for (var key in keywords) {
      //Chaque email
      var htmlBody = template;      
      for (var cle in keywords[key]) {
        if(cle == "nom"){
          htmlBody = htmlBody.replace("%"+cle+"%", keywords[key][cle].toProperCase());
        }
        else{
          htmlBody = htmlBody.replace("%"+cle+"%", keywords[key][cle]);
        }
      }
      MailApp.sendEmail(key,emaildata["subject"],"This message requires HTML support to view.",{name: keywords["name"],htmlBody: htmlBody});
    }
  }
  
  this.SendEmailfromTemplate = function(emaildata,templatename,keywords){
    /*
    var templatename = "template.html"
    var emaildata = {"to":"juan@carians.fr","subject":"subject","name":"Nombre"};
    var keywords = {"nom":"SUAREZ","prenom":"Juan"};
    com.SendSingleEmail(emaildata,templatename,keywords) 
    */
    
    //I prepare the data to populate the email
    var htmlBody = HtmlService.createHtmlOutputFromFile(templatename).getContent();
    
    //I replace the values on the template with the values in the object
    for (var key in keywords) {
      if(key == "nom"){
        htmlBody = htmlBody.replace("%"+key+"%", keywords[key].toProperCase());
      }
      else{
        htmlBody = htmlBody.replace("%"+key+"%", keywords[key]);
      }
    }
    
    MailApp.sendEmail(emaildata["to"],emaildata["subject"],"This message requires HTML support to view.",{name: emaildata["name"],htmlBody: htmlBody});
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
  
  this.sendtoslack = function(webhook,message){
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
    UrlFetchApp.fetch(webhook, options);
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

//We need this for SendEmail so let's keep it here
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};