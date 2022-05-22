import { Schema } from 'mongoose';

export const DataResultSchema = new Schema({
  codName: String,
  state: Number,
  coord: {
    lat: Number,
    lng: Number,
  },
});
