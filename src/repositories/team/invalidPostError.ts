export class InvalidPostError extends Error {
  constructor() {
    super("Invalid submission for player");
  }
}
