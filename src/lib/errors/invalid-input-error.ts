class InvalidInputError extends Error {
  message: string;
  name: string;
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
    this.message = message;
  }
}
export default InvalidInputError;
