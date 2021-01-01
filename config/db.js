const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(`MongoDB connected`)
  } catch (error) {
    console.error(`Error ${error.message}`)
    process.exit(1)
  }
}

// const connectDB = () => {
//   mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log('MongoDB Connected'))
//     .catch((err) => console.log(err))
// }
module.exports = connectDB
