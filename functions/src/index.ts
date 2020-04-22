import express from "express";

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Participant, DB } from "./types";

admin.initializeApp(functions.config().firebase);
const app = express();

app.post('/', (req, res) => {
  const pushRef = admin.database().ref("/").push();
  pushRef.set(req.body, error => {
    if (error) {
      res.status(500).send(error.message).end();
    } else {
        res.status(200).end();
    }
  }).catch(e => {
    console.error(e);
    res.status(500).send(e).end();
  });
});

app.get('/get/:id', (req, res) => {
  const ret: Participant[] = []
  admin.database().ref("/")
    .once("value")
    .then((snapshot) => {
      if(snapshot){
        const obj = snapshot.val() as DB;
        Object.values(obj)
          .filter(
            (log) => log.payload.object.id === req.params.id
          )
          .forEach((flog) => {
            flog.payload.object.participant.event = flog.event;
            ret.push(flog.payload.object.participant);
          });
      }
  }).then(()=>{
    if(req.query.type === "csv"){
      res.write("event_type, id,  join_time,  left_time,  user_id,  user_name\n");
      ret.forEach((p) => {
        res.write(p.event + ",  " + p.id + ", " + p.join_time + ", " + p.left_time + ", " + p.user_id + ", " + p.user_name + "\n");
      });
      res.end();
    }else{
      res.json(ret);
    }
  }).catch(e => {
    console.error(e);
  });
});

export const participants = functions.https.onRequest(app);

