// assertions
const path = require('path')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
chai.use(chaiHttp)
// routes
const router = require('../app')
const jwt = require('jsonwebtoken')

// tests related to sending requests about a user's information
describe('User Routes', function () {
  // userIds
  // validUserId is an actual valid objectId in the test database
  const validUserId = '6562c186a4a586c6e19a4eef'
  // invalidUserId is an obviously invalid objectId that wouldn't exist in database
  const invalidUserId = '6562c186a4a586c6e19a4eea'
  const jwtSecret = process.env.JWT_SECRET
  const token = jwt.sign({ userId: validUserId }, jwtSecret, { expiresIn: '10m' })

  // email, first/last name, pfp
  describe('Account Information', function () {
    describe('Successful GET', function () {
      it('should respond with an HTTP 200 status code and an object in the body', function (done) {
        chai
          .request(router)
          .get(`/users/${validUserId}`)
          .set('Authorization', `JWT ${token}`)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object').that.has.all.keys('email',
              'first_name', 'last_name', 'profile_picture')
            done()
          })
      })
    }),
    describe('Unsuccessful GET', function () {
      it('should respond with an HTTP 500 status code and an error', function (done) {
        chai
          .request(router)
          .get(`/users/${invalidUserId}`)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.be.a('object').that.has.keys('error')
            done(err)
          })
      })
    }),
    describe('Successful PUT', function () {
      it('should respond with an HTTP 200 status and confirmation message', function (done) {
        chai
          .request(router)
          .put(`/users/${validUserId}`)
          .set('Authorization', `JWT ${token}`)
          .send({
            email: 'email@example.com',
            first_name: 'first_name',
            last_name: 'last_name',
          })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object').that.has.keys('message')
            done()
          })
      })
    }),
    // Invalid input: Sending an array under profile_picture field
    describe('Unsuccessful PUT', function () {
      it('should respond with an HTTP 400 status and error message', function (done) {
        chai
          .request(router)
          .put(`/users/${validUserId}`)
          .set('Authorization', `JWT ${token}`)
          .send({
            email: 'not_an_email',
            first_name: '',
            last_name: 'okay_last_name'
          })
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.a('object').that.has.keys('error')
            done(err)
          })
      })
    })
  }),
  // personal information added by the users
  describe('User information', function () {
    describe('Successful GET', function () {
      it('should respond with an HTTP 200 status and platforms list body', function (done) {
        chai
          .request(router)
          .get(`/users/${validUserId}/platforms`)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('array')
            expect(res.body).to.deep.nested.have.property('0.name')
            expect(res.body).to.deep.nested.have.property('0.value')
            done()
          })
      })
    }),
    describe('Unsuccessful GET', function () {
      it('should respond with an HTTP 500 status and an error body', function (done) {
        chai
          .request(router)
          .get(`/users/${invalidUserId}/platforms`)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.be.a('object').that.has.keys('error')
            done(err)
          })
      })
    }),
    describe('Successful PUT', function () {
      it('should respond with an HTTP 200 status and a confirmation message', function (done) {
        chai
          .request(router)
          .put(`/users/${validUserId}/platforms`)
          .set('Authorization', `JWT ${token}`)
          .send({
            platforms: [
              { name: 'Linkedin', value: 'johndoe254' },
              { name: 'Instagram', value: '@johndoe' }
            ]
          })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object').that.has.keys('message')
            done()
          })
      })
    }),
    describe('Unsuccessful PUT', function () {
      it('should respond with an HTTP 400 status and an error body', function (done) {
        chai
          .request(router)
          .put(`/users/${validUserId}/platforms`)
          .set('Authorization', `JWT ${token}`)
          .send({
            platforms: [
              { wrong_name: 'bad_platform', wrong_value: 'johndoe254' }
            ]
          })
          .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.a('object').that.has.keys('error')
            done(err)
          })
      })
    })
  })

  // Profile picture routes: /profilePicture, /uploadPicture
  describe('Profile Picture', function () {
    describe('GET profilePicture', function () {
      describe('Successful GET', function () {
        it('should respond with an HTTP 200 status and profile picture data', function (done) {
          chai
            .request(router)
            .get(`/users/${validUserId}/profilePicture`)
            .set('Authorization', `JWT ${token}`)
            .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body).to.be.a('object').that.has.keys('profile_picture')
              done()
            })
        })
      })

      describe('Unsuccessful GET', function () {
        it('should respond with an HTTP 500 status and an error body', function (done) {
          chai
            .request(router)
            .get(`/users/${invalidUserId}/profilePicture`)
            .set('Authorization', `JWT ${token}`)
            .end((err, res) => {
              expect(res).to.have.status(500)
              expect(res.body).to.be.a('object').that.has.keys('error')
              done(err)
            })
        })
      })
    })

    describe('PUT uploadPicture', function () {
      describe('Successful PUT', function () {
        it('should respond with an HTTP 200 status and a confirmation message', function (done) {
          chai
            .request(router)
            .put(`/users/${validUserId}/uploadPicture`)
            .set('Content-Type', 'multipart/form-data') // Set the content type
            .set('Authorization', `JWT ${token}`)
            // This is the path of our test image, ensure this exists!
            .attach('file', path.join(__dirname, '../test/public/profile-picture-test.png'))
            .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body).to.be.a('object').that.has.keys('message')
              done()
            })
        })
      })

      // Valid id, but no actual file attached under file field
      describe('Unsuccessful PUT (no file attached)', function () {
        it('should respond with an HTTP 400 status and an error body', function (done) {
          chai
            .request(router)
            .put(`/users/${validUserId}/uploadPicture`)
            .set('Content-Type', 'multipart/form-data') // Set the content type
            .set('Authorization', `JWT ${token}`)
            .field('file', '')
            .end((err, res) => {
              expect(res).to.have.status(400)
              expect(res.body).to.be.a('object').that.has.keys('error')
              done(err)
            })
        })
      })

      describe('Unsuccessful PUT (invalid ID)', function () {
        it('should respond with an HTTP 500 status and an error body', function (done) {
          chai
            .request(router)
            // This uses an invalid id
            .put(`/users/${invalidUserId}/uploadPicture`)
            .set('Content-Type', 'multipart/form-data') // Set the content type
            .set('Authorization', `JWT ${token}`)
            .attach('file', path.join(__dirname, '../test/public/profile-picture-test.png'))
            .end((err, res) => {
              expect(res).to.have.status(500)
              expect(res.body).to.be.a('object').that.has.keys('error')
              done(err)
            })
        })
      })
    })
  })
})
