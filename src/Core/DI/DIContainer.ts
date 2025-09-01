// Container.ts

import type { ServiceFactory } from "@sharedTypes";

export class DIContainer {
  private static services = new Map<string, any>();
  private static factories = new Map<string, ServiceFactory<any>>();

  static register<T>(key: string, factory: ServiceFactory<T>) {
    this.factories.set(key, factory);
  }

  static resolve<T>(key: string): T {
    if (!this.services.has(key)) {
      const factory = this.factories.get(key);
      if (!factory) throw new Error(`Service not registered: ${key}`);
      this.services.set(key, factory());
    }
    return this.services.get(key);
  }

  static reset() {
    this.services.clear();
    this.factories.clear();
  }
}
