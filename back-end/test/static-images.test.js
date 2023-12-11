const express = require('express')
const chai = require('chai')
const chaiHttp = require('chai-http')
const nock = require('nock')
const router = require('../unchanged-images') // Make sure this is the correct path
const jwt = require('jsonwebtoken')

const expect = chai.expect
chai.use(chaiHttp)

describe('Router Tests', function() {
  let app
  // validUserId is an actual valid objectId in the test database
  const validUserId = '6562c186a4a586c6e19a4eef'
  const jwtSecret = process.env.JWT_SECRET
  const token = jwt.sign({ userId: validUserId }, jwtSecret, { expiresIn: '10m' })

  before(function() {
    app = express()
    app.use('/', router)
  })

  it('should fetch and return an image successfully', async function() {
    nock('https://picsum.photos')
      .get('/400')
      .reply(200, Buffer.from('mock-image-data'), { 'Content-Type': 'image/jpeg' })

    const res = await chai.request(app).get('/home-logo-image')
    expect(res).to.have.status(200)
    expect(res.headers).to.include({ 'content-type': 'image/png' })
    expect(res.body).to.be.an.instanceof(Buffer) // Additional check for response body
  })

  // Ensure nock interceptors are removed after tests
  after(function() {
    nock.cleanAll()
  })
})