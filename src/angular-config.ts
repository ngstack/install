// partial, contains only the info needed by the tool

interface BuildOptions {
  assets: Array<any>;
  styles: Array<string>;
  scripts: Array<string>
}

interface AngularConfig {
  defaultProject: string;
  projects: {
    [key: string]: {
      architect: {
        build: {
          options: BuildOptions;
        };
        test: {
          options: BuildOptions;
        };
      };
    };
  };
}

export default AngularConfig;
