export interface Configuration {
  assets?: Array<string | GlobRule>;

  modules?: Array<{
    name: string;
    namespace: string;
  }>;
}

export interface GlobRule {
  glob: string;
  input: string;
  output: string;
}
