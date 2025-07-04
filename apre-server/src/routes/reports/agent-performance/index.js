/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre agent performance API for the agent performance reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /call-duration-by-date-range
 *
 * Fetches call duration data for agents within a specified date range.
 *
 * Example:
 * fetch('/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/call-duration-by-date-range', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, 'Start date and end date are required'));
    }

    console.log('Fetching call duration report for date range:', startDate, endDate);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration'
          }
        },
        {
          $group: {
            _id: null,
            agents: { $push: '$agent' },
            callDurations: { $push: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agents: 1,
            callDurations: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-duration-by-date-range', err);
    next(err);
  }
});

/**
 *  task M-088 - SKG June 13, 2025
 *
 * @description
 *
 * GET /agent-performance-by-metric-type-tabular
 *
 * Fetches agent performance by the specified metric type.
 *
 * Example:
 * fetch('/agent-performance-by-metric-type-tabular?metricType=Customer Satisfaction')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/agent-performance-by-metric-type-tabular', (req, res, next) => {
  try {
    const { metricType } = req.query; // get the value of the metricType parameter from the request

    if (!metricType) {                // if the metricType is falsy, throw an error
      return next(createError(400, 'Metric type is required'));
    }

    console.log('Fetching call duration report for metric type:', metricType);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $unwind: '$performanceMetrics'
        },
        {
          $match: {
            'performanceMetrics.metricType': 'Sales Conversion'
          }
        },
        {
          $project: {
            _id: 0,
            region: 1,
            team: 1,
            agentId: 1,
            value: '$performanceMetrics.value'
          }
        }
      ]).toArray()

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /agent-performance-by-metric-type-tabular', err); // log if some other error occurs and pass it up the chain
    next(err);
  }
});

module.exports = router;