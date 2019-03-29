import mongoose from 'mongoose';
import { Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import bodyParser from 'body-parser';


export default ({ config, db}) => {
  let api = Router();

  // CRUD - Create Read Update Delete

  // 'v1/foodtruck/add' - Create
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;
  //newFoodTruck.reviews = req.body.reviews;

    newFoodTruck.save(err => {
      if(err) {
        res.send(err);

      }
      res.json({ message: 'FoodTruck saved successfully'});
    });

  });

  // '/v1/foodtruck' - Read
  // get list of all foodtrucks
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if(err) {
        res.send(err);
      }
      //res.json({ message: 'List of FoodTrucks:'});
      res.json(foodtrucks);
    });
  });

  // 'v1/foodtruck/id/:id' - Read 1
  //get foodrtuck by id
  api.get('/id/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id' - Update
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({ message: `FoodTruck - ${req.params.id} info updated`});
      });
    });
  });

  // 'v1/foodtruck/:id' - Delete
  api.delete('/:id', (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "FoodTruck Successfully Removed"});
    });

  });

// add a review for a specific foodtruck id
// '/v1/foodtruck/reviews/add/:id'
api.post('/reviews/add/:id', (req, res) => {
  FoodTruck.findById(req.params.id, (err, foodtruck) =>{
    if (err) {
      res.send(err);
    }
    let newReview = new Review();

    newReview.title = req.body.title;
    newReview.text = req.body.text;
    newReview.foodtruck = foodtruck._id;
    newReview.save((err, review) =>{
      if (err){
        res.send(err);
      }
      foodtruck.reviews.push(newReview);
      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Food Truck review saved.'});
      });
    });
  });
});

// get reviews from a specific truck id
// 'v1/foodtruck/reviews/:id' Read

api.get('/reviews/:id', (req, res) => {
  Review.find({foodtruck: req.params.id} , (err, reviews) => {
    if(err){
      res.send(err);
    }
    res.json(reviews);
  });
});

//get list of all reviews
// 'v1/foodtruck/reviews' Read
api.get('/reviews', (req, res) => {
  Review.find({} , (err, reviews) => {
    if(err){
      res.send(err);
    }
    res.json(reviews);
  });
});


// get list of foodtrucks with certian foodtype
// '/v1/foodtruck/foodtype/:foodtype' - Read
api.get('/foodtype/:foodtype', (req, res) => {

  FoodTruck.find({foodtype: req.params.foodtype}, (err, foodtrucks) => {
    if(err) {
      res.send(err);
    }
    res.json(foodtrucks);
  });
});


  return api;

}
