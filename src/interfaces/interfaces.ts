export interface IMeta {
  total: number;
  limit: number;
  page: number;
}

export interface IRoute {
  name: string;
  path: string;
  icon: JSX.Element;
}

export interface IMessage {
  _id?: string;
  users:  String[];
  isGroup: boolean;
  sender: string;
  message: string;
}