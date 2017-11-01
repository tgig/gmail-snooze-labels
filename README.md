## Gmail Snooze Labels

This is a very simple Google Apps Script for Gmail that will allow you to apply labels to emails, archive them, then have them pop back into your inbox in a set number of days or a specific day of the week.

Thanks to <a href="https://gmail.googleblog.com/2011/07/gmail-snooze-with-apps-script.html">Offical Gmail Blog</a> for the bulk of the code. I only modified it slightly to add Days of the Week in addition to the Number of Days.

### How to set it up

1. Sign in to your Google account
2. Create a new Google Spreadsheet
3. Click "Tools > Script Editor"
4. Paste the script in Snooze.js
5. Run the function "setup", which will create the labels in your gmail account
6. Create a timer to execute the logic every morning. "Edit > Current projects triggers". Run "moveSnoozes", events "Time-driven", "Day-timer", "1am to 2am"

That's it. If you refresh your gmail account you will see the new labels.

### How to test that it is working

1. Select a message in Gmail, move it to the "Snooze/Snooze 1 Days" label (or label and archive).
2. From the Google Apps Script, manually execute the "moveSnoozes" function.
3. Check in Gmail that the message was returned to the inbox.

### How to use it in practice

Select a message(s) and either "move" the emails to the appropriate label, or apply a label and archive the message(s). These two actions are identical.

