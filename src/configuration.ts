interface Configuration {
  assets?: Array<
    | string
    | {
        glob: string;
        input: string;
        output: string;
      }
  >;

  modules?: Array<{
    name: string;
    namespace: string;
  }>;
}

export default Configuration;
