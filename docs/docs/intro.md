---
sidebar_position: 1
title: "How Linux Works"
description: "Master Linux internals - from the kernel to user space, networking to virtualization"
slug: /
---

import { CardGrid, StackDiagram, colors } from '@site/src/components/diagrams';

# How Linux Works

> **"The best way to learn how Linux works is to understand its layers."**

---

## What You'll Learn

This guide takes you from the fundamentals of Linux system architecture through advanced topics like virtualization and containers. Each chapter builds on the previous, giving you a complete understanding of how Linux operates.

<CardGrid cards={[
  {
    title: "System Fundamentals",
    description: "Understand the big picture, basic commands, and device management",
    color: colors.blue,
    items: ["Kernel vs User Space", "Shell Commands", "Device Files"]
  },
  {
    title: "Storage & Boot",
    description: "Master disks, filesystems, and the boot process",
    color: colors.purple,
    items: ["Partitions & Filesystems", "GRUB & Boot", "systemd"]
  },
  {
    title: "System Management",
    description: "Configure your system and manage processes",
    color: colors.green,
    items: ["System Configuration", "Process Management", "Resource Monitoring"]
  },
  {
    title: "Networking",
    description: "Configure networks and transfer files",
    color: colors.orange,
    items: ["Network Configuration", "SSH & Services", "File Transfer"]
  },
  {
    title: "Shell & Desktop",
    description: "Write scripts and understand the desktop environment",
    color: colors.cyan,
    items: ["Shell Scripts", "User Environments", "X11 & Wayland"]
  },
  {
    title: "Development",
    description: "Use development tools and understand virtualization",
    color: colors.red,
    items: ["Compilers & Make", "Building from Source", "Containers & VMs"]
  }
]} columns={3} />

---

## The Linux System Architecture

<StackDiagram
  title="Linux System Layers"
  layers={[
    { label: "User Applications", color: colors.blue, items: ["Browsers", "Editors", "Shells", "Utilities"] },
    { label: "System Libraries", color: colors.purple, items: ["glibc", "libpthread", "libm"] },
    { label: "System Calls", color: colors.green, items: ["read()", "write()", "fork()", "exec()"] },
    { label: "Linux Kernel", color: colors.orange, items: ["Process Scheduler", "Memory Manager", "Device Drivers", "Filesystems"] },
    { label: "Hardware", color: colors.slate, items: ["CPU", "Memory", "Storage", "Network"] }
  ]}
/>

---

## Learning Path

### Part I: System Fundamentals (Chapters 1-3)
Start here to understand the core concepts of Linux - how the kernel relates to user space, essential commands, and how devices work.

### Part II: Storage & Boot (Chapters 4-6)
Learn how disks and filesystems work, understand the boot process from BIOS to user space, and master systemd.

### Part III: System Management (Chapters 7-8)
Configure your system, manage processes, and monitor resources effectively.

### Part IV: Networking (Chapters 9-10, 12)
Understand network configuration, network services, and file transfer methods.

### Part V: Shell & Desktop (Chapters 11, 13-14)
Write shell scripts, customize your environment, and understand the desktop stack.

### Part VI: Development (Chapters 15-17)
Use development tools, compile software from source, and understand virtualization.

---

## Prerequisites

- Basic familiarity with using a terminal
- Access to a Linux system (virtual machine works great)
- Curiosity about how things work under the hood

---

**Ready to begin?** Start with [Chapter 1: The Big Picture](/system-fundamentals/ch01-big-picture).
