const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app') 
const { User } = require('../models/User')

chai.use(chaiHttp)
const expect = chai.expect

describe('User Routes', () => {
  beforeEach(() => {
    sinon.restore() // Restore the default sandbox here
  })

  describe('POST /signup', () => {
    it('should create a new user and return a token', async() => {
      // Stub the findOne and save methods on the User model
      sinon.stub(User, 'findOne').resolves(null)
      sinon.stub(User.prototype, 'save').resolves({
        _id: '123456789',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe'
      })

      const res = await chai.request(app)
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe'
      })

    expect(res).to.have.status(201)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('token')
        })
    })


  describe('POST /login', () => {
    it('should login a user and return a token and userId', async() => {
      // Stub the findOne method on the User model
      sinon.stub(User, 'findOne').resolves({
        _id: '123456789',
        email: 'test@example.com',
        password: bcrypt.hashSync('password123', 10)
      })
  
      const res = await chai.request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('token')
      expect(res.body).to.have.property('userId')
        })
    })
  

  describe('POST /logout', () => {
    it('should log out a user', async() => {
      const res = await chai.request(app)
        .post('/logout')

      expect(res).to.have.status(200)
      expect(res.body).to.have.property('message', 'Logout successful')
    })
  })

  describe('GET /protected', () => {
    it('should access the protected route with a valid token', async () => {
      const secretKey = process.env.JWT_SECRET || 'yourDefaultJwtSecret'
      const fakeUserId = '6562c186a4a586c6e19a4eef'
      console.log('Using JWT Secret', secretKey)
      const fakeToken = jwt.sign({ userId: fakeUserId.toString() }, secretKey, { expiresIn: '1h' })
  
      try {
        const res = await chai.request(app)
          .get('/protected')
          .set('Authorization', `JWT ${fakeToken}`)
         
        console.log('Response Status:', res.status)
        console.log('Response Body:', res.body)
        
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('userId', '6562c186a4a586c6e19a4eef')
      } catch (error) {
        console.error('Error during the test:', error)
        throw error
      }
    })
  })
})  
