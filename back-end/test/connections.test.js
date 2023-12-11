const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')
const server = require('../app') 

chai.use(chaiHttp)
chai.should()

describe('Connections', function() {
  this.timeout(5000) 

  const validUserId = '6562c186a4a586c6e19a4eef'
  const jwtSecret = process.env.JWT_SECRET
  const token = jwt.sign({ userId: validUserId }, jwtSecret, { expiresIn: '10m' })

  describe('/GET /connections/:userId', () => {
    it('should GET all the connections for a user', (done) => {
      const testUserId = '656a2e020f1c8e7b1de06e40'
      chai.request(server)
        .get(`/connections/${testUserId}`)
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.forEach(connection => {
            connection.should.have.property('friend_id')
            connection.should.have.property('first_name')
            connection.should.have.property('last_name')
            connection.should.have.property('profile_picture')
            connection.platforms.forEach(platform => {
              platform.should.have.property('name')
              platform.should.have.property('value')
            })
          })
          done()
        })
    })

    it('should return 400 for an invalid user ID format', (done) => {
      const invalidUserId = '! !'
      chai.request(server)
        .get(`/connections/${invalidUserId}`)
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('should return 404 for a non-existent user or no connections', (done) => {
      const nonExistentUserId = '656a21d3110e39dcc9abb422' 
      chai.request(server)
        .get(`/connections/${nonExistentUserId}`)
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})

describe('/DELETE /connections/:userId/:friendId', () => {
  const validUserId = '6562c186a4a586c6e19a4eef'
  const jwtSecret = process.env.JWT_SECRET
  const token = jwt.sign({ userId: validUserId }, jwtSecret, { expiresIn: '10m' })

  it('should add, then DELETE a connection for a user and verify removal', (done) => {
    const testUserId = '6562c186a4a586c6e19a4eef' 
    const testFriendId = '656a2e020f1c8e7b1de06e40'

    const newUserConnection = {
      userId: testUserId,
      friend_id: testFriendId,
      platforms: [{ name: "name", value: "value" }], 
      connected_date: new Date()
    }

    chai.request(server)
      .post(`/connections/save/${testUserId}`)
      .set('Authorization', `JWT ${token}`)
      .send(newUserConnection)
      .end((err, res) => {
        res.should.have.status(200) 

        chai.request(server)
          .delete(`/connections/${testUserId}/${testFriendId}`)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            res.should.have.status(200)

            chai.request(server)
              .get(`/connections/${testUserId}`)
              .set('Authorization', `JWT ${token}`)
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')

                const friendIds = res.body.map(connection => connection.friend_id.toString())
                friendIds.should.not.include(testFriendId)

                done()
              })
          })
      })

  })

  it('should return 400 for an invalid user ID format', (done) => {
    const invalidUserId = '! !'
    const validFriendId = '6562c186a4a586c6e19a4eef' 
    chai.request(server)
      .delete(`/connections/${invalidUserId}/${validFriendId}`)
      .set('Authorization', `JWT ${token}`)
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })
  
  it('should return 400 for an invalid friend ID format', (done) => {
    const validUserId = '656a2e020f1c8e7b1de06e40' 
    const invalidFriendId = '! !'
    chai.request(server)
      .delete(`/connections/${validUserId}/${invalidFriendId}`)
      .set('Authorization', `JWT ${token}`)
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('should not affect connections for a non-existent friend ID', (done) => {
    const validUserId = '656a2e020f1c8e7b1de06e40' 
    const nonExistentFriendId = '656a21d3110e39dcc9abb4ff'
  
    chai.request(server)
      .delete(`/connections/${validUserId}/${nonExistentFriendId}`)
      .set('Authorization', `JWT ${token}`)
      .end((err, res) => {
        res.should.have.status(200) 
  
        chai.request(server)
          .get(`/connections/${validUserId}`)
          .set('Authorization', `JWT ${token}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
          })
      })
  })

  it('should not affect connections for a non-existent friend ID', (done) => {
    const validUserId = '656a2e020f1c8e7b1de06e40' 
    const nonExistentFriendId = '656a21d3110e39dcc9abb4ff'
  
    chai.request(server)
      .get(`/connections/${validUserId}`)
      .set('Authorization', `JWT ${token}`)
      .end((err, initialRes) => {
        initialRes.should.have.status(200)
        const initialConnections = initialRes.body
  
        chai.request(server)
          .delete(`/connections/${validUserId}/${nonExistentFriendId}`)
          .set('Authorization', `JWT ${token}`)
          .end((err, deleteRes) => {
            deleteRes.should.have.status(200) 

            chai.request(server)
              .get(`/connections/${validUserId}`)
              .set('Authorization', `JWT ${token}`)
              .end((err, finalRes) => {
                finalRes.should.have.status(200)
                finalRes.body.should.be.an('array')
  
                finalRes.body.should.deep.equal(initialConnections)
  
                finalRes.body.forEach(connection => {
                  connection.should.have.property('friend_id')
                  connection.should.have.property('platforms').which.is.an('array')
                  connection.platforms.forEach(platform => {
                    platform.should.have.property('name')
                    platform.should.have.property('value')
                  })
                  connection.should.have.property('connected_date')
                })
  
                done()
              })
          })
      })
  })
})
