# zoom-participants
オンライン会議システムZoomのミーティングで入退室を記録するシステムです。ミーティングIDごとに入退室記録を得ることができます。

## 動かし方
### Firebaseプロジェクトの作成
<a href="https://firebase.google.com">Firebase</a>上で動作します。firebase-cli上で`firebase deploy`して動かすことができます。

### Zoomの設定
1. https://marketplace.zoom.us/develop/create からBuild Appします
2. Webhook Only AppをCreateします
3. 設定情報で重要なのは、Event notification endpoint URLにfirebaseのfunctionのURL（https\://us-central1-[firebaseのプロジェクト名].cloudfunctions.net/participants）を設定することと、
Event Typeに以下の4つを設定することです。
  - Participant joined meeting before host
  - Participant was waiting for host to join
  - Participant/Host joined meeting
  - Participant/Host left meeting

### 動作確認
- https\://us-central1-[firebaseのプロジェクト名].cloudfunctions.net/participants/get/[ミーティングid]にアクセスすると対応するミーティングIDの入退室記録が **JSONデータ** として出力されます。
- https\://us-central1-[firebaseのプロジェクト名].cloudfunctions.net/participants/get/[ミーティングid]?type=tsvにアクセスすると対応するミーティングIDの入退室記録が **TSVデータ** として出力されます。

#### データ定義
```typescript
export interface Participant{
  id: string;
  join_time: Date;
  leave_time: Date;
  user_id: string;
  user_name: string;
  event: string;
}
```

#### JSONデータの例
```JSON
[{
 "id":"8Bprt_LLL8iSY8cruq-Ew",
 "join_time":"2020-04-22T08:53:37Z",
 "user_id":"00000000",
 "user_name":"Kohei Matsumura",
 "event":"meeting.participant_joined"
 },{
 "id":"8Bprt_LLL8iSY8cruq-Ew",
 "leave_time":"2020-04-22T08:58:11Z",
 "user_id":"00000000",
 "user_name":"Kohei Matsumura",
 "event":"meeting.participant_left"
 }
]
```

#### TSVデータ
```
"event_type"  "id"  "join_time" "leave_time" "user_id" "user_name"
"meeting.participant_joined"  "8Bprt_LLL8iSY8cruq-Ew" "2020-04-22T08:53:37Z"     "00000000" "user_name":"Kohei Matsumura"
"meeting.participant_left"  "8Bprt_LLL8iSY8cruq-Ew"   "2020-04-22T08:58:11Z"  "00000000"  "user_name":"Kohei Matsumura"
```
