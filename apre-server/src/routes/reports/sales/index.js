/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 *
 * Modifications:
 *   Added sales-by-category-and-customer-tabular API to get sales by category and customer - SKG June 6, 2025
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});


// localhost:3000/reports/sales/sales-by-month?month=12
router.get('/sales-by-month', (req, res, next) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).send('Month parameter is missing');
    }

    mongo (async db => {
      const salesByMonth = await db.collection('sales').aggregate([
        {
          $match: {
            $expr: {
              $eq: [ { $month: '$date' }, parseInt(month) ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            month: { $dateToString: { format: '%B', date: '$date' } },
            region: 1,
            product: 1,
            category: 1,
            customer: 1,
            salesperson: 1,
            channel: 1,
            amount: 1
          }
        }
      ]).toArray();

      res.send(salesByMonth);
    }, next);

  } catch (err) {
    console.error('Error getting sales data by month: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /categories
 *
 * Fetches a list of distinct sales categories.
 *
 * Example:
 * fetch('/categories')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/categories', (req, res, next) => {
  try {
    mongo (async db => {
      const categories = await db.collection('sales').distinct('category');
      res.send(categories);
    }, next);
  } catch (err) {
    console.error('Error getting categories: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /customers
 *
 * Fetches a list of distinct sales customers.
 *
 * Example:
 * fetch('/customers')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/customers', (req, res, next) => {
  try {
    mongo (async db => {
      const customers = await db.collection('sales').distinct('customer');
      res.send(customers);
    }, next);
  } catch (err) {
    console.error('Error getting customers: ', err);
    next(err);
  }
});


/**
 * @description
 *
 * GET /sales-by-category-and-customer-tabular
 *
 * Fetches sales data for a specific category and customer.
 *
 * Example:
 * fetch('/sales-by-category-and-customer-tabular?category=wearables&customer=Lambda%20LLC')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/sales-by-category-and-customer-tabular', (req, res, next) => {
  try {
    const category = req.query.category;  // retrieve the category parameter from the request
    const customer = req.query.customer;  // retrieve the customer parameter from the request

    if (!category) {                      // return an error message if no valid category parameter was passed in the request
      return res.status(400).send('Category parameter is missing');
    }

    if (!customer) {                      // return an error message if no valid customer parameter was passed in the request
      return res.status(400).send('Customer parameter is missing');
    }

    mongo (async db => {                  // query the sales collection
      const salesByCategoryAndCustomerTabular = await db.collection('sales').aggregate([
        {
          $match: {
            $expr: {
              $and: [                     // select documents that match the requested category and customer
                { $eq: ["$category", category] },
                { $eq: ["$customer", customer] }
              ]
            }
          }
        },
        {
          $project: {                     // return the following fields
            _id: 0,
            id: '$_id',
            date: 1,
            region: 1,
            product: 1,
            salesperson: 1,
            channel: 1,
            amount: 1
          }
        }
      ]).toArray();

      res.send(salesByCategoryAndCustomerTabular);
    }, next);
  } catch (err) {
    console.error('Error getting sales by category and customer: ', err); // log any other types up errors and pass them up
    next(err);
  }
});

module.exports = router;