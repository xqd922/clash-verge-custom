# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clash Verge Rev is a Clash Meta GUI built with Tauri 2 framework, using React for the frontend and Rust for the backend. It's a continuation of the original Clash Verge project, providing a modern interface for managing proxy configurations.

## Build Commands

### Development

```bash
# Install dependencies (use pnpm)
pnpm install

# Download Clash Mihomo core binary (required before running)
pnpm run check
# Use --force flag to update to latest version
# pnpm run check --force

# Run development server
pnpm dev
# If an instance is already running
pnpm dev:diff

# Run only frontend development
pnpm run web:dev
```

### Build

```bash
# Production build
pnpm run build

# Platform-specific builds
pnpm run build:windows       # Windows build
pnpm run build:windows:x64   # Windows x64 specific
pnpm run build:windows:arm64 # Windows ARM64 specific

# Build portable version
pnpm run portable
pnpm run portable-fixed-webview2
```

### Other Commands

```bash
# Create updater artifacts
pnpm run updater
pnpm run updater-fixed-webview2

# Fix alpha version
pnpm run fix-alpha-version
```

## Architecture

### Frontend (React + TypeScript)

- **src/** - Frontend source code
  - **pages/** - Main application pages
    - `_layout.tsx` - Main layout wrapper
    - `profiles.tsx` - Profile management
    - `proxies.tsx` - Proxy server interface
    - `connections.tsx` - Connection management
    - `rules.tsx` - Rule configuration
    - `logs.tsx` - Log viewer
    - `settings.tsx` - Application settings
  - **components/** - Reusable React components
  - **hooks/** - Custom React hooks for state management
  - **services/** - API services for backend communication
    - `api.ts` - Core API client
    - `cmds.ts` - Tauri command invocations
    - `states.ts` - Global state management
  - **utils/** - Utility functions
  - **locales/** - i18n translation files

### Backend (Rust + Tauri)

- **src-tauri/** - Rust backend code
  - **src/lib.rs** - Main library entry point, sets up Tauri app
  - **src/main.rs** - Application entry point
  - **src/cmds.rs** - Tauri command handlers exposed to frontend
  - **src/config/** - Configuration management
    - `clash.rs` - Clash configuration
    - `verge.rs` - Verge-specific settings
    - `profiles.rs` - Profile management
    - `runtime.rs` - Runtime configuration
  - **src/core/** - Core functionality
    - `core.rs` - Core clash process management
    - `service.rs` - System service management
    - `sysopt.rs` - System proxy operations
    - `tray/` - System tray implementation
    - `hotkey.rs` - Global hotkey management
  - **src/enhance/** - Configuration enhancement features
    - `merge.rs` - Profile merging logic
    - `script.rs` - JavaScript script execution
    - `chain.rs` - Enhancement chain processing
  - **src/utils/** - Utility modules

### Key Technologies

- **Tauri 2**: Cross-platform desktop framework
- **React 18**: Frontend UI framework
- **TypeScript**: Frontend type safety
- **Rust**: Backend language for performance
- **Vite**: Frontend build tool
- **Monaco Editor**: Code editor for configuration editing
- **MUI (Material-UI)**: Component library

## Important Configurations

### Tauri Configuration

- Main config: `src-tauri/tauri.conf.json`
- External binaries: `sidecar/verge-mihomo` and `sidecar/verge-mihomo-alpha`
- Resources: Located in `src-tauri/resources/`

### Build Profiles (Cargo.toml)

- **release**: Optimized for size (`opt-level = "s"`)
- **ci**: Optimized for CI builds (`opt-level = 2`)
- **dev**: Development mode with incremental compilation

### Frontend Build (vite.config.mts)

- Output directory: `dist/`
- Dev server: `http://localhost:3000/`
- Code splitting configured for vendor, MUI, and Monaco chunks
- Path aliases: `@` for `src/`, `@root` for root directory

## Key Features Implementation

- **Profile Management**: Handles subscription and local profiles through `src-tauri/src/config/profiles.rs`
- **System Proxy**: Managed via `src-tauri/src/core/sysopt.rs` using the sysproxy crate
- **TUN Mode**: Virtual network adapter support in `src-tauri/src/enhance/tun.rs`
- **WebDAV Sync**: Configuration backup via `src-tauri/src/core/backup.rs`
- **Deep Links**: Supports `clash://` and `clash-verge://` protocols
- **Auto-update**: Built-in updater using Tauri's updater plugin

## Development Notes

- The project uses pnpm as the package manager (v9.13.2)
- Prettier is configured for code formatting (2 spaces, double quotes)
- Husky is set up for Git hooks
- Windows development requires MSVC toolchain
- The Clash Mihomo core binary must be downloaded before running the development server
