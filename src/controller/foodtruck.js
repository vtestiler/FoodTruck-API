import mongoose from 'mongoose';
import { Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import bodyParser from 'body-parser';

import { authenticate } from '../middleware/authMiddleware';


export default ({ config, db}) => {
  let api = Router();

  // CRUD - Create Read Update Delete

  // 'v1/foodtruck/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

    newFoodTruck.save(err => {
      if(err) {
        res.send(err);

      }
      res.json({ message: `FoodTruck with the name ${req.body.name} created successfully`});
    });

  });

  // '/v1/foodtruck' - Read
  // get list of all foodtrucks
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if(err) {
        res.send(err);
      }

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
  api.put('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
      foodtruck.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({ message: `FoodTruck - ${req.params.id} info updated`});
      });
    });
  });

  // 'v1/foodtruck/:id' - Delete foodtruck and all thier reviews
  api.delete('/:id', authenticate, (req, res) => {

    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.status(500).send(err);
        return;
      }
      if (foodtruck === null){
        res.status(404).send("Food Truck not found");
        return;
      }

      FoodTruck.remove({
        _id: req.params.id
      }, (err, foodtruck) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        Review.remove({foodtruck: req.params.id} , (err, reviews) => {
          if(err) res.send(err);

        });
        res.json({ message: `FoodTruck with ID - ${req.params.id} Successfully Removed`});
      });

    });
  });


// add a review for a specific foodtruck id
// '/v1/foodtruck/reviews/add/:id'
api.post('/reviews/add/:id', authenticate, (req, res) => {
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
