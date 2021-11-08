import { makeAutoObservable } from "mobx";

export interface ISearchStore {
  searched: string;
  hits: string[];
}

const demoConceptNames = [
  "Gazebo a beautiful tool",
  "SingularGarden",
  "Helloworld, I am Laurent",
  "Some other notes",
  "Have you tried whena.re?"
];

export class DummySearchStore implements ISearchStore {
  public searched: string;

  public constructor() {
    this.searched = "";
    makeAutoObservable(this);
  }

  public get hits(): string[] {
    const s = this.searched.toLocaleLowerCase();
    return demoConceptNames.filter((subject) =>
      subject.toLocaleLowerCase().includes(s)
    );
  }
}
