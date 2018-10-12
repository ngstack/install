interface Options {
  init?: boolean;
  skipInstall?: boolean;
  skipAssets?: boolean;
  skipModule?: boolean;
  skipFormat?: boolean;
  module?: string;
  import?: Array<string>;
}

export default Options;
