interface Options {
  init?: boolean;
  skipInstall?: boolean;
  skipAssets?: boolean;
  skipModule?: boolean;
  skipFormat?: boolean;
  skipStyles?: boolean;
  skipScripts?: boolean;
  module?: string;
  import?: Array<string>;
}

export default Options;
