export interface Configuration {
  assets?: Array<string | GlobRule>;
  modules?: Array<ModuleRef>;
  styles?: Array<string>;
  scripts?: Array<string>;
}

export interface ModuleRef {
  name: string;
  namespace: string;
}

export interface GlobRule {
  glob: string;
  input: string;
  output: string;
}
