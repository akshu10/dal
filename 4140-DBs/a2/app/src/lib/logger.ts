class Logger {
  debug = (message: string) => {
    console.log(message);
  };

  info = (message: string) => {
    console.log(message);
  };

  error = (message: string) => {
    console.error(message);
  };
}

export default new Logger();
