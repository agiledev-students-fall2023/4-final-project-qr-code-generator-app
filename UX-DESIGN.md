# QR Code Generator User Experience Design Document

## Prototype
Access the Figma prototype [here](https://www.figma.com/proto/h3MlEfPk2gwJBsLaQIrhcZ/Wireframes?node-id=42-51&starting-point-node-id=42%3A51&mode=design&t=4162Olo80Kj8PCA3-1)

## App Map

![app map](<ux-design/App Map.png>)

## Wireframe Diagrams

### Authentication

#### Login

The user can either enter their credentials and navigate to Home with the "Log
In" button, or click the "Sign Up" button and be redirected to the Signup.

![login](<ux-design/Login.png>)

#### Signup

The user can create an account by entering login credentials. Pressing the
"Create Account" button will create an account for them and redirect them to
Home. The back arrow will return the user to Login.

![signup](<ux-design/Signup.png>)

### Home

A navigation screen, from which each other screen is easily accessible. Pressing
the "Log Out" button will redirect the user to Login, and sign them out of their
account. Pressing "Scan Code" will redirect the user to Scan Code. Pressing
"Saved Connections" will redirect the user to Saved Connections.  Pressing "Edit
Information" will redirect the user to Edit Information. Pressing "Generate
Code" will redirect the user to Select Information.

![home](<ux-design/Home.png>)

### Scan Code

Allows the user to scan the QR code of another user, saving the information in
the code within the app. After the scan is complete, or upon pressing the back
button, the user is returned to Home.

![scancode](<ux-design/Scan Code.png>)

### Viewing Saved Information

#### Saved Connections

A list of account whom the user has previously scanned codes from. Interacting
with an entry will redirect the user to Connection Details. The back arrow button
will return the user to Home.

![savedconnections](<ux-design/Saved Connections.png>)

#### Connection Details

Displays information associated with an account with which the user has
performed a scan. Information displayed to the user will only be updated if
another scan is performed. The back arrow returns the user to Saved Connections.

![connectiondetails](<ux-design/Connection Details.png>)

### Edit Personal Information

Allows the user to customize their account by adding information to be shared
via QR code. In addition to a profile picture, the user can edit a list of
key-value pairs containing the type of information being added (phone number,
Instagram, etc.) and the information itself. The back arrow returns the user to
Home.

![editinfo](<ux-design/Edit Information.png>)

### Sharing Personal Information

#### Select Information

Allows the user to select the information that they wish to generate a QR code
for. Pressing "Generate Code" redirects the user to My QR Code. The back arrow
returns the user to Home.

![selectinfo](<ux-design/Select Information.png>)

#### My QR Code

Displays a personalized QR code which can be scanned by other users. The back
arrow returns the user to Select Information. Pressing "Done" returns the user
to Home.

![myqrcode](<ux-design/QR Code.png>)
