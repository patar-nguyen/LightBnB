const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const query = require('express/lib/middleware/query');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1`, [email])
  .then((result) => {
     return(result.rows[0])
  })
  .catch((error) => {
    console.log(error)
  })
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id = $1`, [id])
  .then((result) => {
   return result.rows[0];
  })
  .catch((error) => {
    console.log(error)
  })
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
  .then((result) => {
    return result.rows[0];
  })
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT reservations.*, properties.*, AVG(rating) as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.reservation_id = reservations.id
  WHERE reservations.guest_id = $1
  AND start_date < now()
  GROUP BY reservations.id, properties.id, property_reviews.rating
  LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool.query(queryString, values)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(parseInt(options.minimum_price_per_night));
    queryString += `AND cost_per_night >= $${queryParams.length} `;

    queryParams.push(parseInt(options.maximum_price_per_night));
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `HAVING avg(rating) >= $${queryParams.length}`;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then((res) => res.rows)
  .catch((err) => {
    console.log(err.message);
  });


  // return pool
  //   .query(`SELECT * FROM properties LIMIT $1`, [limit])
  //   .then((result) => result.rows)
  //   .catch((err) => {
  //     console.log(err.message);
  // });

  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
