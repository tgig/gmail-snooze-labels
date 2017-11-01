var MARK_UNREAD = false;
var ADD_UNSNOOZED_LABEL = false;

function getLabelName(i) {
  snoozeLabel = "Snooze/";
  if (i <=6) {
    var _days = i + 1;
    return snoozeLabel + _days.toString() + " days";
  }
  else
    switch(i) {
      case 7:
        return snoozeLabel + "Day 7: Sunday";
      case 8:
        return snoozeLabel + "Day 1: Monday";
      case 9:
        return snoozeLabel + "Day 2: Tuesday";
      case 10:
        return snoozeLabel + "Day 3: Wednesday";
      case 11:
        return snoozeLabel + "Day 4: Thursday";
      case 12:
        return snoozeLabel + "Day 5: Friday";
      case 13:
        return snoozeLabel + "Day 6: Saturday";
      case 14:
        return snoozeLabel + "Long term: 2 weeks";
      case 15:
        return snoozeLabel + "Long term: 1 month";
      case 16:
        return snoozeLabel + "Long term: 6 months";
    }
}

function setup() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  for (var i = 0; i <= 16; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if (ADD_UNSNOOZED_LABEL) {
    GmailApp.createLabel("Unsnoozed");
  }
}



function moveSnoozes() {
  var oldLabel, newLabel, page;
  var d = new Date();
  
  for (var i = 0; i <= 6; ++i) {
    
    newLabel = oldLabel;
    oldLabel = GmailApp.getUserLabelByName(getLabelName(i));
    page = null;
    
    // Get threads in "pages" of 100 at a time
    while(!page || page.length == 100) {
    
      page = oldLabel.getThreads(0, 100);
      
      if (page.length > 0) {
      
        if (newLabel) {
          // Move the threads into "today’s" label
          newLabel.addToThreads(page);

        } else {
        
          // Unless it’s time to unsnooze it
          GmailApp.moveThreadsToInbox(page);

          if (MARK_UNREAD) {
            GmailApp.markThreadsUnread(page);
          }

          if (ADD_UNSNOOZED_LABEL) {
            GmailApp.getUserLabelByName("Unsnoozed")
              .addToThreads(page);
          }          
        }     

        // Move the threads out of "yesterday’s" label
        oldLabel.removeFromThreads(page);
      }  
    }
  }
  
  //handle day specific labels
  oldLabel = GmailApp.getUserLabelByName(getLabelName(7 + d.getDay()));
  page = null;
  
  while (!page || page.length == 100) {
  
    page = oldLabel.getThreads(0, 100);
    
    if (page.length > 0) {
    
      GmailApp.moveThreadsToInbox(page);
      oldLabel.removeFromThreads(page);
    
    }
  }
  
  //handle long term labels
  for (var i = 14; i <= 16; i++) {
    var labelName = getLabelName(i);
    var label = GmailApp.getUserLabelByName(labelName);
    var threads = label.getThreads();
    var dayCount;
    
    for (var j = 0; j < threads.length; j++) {
      //grab latest message date
      //if date >= X days old put back in inbox and remove label
      //drawback to this method is it requires a new message to be appended in order to re-snooze

      //alert(daydiff(parseDate($('#first').val()), parseDate($('#second').val())));
      
      lastMessageDate = new Date(threads[j].getLastMessageDate());
      
      if (labelName == getLabelName(14)) {
        dayCount = 14;
      } else if (labelName == getLabelName(15)) {
        dayCount = 30;
      } else if (labelName == getLabelName(16)) {
        dayCount = 180;
      }
      
      //if more days have passed since the last message than the label, move to inbox, remove label
      if (Math.floor((d - lastMessageDate) / (1000*60*60*24) >= dayCount)) {
        threads[j].removeLabel(label);
        threads[j].moveToInbox();
      }
    }
  }
  
}

//reply to an email
function replyBumper() {
  var firstThread = GmailApp.getInboxThreads(0,1)[0];
  var me = Session.getActiveUser().getEmail();
  
  firstThread.reply("Bumping the message along (again)...", { replyTo: me });
  
}
