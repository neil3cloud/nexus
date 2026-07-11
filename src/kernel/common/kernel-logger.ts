export interface KernelLogger {
  info(message: string, fields?: Readonly<Record<string, string>>): void;
  error(message: string, fields?: Readonly<Record<string, string>>): void;
}
