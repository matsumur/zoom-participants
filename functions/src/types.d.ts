export interface DB {
  [key: string]: Log;
}
export interface Log {
  event: string;
  payload: {
    account_id: string;
    object: {
      duration: number;
      host_id: string;
      id: string;
      participant: Participant;
      start_time: Date;
      timezone: string;
      topic: string;
      type: number;
      uuid: string;
    };
  };
}
export interface Participant{
  id: string;
  join_time: Date;
  left_time: Date;
  user_id: string;
  user_name: string;
}
