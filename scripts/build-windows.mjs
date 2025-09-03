#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

const ARCH = process.argv[2] || "x64";
const VERSION = process.env.npm_package_version || "2.1.0";

console.log(`🚀 开始构建 Windows 11 专版 - ${ARCH} 架构`);

// 构建目标映射
const targetMap = {
  x64: "x86_64-pc-windows-msvc",
  arm64: "aarch64-pc-windows-msvc",
  x86: "i686-pc-windows-msvc"
};

const target = targetMap[ARCH];
if (!target) {
  console.error(`❌ 不支持的架构: ${ARCH}`);
  process.exit(1);
}

try {
  // 1. 清理之前的构建
  console.log("🧹 清理之前的构建文件...");
  
  // 2. 安装依赖
  console.log("📦 安装依赖...");
  execSync("pnpm install", { stdio: "inherit" });
  
  // 3. 检查目标
  console.log(`🔍 检查构建目标: ${target}`);
  execSync(`pnpm check ${target}`, { stdio: "inherit" });
  
  // 4. 构建应用
  console.log(`🔨 开始构建 ${ARCH} 版本...`);
  execSync(`pnpm build --target ${target}`, { 
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: "--max_old_space_size=4096"
    }
  });
  
  // 5. 创建便携版
  console.log("📦 创建便携版...");
  await createPortableVersion(target, ARCH, VERSION);
  
  console.log("✅ Windows 11 专版构建完成！");
  
} catch (error) {
  console.error("❌ 构建失败:", error.message);
  process.exit(1);
}

async function createPortableVersion(target, arch, version) {
  const exePath = `src-tauri/target/${target}/release/clash-verge.exe`;
  
  if (!fs.existsSync(exePath)) {
    console.warn("⚠️  可执行文件不存在，跳过便携版创建");
    return;
  }
  
  const portableDir = `Clash-Verge-Rev-${version}-Windows11-${arch}-Portable`;
  
  // 创建便携版目录
  await fs.ensureDir(portableDir);
  
  // 复制主程序
  await fs.copy(exePath, path.join(portableDir, "Clash-Verge-Rev.exe"));
  
  // 创建便携版标识
  await fs.writeFile(
    path.join(portableDir, "portable.txt"),
    "This is a portable version of Clash Verge Rev for Windows 11"
  );
  
  // 创建README
  const readmeContent = `# Clash Verge Rev - Windows 11 Portable Version

## 使用说明 / Usage Instructions

### 中文说明：
1. 直接运行 Clash-Verge-Rev.exe 即可启动程序
2. 便携版会在当前目录创建配置文件，无需安装
3. 适用于 Windows 11 系统
4. 支持 ${arch} 架构

### English Instructions:
1. Run Clash-Verge-Rev.exe directly to start the application
2. Portable version creates config files in current directory, no installation required
3. Compatible with Windows 11
4. Supports ${arch} architecture

## 版本信息 / Version Info
- Version: ${version}
- Architecture: ${arch}
- Build Time: ${new Date().toLocaleString()}
- Target: Windows 11

## 系统要求 / System Requirements
- Windows 11 (推荐 / Recommended)
- Windows 10 version 1903 或更高版本 / or higher
`;
  
  await fs.writeFile(path.join(portableDir, "README.md"), readmeContent);
  
  console.log(`✅ 便携版创建完成: ${portableDir}`);
}