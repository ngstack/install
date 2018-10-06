interface Configuration {
  assets?: Array<{
    from: string;
    to?: string;
  }>;

  modules?: Array<{
    name: string;
    namespace: string;
  }>;
}

export default Configuration;
