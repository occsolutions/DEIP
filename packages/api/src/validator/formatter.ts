
export default class Formatter {
  constructor(private errors = []) {}

  public addError(error, field, validation, args) {
    if (error instanceof Error) {
      validation = 'ENGINE_EXCEPTION';
    }

    this.errors.push({ field, validation, args });
  }

  // return null if no errors are present,
  // otherwise validate will be rejected with an empty
  // error
  public toJSON() {
    return this.errors.length ? this.errors : undefined;
  }
}
