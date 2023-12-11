# Contributing
This document details norms and procedures for contributing to the project.
Before contributing, please read through this document. By contributing, you
agree to the rules and standards written below.

## Team Standards
### Team Values
- As a team we are friendly, helpful, and considerate towards one another, and
    do not assume ill intent on the part of our team members.
- As a team we strive to work together to solve the problems set out before us.
- Any questions and concerns should be voiced either during team meetings or in
    the team Discord channel, so that they can be addressed quickly and
    properly. Team members should strive to respond to messages directed at them
    within 24-48 hours.
- When there is a disagreement, the team will discuss (not necessarily all at
    once) until a unanimous consensus has been reached.
- If a member of the team fails to perform their responsibilities to the needs
    of the team, the other team members can discuss and bring it to the
    attention of the professor and grader through the team Discord channel.

### Sprint Guidelines
- Sprints should last approximately two weeks, beginning and ending on a class
    day. Each sprint will have 2-3 standups. Standup due dates are listed on the
    course syllabus, and will be coordinated by the team prior. Members are
    expected to be present for any and all meetings and standups unless
    necessary. Team members who have not made progress on their assigned tasks
    for multiple standups will be considered neglectful of their
    responsibilities and subject to relevant team rules.

### Development Guidelines
- Team members are expected to use [ESLint](https://eslint.org/) to standardize 
    formatting of code.
- All code must be peer-reviewed and tested before being merged into the `main`
    branch.
- Team members should adhere to the following guidelines when writing code:
    - Write just enough code to get things working, and then refine afterwards.
    - Always push working code.
    - Make small commits, limited to a single feature or fix.
    - Provide a descriptive commit message with present-tense ("Fixes ..."
        instead of "Fixed ..." etc.).
    - Use descriptive variable and function names that make it easy to
        understand what the code is doing.
    - Do not retain code that is not being used.
    - Write automated tests for critical integration points and functionality.

## Contribution Guidelines
### Contribution Workflow
Team members are expected to use a non-forking feature branch workflow, and pull
requests should be reviewed and approved by at least one other team member
before being merged into the master branch. Non-team contributors are encouraged
to contribute from a fork.

All contributions should be formatted by using the command `eslint --fix <your
files>` before being submitted for review, using the `.eslintrc.js` file present
in the repository.

### Contribution Rules
Before contributing, if there is not already an issue describing the
task/problem addressed by your contribution, please create one. Refer to the
workflow rules above for how to create a pull request.

## Developer Environment
### Local Environment Setup
#### Building and Running
In order to run this project, contributors will need Node.js and npm. For the
front-end, navigate to the `front-end` folder and install dependencies through
`npm install` before running `npm start` to launch the React server, which is
hosted on port 3000. If a browser tab is not automatically opened, the content
can be viewed at `http://localhost:3000` with the appropriate route.

A similar process is used for the backend, except that you should run the above
commands in the `back-end` folder. From there, the server can be accessed at
`http://localhost:<port>`, where `port` is located in the `server.js` file.

If you wish to have the express server automatically restart when files are
changed, you can use the nodemon package and the command `nodemon server`
instead of `npm start`.

#### Testing
In the `back-end` directory, the `test` directory contains all the tests for the
back-end. Running `npm test` in the `back-end` directory will run them. Tests
are written using the chai and mocha packages.
