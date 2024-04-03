Event Reminder Service

This Event Reminder Service is designed to automatically send SMS reminders for upcoming events. 
Using Google Apps Script, it integrates Google Sheets for contact management, Google Calendar for event tracking, and Twilio for SMS notification. 
The service includes features for sending reminders a day before the event, preemptive reminders for events the day after tomorrow, and direct SMS sending capability.

Features
-  Automatic Event Reminders: Sends SMS reminders for events scheduled for the next day.
-  Preemptive Reminders: Optionally, sends a collective preemptive reminder for events scheduled for the day after tomorrow.
-  Integration with Twilio for SMS: Leverages Twilio API to send SMS messages.
-  Google Sheets as Contact Management: Utilizes a Google Sheet for storing and managing contacts.
-  Google Calendar Event Tracking: Fetches upcoming events from a specified Google Calendar.

Prerequisites
-  A Google Cloud Platform account with Apps Script enabled.
-  A Twilio account for sending SMS messages.
-  A Google Sheet with contact names and phone numbers.
-  A Google Calendar with scheduled events.
  
Configuration
Google Sheets Setup:
-  Create a Google Sheet named PhoneList with two columns: Name and Phone Number.
-  Populate the sheet with contact names and their corresponding phone numbers.

Google Calendar Setup:
-  Ensure your Google Calendar has the events you want to send reminders for, with event titles including the names as listed in your Google Sheet.

Twilio Setup:
-  Obtain your Twilio Account SID, Auth Token, and Twilio Phone Number from your Twilio Console.
  
Script Properties:
-  Open Google Apps Script and create a new script for your project.
-  Store your Twilio credentials and IDs for your Google Sheet and Calendar in the script's properties:
    -  Go to File > Project properties > Script properties.
        -  Add the following properties:
            -  TWILIO_SID
            -  TWILIO_AUTH_TOKEN
            -  TWILIO_PHONE_NUMBER
            -  SPREADSHEET_ID
            -  CALENDAR_ID
            -  NOTIFY_PHONE_NUMBER (for preemptive reminders)
         
Deploy
-  In the Apps Script, paste the provided functions.
-  Set up time-driven triggers for sendReminder and sendPreemptiveReminder functions to run them automatically.

Usage
-  Sending Daily Reminders: Automatically triggered to send SMS reminders for the next day's events.
-  Sending Preemptive Reminders: Optionally triggered to send a collective SMS reminder for the day after tomorrow's events.
-  Manual SMS Sending: Use the sendSMSToNumber function to manually send SMS messages as needed.

Troubleshooting
-  Invalid Phone Numbers: Ensure phone numbers in your Google Sheet are correctly formatted. The script validates and formats phone numbers for the US.
-  Twilio Errors: Check your Twilio Console for logs and errors if SMS messages fail to send.
-  Permissions: Make sure your Google Apps Script has permissions to access your Google Sheets and Calendar.
