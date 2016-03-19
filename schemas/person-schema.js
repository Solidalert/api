'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeoSchema = require('./geo-schema');

var PersonSchema = new Schema({

  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    },
    full: {
      type: String
    }
  },

  age: {
    type: Number,
    required: true,
    min: 0,
    max: 130
  },

  gender: {
    type: String,
    enum: 'M F'.split(' '),
    required: true
  },

  geo: GeoSchema,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

PersonSchema.virtual('name.full').get(function() {
  var first = this.name.first || '';
  var last = this.name.last || '';

  return (first + ' ' + last).trim();
});

PersonSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Person', PersonSchema);
