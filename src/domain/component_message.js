export const MessageType = Object.freeze({
  menu: Symbol("menu"),
  page: Symbol("page")
});

export class ComponentMessage {
  type = MessageType.menu;
  message = {};

  constructor(type, message) {
    this.type = type;
    this.message = message;
  }
}