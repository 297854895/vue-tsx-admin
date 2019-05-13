export interface teamItem {
  id: number;
  icon: string;
  team: string;
}

export interface programStatisItem {
  id: number;
  time: string;
  title: string;
  icon: string;
  team: string;
  content: string
}

export interface momentItem {
  id: number;
  name: string;
  des: string;
  time: string;
}

export interface HomeState {
  programStatis: Array<programStatisItem> | null;
  moment: Array<momentItem> | null;
  team: Array<teamItem> | null;
}
