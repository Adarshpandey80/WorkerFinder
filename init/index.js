const mongoose = require("mongoose");
const data1 = require ("./electriciandata.js")
const data2 = require ("./carpenterdata.js")
const data3 = require ("./plumberdata.js")

const Plumber = require('../models/plumber.js');
const Carpenter = require('../models/carpenter.js');
const Electrician = require('../models/electrician.js');


async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/workerfinder');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
main();

const initDB1 = async () => {
    await Electrician.deleteMany({});
   data1.data1= data1.data1.map((obj) => ({...obj ,owner : "68299cc18e405137d6f378b8" }));
    await Electrician.insertMany(data1.data1);
    console.log(" Electrician data inserted");
}

const initDB2 = async () => {
  await Carpenter.deleteMany({});
data2.data2= data2.data2.map((obj) => ({...obj ,owner : "68299cc18e405137d6f378b8" }));
  await Carpenter.insertMany(data2.data2);
  console.log("Carpenter data inserted");
  }
  const initDB3 = async () => {
    await Plumber.deleteMany({});
    data3.data3= data3.data3.map((obj) => ({...obj ,owner : "68299cc18e405137d6f378b8" }));
    await Plumber.insertMany(data3.data3);
    console.log("Plumber data inserted");
    }
    initDB1();
    initDB2();
    initDB3();

// car 680bcc4b4aa5094e7a32b5d4

// ele  '680bcc4b4aa5094e7a32b5c0'

// pi 680bcc4b4aa5094e7a32b5ae
