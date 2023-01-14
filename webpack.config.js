const path = require('path');
const webpack = require('webpack');

// mongoose
//   .connect(
//     process.env.MONGODB_URI ||
//       'mongodb+srv://sdf1444:boggie234@cluster0-wq3gs.mongodb.net/bibtex?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     }
//   )
//   .then(function onSuccess() {
//     console.log('The server connected with MongoDB.');
//   })
//   .catch(function onError() {
//     console.log('Error while connecting with MongoDB.');
//   });

ENVIRONMENT_VARIABLES = {
  'process.env.MONGO_CONNECTION_STRING': JSON.stringify('mongodb+srv://sdf1444:boggie234@cluster0-wq3gs.mongodb.net/bibtex?retryWrites=true&w=majority')
};

module.exports = {
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js',
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin(ENVIRONMENT_VARIABLES),
  ],
};