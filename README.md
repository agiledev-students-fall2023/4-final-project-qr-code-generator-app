# QR Code Generator

In an increasingly digital world, our app aims to bridge the gap between virtual identities and real-life interactions. We envision a future where sharing your social presence can be as seamless as a single scan, and building new connections doesn't involve sifting through an endless number of apps or notes. With our platform, users will be able to effortlessly generate a unified QR code that contains their chosen social accounts, fostering faster and more authentic connections. By scanning and saving others' codes, they will be able to build a digital directory, and ensure meaningful digital relationships. Our primary goal is to simplify, streamline, and enrich the way we connect in the digital age. 

<b> Streamlining social connections with QR codes, making digital introductions as easy as a scan and save. </b>

## Team Members 
Lara Kim: https://github.com/larahynkim <br>
Sivan Cooperman: https://github.com/SivanC <br>
Angela Tao: https://github.com/XinranTaoAngela <br>
Byron Chan: https://github.com/byroncjy <br>
Pan Li: https://github.com/Pan-LLi<br>

Our team identified a challenge we wanted to tackle: managing and sharing multiple social profiles can be a hassle. This was an inconvenience that each one of us had experienced, and we were sure that most people, especially at our age, could resonate with us. To streamline this, we conceptualized an app that combines social links into a single QR code. We hope that this app will be of help to many and revolutionize the way in which we form new connections. 

With our team values and guidelines, our team will collaborate, communicate, and develop to successfully deliver our finalized app to our end-users. 

[Contribution guidelines for this project.](CONTRIBUTING.md)

## Deployment
This is our app deployed on a Digital Ocean Droplet:
- http://68.183.54.250:3000/ 

## Instructions for Building and Testing

For Sprint 2, our team is using .env files for both the front and back end to store the keys and urls to our mock api. They must be inputted manually for the code to work, as the FE/BE are both dependent on them. Please refer to our discord channel, team-qr-codes, where we have shared the .env files. 
Before running the code, please input the files into the front and back end directories respectively. 

### Build and launch the back end

1. Navigate into the `back-end` directory
1. Run `npm install` to install all dependencies listed in the `package.json` file.
1. Run `npm start` to launch the back-end server

### Build and launch the front end

1. Navigate into the `front-end` directory
1. Run `npm install` to install all dependencies listed in the `package.json` file.
1. Run `npm start` to launch the React.js server

### Run tests 
1. Navigate into the `back-end` directory
1. Run `npm test` to run unit tests 

See the contribution document above for more instructions including testing.

### Alternative: Running the full app with Docker
1. Navigate into root directory
2. Ensure docker and docker-compose are installed
3. Ensure directory contains `front-end.env` and `back-end.env` files
4. Run `docker-compose up`

### How to Run the Scan Code and Connection Details Page (Sprint 3) 
After building and launching the front and back end, in order to try out the scan code and connection details page, please follow the instructions below. 
1. Download the QR code png file in this repository: [QR code](https://github.com/agiledev-students-fall2023/4-final-project-qr-code-generator-app/blob/master/qrcode.png?raw=true)
2. Navigate to the 'Scan Code' page by clicking the 'Scan Code' button located on the home page. 
3. Click on the 'Scan' button. A popup will appear prompting you to select a file for upload. 
4. Upload the QR code png file. This will lead you to the corresponding Connection Details page. 

### Visit the web app in your web browser

- install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- navigate your web browser to http://localhost:3000

## Relevant Reading 
[How Do QR Codes Work](https://www.sproutqr.com/blog/how-do-qr-codes-work)
