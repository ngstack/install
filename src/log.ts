import chalk from 'chalk';

class Log {
  success(message: string): void {
    console.log(chalk.green('success'), message);
  }
  warning(message: string): void {
    console.log(chalk.yellow('warning'), message);
  }

  info(message: string): void {
    console.log(chalk.blue('info'), message);
  }

  error(message: string): void {
    console.log(chalk.red('error'), message);
  }
}

export default new Log();
