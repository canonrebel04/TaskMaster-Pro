declare module 'pocketbase' {
  // Minimal shim for PocketBase until proper types are installed
  class PocketBase {
    constructor(url: string);
    collection(name: string): any;
    auth: any;
  }
  export default PocketBase;
}
