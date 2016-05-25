/*
This is a script which will snooze emails either for a specific number of days, or until a day of the week.
Step 1 = run setup() function to create labels in gmail (will need to authorize the app)
Step 2 = create a trigger to execute moveSnoozes() every day at 1am
*/

var MARK_UNREAD = false;
var ADD_UNSNOOZED_LABEL = false;

function getLabelName(i) {
  snoozeLabel = "Snooze/Snooze ";
  if (i <=7)
    //return "Snooze/Snooze " + i + " days";
    return snoozeLabel + i + " days";
  else
    switch(i) {
      case 8:
        return snoozeLabel + "Monday";
      case 9:
        return snoozeLabel + "Tuesday";
      case 10:
        return snoozeLabel + "Wednesday";
      case 11:
        return snoozeLabel + "Thursday";
      case 12:
        return snoozeLabel + "Friday";
      case 13:
        return snoozeLabel + "Saturday";
      case 14:
        return snoozeLabel + "Sunday";
    }
}

function setup() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  for (var i = 1; i <= 14; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if (ADD_UNSNOOZED_LABEL) {
    GmailApp.createLabel("Unsnoozed");
  }
}

function moveSnoozes() {
  var oldLabel, newLabel, page;
  for (var i = 1; i <= 7; ++i) {
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
  var d = new Date();
  oldLabel = GmailApp.getUserLabelByName(getLabelName(7 + d.getDay()));
  page = null;
  while (!page || page.length == 100) {
    page = oldLabel.getThreads(0, 100);
    if (page.length > 0) {
      GmailApp.moveThreadsToInbox(page);
      oldLabel.removeFromThreads(page);
    }
  }
}
