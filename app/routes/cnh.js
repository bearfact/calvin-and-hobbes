const app = module.exports = require('express')();
const Boom = require('boom');
const Joi = require('joi');
const asyncWrap = require('./asyncMiddleware');
const permit = require('./permission');
const { randomCalvinQuote, searchCalvinQuote, asyncerror, rejectMe, justThrowIt, enqueueJob } = require('../actions/cnh');

const searchSchema = Joi.object().keys({
  term: Joi.string().alphanum().min(3).required(),
});

app.get('/random', asyncWrap(async (req, res) => {
  const quote = await randomCalvinQuote();
  res.status(200).send(quote);
}));

app.post('/search', asyncWrap(async (req, res) => {
  const validation = Joi.validate(req.body, searchSchema);
  if (validation.error) {
    throw Boom.badRequest(validation.error.details[0].message, validation.error.details[0]);
  }
  const quote = await searchCalvinQuote(req.body.term);
  if (!quote) {
    throw Boom.notFound('a quote matching your search could not be found');
  }
  res.status(200).send(quote);
}));

app.get('/asyncerror', asyncWrap(async (req, res) => {
  await asyncerror();
  res.status(200).send('this will not be sent');
}));

app.get('/rejectme', asyncWrap(async (req, res) => {
  await rejectMe();
  res.status(200).send('this will not be sent');
}));

app.get('/justthrowit', asyncWrap(async (req, res) => {
  await justThrowIt();
  res.status(200).send('this will not be sent');
}));

app.post('/enqueuejob', asyncWrap(async (req, res) => {
  enqueueJob(req.body);
  res.status(200).send('job enqueued');
}));

app.get('/protected', permit('fancyClaim'), asyncWrap(async (req, res) => {
  res.status(200).send('You have permission');
}));

app.get('/nobody', permit('nobodyHasMe'), asyncWrap(async (req, res) => {
  res.status(200).send('You have permission');
}));
