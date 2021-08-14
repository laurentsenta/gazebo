import { transaction } from "mobx";
import { logger } from "../utils";

const transactionerLog = logger("transactioner");

export function transactioner(
  target: any,
  propertyname: string,
  propertyDescription: PropertyDescriptor
): void {
  transactionerLog(target, propertyname, propertyDescription);

  const { value } = propertyDescription;

  propertyDescription.value = function (this: any, ...args: any[]): any {
    let r;

    transaction(() => {
      r = value.call(this, ...args);
    });

    return r;
  };
}
