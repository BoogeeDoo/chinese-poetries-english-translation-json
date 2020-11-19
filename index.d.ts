interface Poetry {
  url: string;
  title: string;
  author: string;
  content: string[];
}

export as namespace poetries;
declare namespace poetries {}
declare const poetries: Poetry[];

export = poetries;
