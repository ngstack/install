// partial, contains only the info needed by the tool

interface AngularConfig {
  defaultProject: string;
  projects: {
    [key: string]: {
      architect: {
        build: {
          options: {
            assets: Array<any>;
          };
        };
        test: {
          options: {
            assets: Array<any>;
          };
        };
      };
    };
  };
}

export default AngularConfig;
