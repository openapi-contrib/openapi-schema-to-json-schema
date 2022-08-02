class InvalidTypeError extends Error {
  message: string;
  name: string;
  constructor(message: string) {
    super(message);
    this.name = "InvalidTypeError";
    this.message = message;
  }
}
export default InvalidTypeError;
