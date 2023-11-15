function sendReminder() {
  // Retrieve script properties for spreadsheet and calendar IDs
  const properties = PropertiesService.getScriptProperties();
  const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName('PhoneList');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  
  // Create a map of names to phone numbers
  const namesToNumbers = {};
  data.forEach(([name, number]) => {
    namesToNumbers[name.toLowerCase()] = number;
  });

  // Get events for the next day
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const events = CalendarApp.getCalendarById(properties.getProperty('CALENDAR_ID')).getEventsForDay(tomorrow);
  
  // Send reminders for relevant events
  events.forEach(event => {
    const title = event.getTitle().toLowerCase();
    Object.keys(namesToNumbers).forEach(name => {
      if (title.includes(name)) {
        const number = namesToNumbers[name];
        const time = Utilities.formatDate(event.getStartTime(), 'America/Denver', 'h:mm a');
        const message = `Reminder: Event scheduled tomorrow at ${time}. Contact for details.`;
        sendSMSToNumber(message, number);
        Utilities.sleep(1000); // Throttle the sending rate
      }
    });
  });
}

function sendSMSToNumber(message, number) {
  // Retrieve Twilio API credentials
  const properties = PropertiesService.getScriptProperties();
  const sid = properties.getProperty('TWILIO_SID');
  const authToken = properties.getProperty('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = properties.getProperty('TWILIO_PHONE_NUMBER');

  // Validate phone number
  const formattedNumber = "+1" + number.replace(/\D/g, '');
  if (formattedNumber.length !== 12) {
    console.log(`Invalid phone number: ${formattedNumber}`);
    return;
  }

  // Prepare the request for Twilio API
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const payload = {
    "To": formattedNumber,
    "From": twilioPhoneNumber,
    "Body": message
  };
  const headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(sid + ":" + authToken)
  };
  const options = {
    "method" : "post",
    "payload" : payload,
    "headers" : headers
  };

  // Send SMS and log response
  try {
    const response = UrlFetchApp.fetch(twilioUrl, options);
    console.log(`SMS sent: ${response.getContentText()}`);
  } catch (error) {
    console.log(`Error sending SMS: ${error.toString()}`);
  }
}

function sendPreemptiveReminder() {
  // Retrieve script properties for spreadsheet and calendar IDs
  const properties = PropertiesService.getScriptProperties();
  const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName('PhoneList');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  
  // Create a map of names to phone numbers
  const namesToNumbers = {};
  data.forEach(([name, number]) => {
    namesToNumbers[name.toLowerCase()] = number;
  });

  // Get events for the day after tomorrow
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const events = CalendarApp.getCalendarById(properties.getProperty('CALENDAR_ID')).getEventsForDay(dayAfterTomorrow);

  // Check for relevant events and prepare a message for reminders
  let messageToHannah = "Preemptive reminders for upcoming events:";
  const namesForReminders = [];
  
  events.forEach(event => {
    const title = event.getTitle().toLowerCase();
    Object.keys(namesToNumbers).forEach(name => {
      if (title.includes(name)) {
        namesForReminders.push(name);
      }
    });
  });

  // Send a collective reminder if there are names to remind
  if (namesForReminders.length > 0) {
    messageToHannah += `\n\n${namesForReminders.join(", ")}.`;
    const phoneNumberToNotify = properties.getProperty('NOTIFY_PHONE_NUMBER'); // Set this property in the script properties
    if (phoneNumberToNotify) {
      sendSMSToNumber(messageToHannah, phoneNumberToNotify);
    } else {
      console.log("Notification number is invalid or not set.");
    }
  } else {
    console.log("No preemptive reminders to send.");
  }
}
