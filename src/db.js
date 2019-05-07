import mongoose from 'mongoose';
import config from './config';

export default callback => {
  mongoose.Promise = global.promise;
  let db = mongoose.connect(config.mongoUrl, {useNewUrlParser: true});
  callback(db);
}
