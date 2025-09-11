export let caCerts: string[] | null = null;

export const setCaCerts = (val: string[]) => {
  caCerts = val;
};
