const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");

const testApp = require('../testApp');

describe('GET cafes data', () => {
  it('should respond with template', done => {
    request(testApp)
      .get('/api/view')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.cafeData.arrangemenet.length).to.eql(100);
        done();
      });
  });
});

describe('post /api/login', () => {
  it('If email are wrong, send following status and url', done => {
    request(testApp)
      .post('/api/login')
      .send({ email:'qwe@azxc', password: '123', password2:'123' })
      .expect(302)
      .end((err, res)=>{
        expect(res.text).to.include('Found. Redirecting to /login?error=nonemail');
        done();
      });
  });
  it('If the password is incorredt, send the following url', done => {
    request(testApp)
      .post('/api/login')
      .send({ email:'1@1', password: '2', password2:'2' })
      .expect(302)
      .end((err, res) => {
        expect(res.text).to.include('Found. Redirecting to /login?error=wrongpassword');
        done();
      });
  });
});

describe('POST /api/signup', () => {
  it('If two passwords are wrong, send following status and url', done => {
    request(testApp)
      .post('/api/signup')
      .send({ email:'newOnew@asd', password: '123', password2:'1234' })
      .expect(302)
      .expect('Location', '/signup?error=wrongpassword')
      .end((err, res)=>{
        done();
      });
  });
  it('If the email is duplicated, send the following status and url', done => {
    request(testApp)
      .post('/api/signup')
      .send({ email:'qwe@qwe', password: '123', password2:'123' })
      .expect(302)
      .expect('Location', '/signup?error=dupId')
      .end(done());
  });

  describe('post /api/cafes/menu/:id', () => {
    it('메뉴 수정 가능 해야한다.', done => {
      let menu_id = null;
      let menu_price = null;
      let menu_name = null;
      let menu_desc = null;

      let previousData = null;
      //id, price, name, desc
      const adminTocken = 'eyJhbGciOiJIUzI1NiJ9.MkAy.d_qbeutN2iXsAY6uMXHYd7ea-UkW-1ED8qK_ANae9NU';

      request(testApp)
        .get('/api/view')
        .expect(200).end((err, res) => {
          previousData = res.body.cafeData.menu[0]
          menu_id =  res.body.cafeData.menu[0]._id;
          menu_price = res.body.cafeData.menu[0].price;
          menu_name = res.body.cafeData.menu[0].name;
          menu_desc = res.body.cafeData.menu[0].desc;
          done();
        });

      request(testApp).post('/api/cafes/menu/awd')
        .send({id : menu_id, price : '3000', name : 'test', desc : 'test입니다'})
        .expect(200)
        .end((err, res) => {
          console.log("Awdwd",res.body);
          done()
        })

      // request(testApp)
      // .get('/api/view')
      // .expect(200)
      // .end((err, res) => {
      //   if (err) return done(err);
      //   console.log(res.body.cafeData.menu[0]);
      //   console.log(previousData);
      //   // expect(res.body.cafeData.arrangemenet.length).to.eql(100);
      //   done();
      // });

        //위에서 저장하고 한번더 불러서 비교하기
    })
  })
});



// describe('POST /users', () => {
//   it('should add new user', done => {
//     request(app)
//       .post('/users')
//       .send({ id: 4, name: 'test' })
//       .expect('Content-Type', /json/)
//       .expect(201)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(USERS.length).to.eql(4);
//         expect(res.body).to.eql(USERS);
//         done();
//       });
//   });
// });