import chai from 'chai';
import chaiHttp from 'chai-http';
import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { v1 as uuidV1 } from 'uuid';
import app from '../app.mjs';
import { Order } from '../models/order.mjs';
import { Product } from '../models/product.mjs';
import { User } from '../models/user.mjs';
const expect = chai.expect;

const registrationUrl = '/api/register';
const loginUrl = '/api/login';
const usersUrl = '/api/users';
const productsUrl = '/api/products';
const ordersUrl = '/api/orders';
const contentType = 'application/json';
chai.use(chaiHttp);

const fakeId = () => uuidV1().replaceAll('-', '');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random().toString(36).substr(2, 9).trim();
  } while (str.length < len);

  return str.substr(0, len);
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const parentDir = dirname(currentDir);
const productsJson = resolve(parentDir, 'db', 'reset', 'products.json');
const usersJson = resolve(parentDir, 'db', 'reset', 'users.json');

// Get products (create copies for test isolation)
const products = JSON.parse(await fs.readFile(productsJson)).map(product =>
  Object.freeze({ ...product })
);
Object.freeze(products);

// Get users (create copies for test isolation)
const users = JSON.parse(await fs.readFile(usersJson)).map(user => Object.freeze({ ...user }));
Object.freeze(users);

const adminUser = Object.freeze({ ...users.find(u => u.role === 'admin') });
const customerUser = Object.freeze({ ...users.find(u => u.role === 'customer') });

const adminLogin = Object.freeze({ email: adminUser.email, password: adminUser.password });
const customerLogin = Object.freeze({ email: customerUser.email, password: customerUser.password });

const adminToken = new User(adminUser).getToken();
const customerToken = new User(customerUser).getToken();
const invalidToken = new User({
  ...adminUser,
  email: `${generateRandomString()}@email.com`
}).getToken();

const invalidCookie = 'token=' + encodeURIComponent(`s:${invalidToken}`);

const unknownUrls = Object.freeze([
  `/${generateRandomString(20)}.html`,
  `/api/${generateRandomString(20)}`
]);

const login = async (agent, credentials) => {
  const response = await agent
    .post(loginUrl)
    .set('Accept', contentType)
    .set('Content-Type', contentType)
    .send(credentials);

  return response;
};

describe('API', () => {
  let allUsers;
  let allProducts;
  let allOrders;

  // get randomized test user
  const getTestUser = () => {
    return {
      name: generateRandomString(),
      email: `${generateRandomString()}@email.com`,
      password: generateRandomString(10)
    };
  };

  const getTestProduct = () => {
    return {
      name: generateRandomString(),
      price: Math.floor(Math.random() * 50000) / 100,
      image: `http://www.images.com/${generateRandomString()}.jpg`,
      description: generateRandomString(75)
    };
  };

  const getTestOrder = () => {
    return {
      items: [
        {
          product: {
            id: allProducts[1].id,
            name: allProducts[1].name,
            price: allProducts[1].price,
            description: allProducts[1].description
          },
          quantity: Math.floor(Math.random() * 5) + 1
        }
      ]
    };
  };

  beforeEach(async () => {
    await User.deleteMany();
    await User.create(users);
    allUsers = User.findAll();

    await Product.deleteMany();
    await Product.create(products);
    allProducts = Product.findAll();

    const orders = allUsers
      .filter(user => user.role === 'customer')
      .map(user => {
        return {
          customerId: user.id,
          items: [
            {
              product: {
                id: allProducts[0].id,
                name: allProducts[0].name,
                price: allProducts[0].price,
                description: allProducts[0].description
              },
              quantity: Math.floor(Math.random() * 5) + 1
            }
          ]
        };
      });

    await Order.deleteMany();
    await Order.create(orders);
    allOrders = Order.findAll();
  });

  describe('General Server Functionality', () => {
    it('should respond with "404 Not Found" to an unknown URI', async () => {
      for (const url of unknownUrls) {
        const response = await chai.request(app).get(url);
        expect(response).to.have.status(404);
      }
    });

    it('should respond with HTML file when "/index.html" is requested', async () => {
      const response = await chai.request(app).get('/index.html');
      expect(response).to.have.status(200);
      expect(response).to.be.html;
    });

    it('should respond with "204 No Content" to an OPTIONS request', async () => {
      const response = await chai.request(app).options(usersUrl);
      expect(response).to.have.status(204);
    });
  });

  describe('Login: POST /api/login', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const user = { ...adminLogin };
    //   const response = await chai
    //     .request(app)
    //     .post(loginUrl)
    //     .set('Content-Type', contentType)
    //     .send(user);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const user = { ...adminLogin };
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(406);
    });

    it('should respond with "400 Bad Request" when email is missing', async () => {
      const user = { ...adminLogin };
      delete user.email;
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when password is missing', async () => {
      const user = { ...adminLogin };
      delete user.password;
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when email is invalid', async () => {
      const user = { ...adminLogin, email: adminLogin.email.split('@')[0] };
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "403 Forbidden" when email is incorrect', async () => {
      const user = { ...adminLogin, email: adminLogin.email.substring(1) };
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(403);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "403 Forbidden" when password is incorrect', async () => {
      const user = { ...adminLogin, password: generateRandomString(15) };
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(403);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should set token in cookie and user data in response when login is successful', async () => {
      const user = { ...adminLogin };
      const response = await chai
        .request(app)
        .post(loginUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('user');
      expect(response.body.user).to.have.all.keys('id', 'name', 'email', 'role');
    });
  });

  describe('Registration: POST /api/register', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const user = getTestUser();
    //   const response = await chai
    //     .request(app)
    //     .post(registrationUrl)
    //     .set('Content-Type', contentType)
    //     .send(user);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const user = getTestUser();
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(406);
    });

    it('should respond with "400 Bad Request" when email is missing', async () => {
      const user = getTestUser();
      delete user.email;
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when email is already in use', async () => {
      const user = getTestUser();
      user.email = adminUser.email;
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when name is missing', async () => {
      const user = getTestUser();
      delete user.name;
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when password is missing', async () => {
      const user = getTestUser();
      delete user.password;
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "201 Created" and set token to cookie when registration is successful', async () => {
      const user = getTestUser();
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      const createdUser = User.findOne({ email: user.email });
      const { id, name, email, role } = createdUser.toJSON();

      expect(response).to.have.status(201);
      expect(response).to.have.cookie('token');
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('user');
      expect(response.body.user).to.have.all.keys('id', 'name', 'email', 'role');
      expect(response.body.user).to.include({ id, name, email, role });
    });

    it('should set user role to "customer" when registration is successful', async () => {
      const user = getTestUser();
      user.role = 'admin';
      const response = await chai
        .request(app)
        .post(registrationUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);
      const createdUser = User.findOne({ email: user.email });
      expect(response).to.have.status(201);
      expect(response).to.have.cookie('token');
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('user');
      expect(response.body.user).to.have.all.keys('id', 'name', 'email', 'role');
      expect(response.body.user.role).to.equal('customer');
      expect(createdUser.role).to.equal('customer');
    });
  });

  describe('Viewing all users: GET /api/users', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).get(usersUrl);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).get(usersUrl).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai.request(app).get(usersUrl).set('Accept', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .get(usersUrl)
        .set('Accept', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(usersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(403);
    });

    it('should respond with JSON when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(usersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });
  });

  describe('Viewing a single user: GET /api/users/{id}', () => {
    let testUser;
    let url;

    beforeEach(async () => {
      const tempUser = users.find(u => u.role === 'admin' && u.email !== adminUser.email);
      testUser = User.findOne({ email: tempUser.email });
      url = `${usersUrl}/${testUser.id}`;
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai.request(app).get(url).set('Accept', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .get(url)
        .set('Accept', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(403);
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const credentials = { ...customerLogin };
    //   const agent = chai.request.agent(app);
    //   let response = await login(agent, credentials);

    //   expect(response).to.have.status(200);
    //   expect(response).to.have.cookie('token');
    //   response = await agent.get(url);

    //   await agent.close();
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', 'text/html');

      await agent.close();
      expect(response).to.have.status(406);
    });

    it('should respond with JSON when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'email', 'role');
    });

    it('should respond with status code 404 when user does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(`${usersUrl}/${fakeId()}`).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  describe('Updating users: PUT /api/users/{id}', () => {
    const user = {
      role: 'admin'
    };

    let testUser;
    let url;

    beforeEach(async () => {
      const tempUser = users.find(u => u.role === 'customer' && u.email !== customerUser.email);
      testUser = User.findOne({ email: tempUser.email });
      url = `${usersUrl}/${testUser.id}`;
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai
    //     .request(app)
    //     .put(url)
    //     .set('Content-Type', contentType);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(user);
      expect(response).to.have.status(406);
    });

    it('should respond with "415 Unsupported Media Type" when Content-Type header is missing', async () => {
      const response = await chai.request(app).put(url).set('Accept', contentType);
      expect(response).to.have.status(415);
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);

      await agent.close();
      expect(response).to.have.status(403);
    });

    it('should update role when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'email', 'role');
      expect(response.body.role).to.equal('admin');
    });

    it('should only update role', async () => {
      const userWithExtra = {
        id: fakeId(),
        ...getTestUser(),
        role: 'customer'
      };
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(userWithExtra);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'email', 'role');
      expect(response.body.email).to.equal(testUser.email);
      expect(response.body.name).to.equal(testUser.name);
      expect(response.body.id).to.equal(testUser.id);
      expect(response.body.role).to.equal('customer');
    });

    it('should respond with "400 Bad Request" when role is missing', async () => {
      const userWithExtra = {
        id: fakeId(),
        ...getTestUser()
      };
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(userWithExtra);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when role is not valid', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send({ role: generateRandomString() });

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with status code 404 when user does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(`${usersUrl}/${fakeId()}`)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(user);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  describe('Deleting users: DELETE /api/users/{id}', () => {
    let testUser;
    let url;

    beforeEach(async () => {
      const tempUser = users[users.length - 1];
      testUser = await User.findOne({ email: tempUser.email });
      url = `${usersUrl}/${testUser.id}`;
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai.request(app).delete(url).set('Accept', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .delete(url)
        .set('Accept', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.delete(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(403);
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).delete(url);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).delete(url).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should delete user when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.delete(url).set('Accept', contentType);

      await agent.close();
      const dbUsers = User.findAll();
      expect(response).to.have.status(200);
      expect(dbUsers).to.be.lengthOf(allUsers.length - 1);
    });

    it('should return the deleted user', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.delete(url).set('Accept', contentType);

      await agent.close();
      const dbUsers = User.findAll();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(dbUsers).to.be.lengthOf(allUsers.length - 1);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'email', 'role');
    });

    it('should respond with status code 404 when user does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.delete(`${usersUrl}/${fakeId()}`).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  /**
   *  Products endpoints
   */
  describe('Viewing all products: GET /api/products', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).get(productsUrl);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).get(productsUrl).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should respond with JSON when token cookie is missing', async () => {
      const response = await chai.request(app).get(productsUrl).set('Accept', contentType);
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });

    it('should respond with JSON when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(productsUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });

    it('should respond with JSON when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(productsUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });

    it('should respond with correct data when token cookie is missing', async () => {
      const productsData = JSON.parse(JSON.stringify(allProducts));
      const response = await chai.request(app).get(productsUrl).set('Accept', contentType);
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.deep.equal(productsData);
    });

    it('should respond with correct data when admin token is received', async () => {
      const productsData = JSON.parse(JSON.stringify(allProducts));
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(productsUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.deep.equal(productsData);
    });

    it('should respond with correct data when customer token is received', async () => {
      const productsData = JSON.parse(JSON.stringify(allProducts));
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(productsUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.deep.equal(productsData);
    });
  });

  describe('Viewing a single product: GET /api/products/{id}', () => {
    let testProduct;
    let url;

    beforeEach(async () => {
      testProduct = await Product.findOne();
      url = `${productsUrl}/${testProduct.id}`;
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).get(url);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).get(url).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should respond with JSON when token cookie is missing', async () => {
      const response = await chai.request(app).get(url).set('Accept', contentType);
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'price', 'description', 'image');
    });

    it('should respond with JSON when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'price', 'description', 'image');
    });

    it('should respond with JSON when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'price', 'description', 'image');
    });

    it('should respond with status code 404 when product does not exist', async () => {
      const response = await chai
        .request(app)
        .get(`${productsUrl}/${fakeId()}`)
        .set('Accept', contentType);
      expect(response).to.have.status(404);
    });
  });

  describe('Updating products: PUT /api/products/{id}', () => {
    const product = {
      name: 'Test Product',
      price: 45.75,
      image: 'http://www.google.com/',
      description: 'A mysterious test product'
    };

    let testProduct;
    let url;

    beforeEach(async () => {
      testProduct = Product.findOne();
      url = `${productsUrl}/${testProduct.id}`;
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai
    //     .request(app)
    //     .put(url)
    //     .set('Content-Type', contentType)
    //     .send(product);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(product);
      expect(response).to.have.status(406);
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(403);
    });

    it('should update product when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'description', 'image', 'price');
      expect(response.body.id).to.equal(testProduct.id);
      expect(response.body.name).to.equal(product.name);
      expect(response.body.description).to.equal(product.description);
      expect(response.body.image).to.equal(product.image);
      expect(response.body.price).to.equal(product.price);
    });

    it('should allow partial update of product properties', async () => {
      const productWithPartialData = { ...product };
      delete productWithPartialData.description;
      delete productWithPartialData.image;
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(productWithPartialData);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'description', 'image', 'price');
      expect(response.body.id).to.equal(testProduct.id);
      expect(response.body.description).to.equal(testProduct.description);
      expect(response.body.image).to.equal(testProduct.image);
      expect(response.body.name).to.equal(product.name);
      expect(response.body.price).to.equal(product.price);
    });

    it('should respond with "400 Bad Request" when name is empty', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send({ name: '' });

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is not a number', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send({ price: generateRandomString() });

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is 0 (zero)', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send({ price: 0 });

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is negative', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send({ price: -2.5 });

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with status code 404 when product does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .put(`${productsUrl}/${fakeId()}`)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  describe('Deleting products: DELETE /api/products/{id}', () => {
    let testProduct;
    let url;

    beforeEach(async () => {
      testProduct = Product.findOne();
      url = `${productsUrl}/${testProduct.id}`;
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai
        .request(app)
        .delete(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .delete(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .delete(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);

      await agent.close();
      expect(response).to.have.status(403);
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai
    //     .request(app)
    //     .delete(url)
    //     .set('Content-Type', contentType);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai
        .request(app)
        .delete(url)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType);
      expect(response).to.have.status(406);
    });

    it('should delete product when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .delete(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);

      await agent.close();
      const dbProducts = Product.findAll();
      expect(response).to.have.status(200);
      expect(dbProducts).to.be.lengthOf(allProducts.length - 1);
    });

    it('should return the deleted product', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .delete(url)
        .set('Accept', contentType)
        .set('Content-Type', contentType);

      await agent.close();
      const dbProducts = Product.findAll();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(dbProducts).to.be.lengthOf(allProducts.length - 1);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'price', 'image', 'description');
    });

    it('should respond with status code 404 when product does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .delete(`${productsUrl}/${fakeId()}`)
        .set('Accept', contentType)
        .set('Content-Type', contentType);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  describe('Create a new product: POST /api/products', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const product = getTestProduct();
    //   const response = await chai
    //     .request(app)
    //     .post(productsUrl)
    //     .set('Content-Type', contentType)
    //     .send(product);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const product = getTestProduct();
      const response = await chai
        .request(app)
        .post(productsUrl)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(product);
      expect(response).to.have.status(406);
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const product = getTestProduct();
      const response = await chai
        .request(app)
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const product = getTestProduct();
      const response = await chai
        .request(app)
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .set('Cookie', invalidCookie)
        .send(product);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when customer token is received', async () => {
      const product = getTestProduct();
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(403);
    });

    it('should respond with "400 Bad Request" when name is missing', async () => {
      const product = getTestProduct();
      delete product.name;
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is missing', async () => {
      const product = getTestProduct();
      delete product.price;
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "201 Created" when product creation is successful', async () => {
      const product = getTestProduct();
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(product);

      const createdProduct = await Product.findOne({
        name: product.name,
        image: product.image
      });
      const { name, price, image, description } = createdProduct;

      await agent.close();
      expect(response).to.have.status(201);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('id', 'name', 'price', 'description', 'image');
      expect(response.body).to.include({
        id: createdProduct.id,
        name,
        price,
        image,
        description
      });
    });
  });

  /**
   *  Orders endpoints
   */
  describe('Viewing all orders: GET /api/orders', () => {
    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai.request(app).get(ordersUrl).set('Accept', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .get(ordersUrl)
        .set('Accept', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).get(ordersUrl);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).get(ordersUrl).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should respond with JSON when admin token is received', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(ordersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });

    it('should respond with JSON when customer token is received', async () => {
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(ordersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('array');
    });

    it('should respond with correct data when admin token is received', async () => {
      const ordersData = JSON.parse(JSON.stringify(allOrders));
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(ordersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.deep.equal(ordersData);
    });

    it('should respond with correct data when customer token is received', async () => {
      const customer = allUsers.find(
        user => user.email === customerUser.email && user.role === 'customer'
      );
      const ordersData = JSON.parse(
        JSON.stringify(allOrders.filter(order => order.customerId === customer.id))
      );
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(ordersUrl).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.deep.equal(ordersData);
    });
  });

  describe('Viewing a single order: GET /api/orders/{id}', () => {
    let testOrder;
    let url;

    beforeEach(async () => {
      const customer = allUsers.find(
        user => user.email === customerUser.email && user.role === 'customer'
      );
      testOrder = await Order.findOne({ customerId: customer.id });
      url = `${ordersUrl}/${testOrder.id}`;
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const response = await chai.request(app).get(url).set('Accept', contentType);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const response = await chai
        .request(app)
        .get(url)
        .set('Accept', contentType)
        .set('Cookie', invalidCookie);
      expect(response).to.have.status(401);
    });

    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const response = await chai.request(app).get(url);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const response = await chai.request(app).get(url).set('Accept', 'text/html');
      expect(response).to.have.status(406);
    });

    it('should respond with JSON when admin token is received', async () => {
      const orderData = JSON.parse(JSON.stringify(testOrder));
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.deep.equal(orderData);
    });

    it('should respond with JSON when customer token is received', async () => {
      const orderData = JSON.parse(JSON.stringify(testOrder));
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(url).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.deep.equal(orderData);
    });

    it('should respond with status code 404 when order does not exist', async () => {
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(`${ordersUrl}/${fakeId()}`).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(404);
    });

    it('should respond with status code 404 when order exists but the owner is not the current customer', async () => {
      const order = allOrders.find(order => order.customerId !== testOrder.customerId);
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent.get(`${ordersUrl}/${order.id}`).set('Accept', contentType);

      await agent.close();
      expect(response).to.have.status(404);
    });
  });

  describe('Create a new order: POST /api/orders', () => {
    // it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
    //   const order = getTestOrder();
    //   const response = await chai
    //     .request(app)
    //     .post(ordersUrl)
    //     .set('Content-Type', contentType)
    //     .send(order);
    //   expect(response).to.have.status(406);
    // });

    it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
      const order = getTestOrder();
      const response = await chai
        .request(app)
        .post(ordersUrl)
        .set('Accept', 'text/html')
        .set('Content-Type', contentType)
        .send(order);
      expect(response).to.have.status(406);
    });

    it('should respond with "401 Unauthorized" when token cookie is missing', async () => {
      const order = getTestOrder();
      const response = await chai
        .request(app)
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);
      expect(response).to.have.status(401);
    });

    it('should respond with "401 Unauthorized" when token cookie is invalid', async () => {
      const order = getTestOrder();
      const response = await chai
        .request(app)
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .set('Cookie', invalidCookie)
        .send(order);
      expect(response).to.have.status(401);
    });

    it('should respond with "403 Forbidden" when admin token is received', async () => {
      const order = getTestOrder();
      const credentials = { ...adminLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(403);
    });

    it('should respond with "400 Bad Request" when items is empty', async () => {
      const order = getTestOrder();
      order.items = [];
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when same product appears several times in items', async () => {
      const order = getTestOrder();
      const productCopy = { ...order.items[0].product };
      order.items.push({ product: productCopy, quantity: 7 });
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when quantity is missing', async () => {
      const order = getTestOrder();
      delete order.items[0].quantity;
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when product is missing', async () => {
      const order = getTestOrder();
      delete order.items[0].product;
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when product id is missing', async () => {
      const order = getTestOrder();
      delete order.items[0].product.id;
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when product name is missing', async () => {
      const order = getTestOrder();
      delete order.items[0].product.name;
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is missing', async () => {
      const order = getTestOrder();
      delete order.items[0].product.price;
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      await agent.close();
      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "201 Created" when order creation is successful', async () => {
      const order = getTestOrder();
      const credentials = { ...customerLogin };
      const agent = chai.request.agent(app);
      let response = await login(agent, credentials);

      expect(response).to.have.status(200);
      expect(response).to.have.cookie('token');
      response = await agent
        .post(ordersUrl)
        .set('Accept', contentType)
        .set('Content-Type', contentType)
        .send(order);

      const orders = Order.findAll();
      const createdOrder = orders.find(o => o.id === response.body.id);
      const orderData = JSON.parse(JSON.stringify(createdOrder));

      await agent.close();
      expect(response).to.have.status(201);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(createdOrder).to.not.be.null;
      expect(createdOrder).to.be.an('object');
      expect(response.body).to.deep.equal(orderData);
    });
  });
});
