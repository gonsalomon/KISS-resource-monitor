export interface SystemData {
  cpu: {
    brand: string;
    cores: number;
    speed: number;
    load: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: string;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    hostname: string;
  };
  disks: Array<{
    fs: string;
    type: string;
    size: number;
    used: number;
    available: number;
    usePercent: number;
  }>;
  gpu: {
    controllers: Array<{
      model: string;
      vendor: string;
      vram: number | null;
      vramDynamic: boolean;
      temperatureGpu: number | null;
      utilizationGpu: number | null;
      utilizationMemory: number | null;
    }>;
    displays: Array<{
      model: string;
      main: boolean;
      resolutionX: number;
      resolutionY: number;
    }>;
  };
}