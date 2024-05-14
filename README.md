
# Development-tracker
Development-tracker is an API that allows Users the ability to actively track and improve their child's developmental journey. 

The project is written with Javascript using express Node.js application framework and MySQL as the database.
## Features

1. User can signup and login to their account. 

2.	User can reset their password. 

3. User account activated using JSON web token authenitcation. 

4. User password is encrypted for security.
  
5. Authorized User can create an account for multiple children to enable them to be able to use the tenderCare development tracker. 

## Getting started

1.	Install node from the website and download node for your device type:

```bash
$  https://nodejs.org/en
```
2. Install MySQL locally 
```bash
$ https://dev.mysql.com/downloads/mysql/
```
3. Clone this repository and run locally
```bash
https://github.com/Moliki-Salman/development-tracker.git
```
4. Run this code to download the projects' dependencies 
```bash
 npm install
```
5. Set your desired Port number in your .env file
  
6. Get your personal openai API key and set it in the project .env file.
```bash
$ https://platform.openai.com/api-keys 
```
7.   Start the application by running:
```bash
$ nodemon app.js 
```
8. Connect the API using postman on the desired port set in the project .env file.

## Hosting
The app is availabe on render hosting service
```bash
$ https://development-tracker.onrender.com
```
## API  Endpoints
```bash
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
1. | POST | /signup | To sign up a new user account |
2. | POST | /login | To login an existing user account |
3. | POST | /resetPassword | To allow user to reset password |
4. | POST | /child | To create a child profile under a user account | 
5. | POST | /tracker | To allow user to interact with the development tracker | 
```
### License
This project is available for use under the MIT License.
