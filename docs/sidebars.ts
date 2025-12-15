import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Part I: System Fundamentals',
      collapsible: true,
      collapsed: false,
      items: [
        'system-fundamentals/ch01-big-picture',
        'system-fundamentals/ch02-basic-commands',
        'system-fundamentals/ch03-devices',
      ],
    },
    {
      type: 'category',
      label: 'Part II: Storage & Boot',
      collapsible: true,
      collapsed: false,
      items: [
        'storage-boot/ch04-disks-filesystems',
        'storage-boot/ch05-kernel-boot',
        'storage-boot/ch06-user-space-starts',
      ],
    },
    {
      type: 'category',
      label: 'Part III: System Management',
      collapsible: true,
      collapsed: false,
      items: [
        'system-management/ch07-system-configuration',
        'system-management/ch08-processes-resources',
      ],
    },
    {
      type: 'category',
      label: 'Part IV: Networking',
      collapsible: true,
      collapsed: false,
      items: [
        'networking/ch09-network-configuration',
        'networking/ch10-network-applications',
        'networking/ch12-network-file-transfer',
      ],
    },
    {
      type: 'category',
      label: 'Part V: Shell & Desktop',
      collapsible: true,
      collapsed: false,
      items: [
        'shell-desktop/ch11-shell-scripts',
        'shell-desktop/ch13-user-environments',
        'shell-desktop/ch14-desktop-printing',
      ],
    },
    {
      type: 'category',
      label: 'Part VI: Development',
      collapsible: true,
      collapsed: false,
      items: [
        'development/ch15-development-tools',
        'development/ch16-compiling-from-source',
        'development/ch17-virtualization',
      ],
    },
  ],
};

export default sidebars;
