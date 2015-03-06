# railschat
Live chat integration

Configuring base rails app and installing faye and thin gem  will get you the first level reach to your chat app. Faye js file should be in the project root. Faye.ru file will have all your paths configured related to faye. Token that is required for faye in the config folder. 

Set your rails app to perform CRUD for messages. Messages that should perform in ajax and thus broadcast will take over in pushing the data in different browsers.

Run the app in phusion apache and you will see the chat working!
