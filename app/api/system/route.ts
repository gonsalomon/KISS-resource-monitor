import { NextResponse } from 'next/server';

export async function GET() {
  const si = await import('systeminformation');
  
  try {
    const [cpu, cpuLoad, mem, osInfo, disk, graphics] = await Promise.all([
      si.cpu(),
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
      si.fsSize(),
      si.graphics()
    ]);
    
    return NextResponse.json({
      cpu: {
        brand: cpu.brand,
        cores: cpu.cores,
        speed: cpu.speed,
        load: cpuLoad.currentLoad.toFixed(2)
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        percentage: ((mem.used / mem.total) * 100).toFixed(2)
      },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        hostname: osInfo.hostname
      },
      disks: disk.map(d => ({
        fs: d.fs,
        type: d.type,
        size: d.size,
        used: d.used,
        available: d.available,
        usePercent: d.use
      })),
    gpu: {
    controllers: graphics.controllers.map(gpu => ({
      model: gpu.model,
      vendor: gpu.vendor,
      vram: gpu.vram,
      vramDynamic: gpu.vramDynamic,
      temperatureGpu: gpu.temperatureGpu,
      utilizationGpu: gpu.utilizationGpu,
      utilizationMemory: gpu.utilizationMemory
    })),
    displays: graphics.displays.map(display => ({
      model: display.model,
      main: display.main,
      resolutionX: display.resolutionX,
      resolutionY: display.resolutionY
    }))
  }
    });
  } catch (error) {
    console.error('System info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system information' },
      { status: 500 }
    );
  }
}