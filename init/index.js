require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require("mongoose");
const data1 = require ("./electriciandata.js")
const data2 = require ("./carpenterdata.js")
const data3 = require ("./plumberdata.js")

const Plumber = require('../models/plumber.js');
const Carpenter = require('../models/carpenter.js');
const Electrician = require('../models/electrician.js');


const owner = "68299cc18e405137d6f378b8";

const withDefaults = (listings, experience) => listings.map((listing) => ({
  ...listing,
  experience,
  owner,
}));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    await Electrician.deleteMany({});
    await Electrician.insertMany(withDefaults(data1.data1, 'Experienced electrician serving residential and commercial customers.'));
    console.log('Electrician data inserted');

    await Carpenter.deleteMany({});
    await Carpenter.insertMany(withDefaults(data2.data2, 'Experienced carpenter delivering careful, reliable woodwork and repairs.'));
    console.log('Carpenter data inserted');

    await Plumber.deleteMany({});
    await Plumber.insertMany(withDefaults(data3.data3, 'Experienced plumber providing dependable installation, maintenance, and repairs.'));
    console.log('Plumber data inserted');
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();

// car 680bcc4b4aa5094e7a32b5d4

// ele  '680bcc4b4aa5094e7a32b5c0'

// pi 680bcc4b4aa5094e7a32b5ae
