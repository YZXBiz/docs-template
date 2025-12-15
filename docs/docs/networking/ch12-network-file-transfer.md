---
sidebar_position: 3
title: "Network File Transfer and Sharing"
description: "Options for distributing and sharing files across networks, from quick transfers to enterprise file sharing"
---

import { ProcessFlow, StackDiagram, CardGrid, TreeDiagram, ConnectionDiagram, colors } from '@site/src/components/diagrams';

# 12. Network File Transfer and Sharing

## 12.1. Introduction: Choosing the Right Tool

**The What**: Many ways exist to move and share files across networks.

**The Where**: Different tools for different scenarios.

**The Why**: One size does NOT fit all - choose based on your needs.

<CardGrid
  title="Quick Reference: Which Tool to Use"
  cards={[
    {
      title: 'Quick One-Time Transfer',
      description: 'Temporary file sharing',
      items: ['Python SimpleHTTPServer', 'No setup needed', 'Local network only']
    },
    {
      title: 'Regular File Sync',
      description: 'Keep directories synchronized',
      items: ['rsync', 'Efficient (only changes)', 'Works over SSH']
    },
    {
      title: 'Windows File Sharing',
      description: 'Share with Windows machines',
      items: ['Samba (SMB/CIFS)', 'Native Windows protocol', 'Works with macOS too']
    },
    {
      title: 'Linux File Sharing',
      description: 'Between Linux machines',
      items: ['SSHFS (simple)', 'NFS (traditional)', 'Choose based on scale']
    }
  ]}
/>

## 12.2. Quick Copy: Python HTTP Server

### 12.2.1. Instant File Sharing

**The What**: Turn any directory into a web server instantly.

**The Where**: Built into Python - already on most Linux systems.

**The Why**: Fastest way to share files on a local network.

```bash
# Go to directory with files
$ cd ~/Documents

# Start web server on port 8000
$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...

# Or specify a port
$ python3 -m http.server 9000
```

Now from any browser on the network:
```
http://10.23.2.4:8000
```

You'll see a directory listing where you can download files.

:::danger[Security Warning]
This is NOT secure! Anyone on the network can access these files. Only use on trusted networks you control. Never use on public networks or the internet.
:::

<ProcessFlow
  title="Quick File Sharing Workflow"
  steps={[
    {
      name: 'Navigate',
      description: 'cd to directory with files',
      color: colors.blue
    },
    {
      name: 'Start Server',
      description: 'python3 -m http.server',
      color: colors.green
    },
    {
      name: 'Share URL',
      description: 'Tell others http://your-ip:8000',
      color: colors.orange
    },
    {
      name: 'Stop Server',
      description: 'Ctrl-C when done',
      color: colors.purple
    }
  ]}
/>

## 12.3. rsync: The Synchronization Tool

### 12.3.1. Understanding rsync

**The What**: rsync efficiently synchronizes files between locations.

**The Where**: Works locally or over SSH to remote hosts.

**The Why**: Only transfers what changed - much faster than copying everything.

```bash
# Basic copy (like scp)
$ rsync file1 file2 user@host:

# Copy entire directory
$ rsync -a mydir/ user@host:destination/

# Dry run (see what would happen)
$ rsync -nv -a mydir/ user@host:destination/
```

Key options:
- `-a`: Archive mode (preserves permissions, timestamps, etc.)
- `-v`: Verbose (show what's being transferred)
- `-n`: Dry run (don't actually transfer)
- `-z`: Compress during transfer

### 12.3.2. rsync vs scp

<CardGrid
  title="Comparing Transfer Methods"
  cards={[
    {
      title: 'scp (Simple)',
      description: 'Like cp over network',
      items: ['Transfers everything', 'Good for one-time copies', 'Simple syntax']
    },
    {
      title: 'rsync (Smart)',
      description: 'Only transfers changes',
      items: ['Efficient for updates', 'Resume interrupted transfers', 'Many options']
    },
    {
      title: 'When to Use Each',
      description: 'Choose based on scenario',
      items: ['scp: Quick single file', 'rsync: Regular syncing', 'rsync: Large directories']
    }
  ]}
/>

### 12.3.3. Common rsync Patterns

**Making an exact copy (delete extra files):**

```bash
# Make destination exactly match source
$ rsync -a --delete source/ user@host:destination/
```

**The trailing slash matters:**

```bash
# Copy directory INTO destination
$ rsync -a mydir user@host:destination/
# Result: destination/mydir/files

# Copy directory CONTENTS to destination
$ rsync -a mydir/ user@host:destination/
# Result: destination/files
```

:::warning[Trailing Slash Danger]
The trailing slash changes behavior completely! With `--delete`, you could accidentally delete unrelated files. Always test with `-n` first.
:::

**Excluding files:**

```bash
# Exclude .git directories
$ rsync -a --exclude=.git source/ user@host:destination/

# Exclude multiple patterns
$ rsync -a --exclude=.git --exclude='*.tmp' source/ user@host:destination/

# Use exclude file
$ rsync -a --exclude-from=exclude-list.txt source/ user@host:destination/
```

### 12.3.4. rsync Performance Options

<CardGrid
  title="Optimizing rsync"
  cards={[
    {
      title: 'Compression (-z)',
      description: 'Compress during transfer',
      items: ['Good for slow connections', 'Bad for fast LANs', 'Uses CPU time']
    },
    {
      title: 'Checksum (-c)',
      description: 'Verify file contents',
      items: ['Slower but safer', 'Compares file contents', 'Good for critical data']
    },
    {
      title: 'Bandwidth Limit',
      description: 'Prevent network saturation',
      items: ['--bwlimit=1000 (KB/s)', 'Keep link responsive', 'Good for uploads']
    },
    {
      title: 'Progress (--progress)',
      description: 'See transfer status',
      items: ['Shows current file', 'Shows transfer speed', 'Good for large copies']
    }
  ]}
/>

```bash
# Limit bandwidth to 1000 KB/s
$ rsync -a --bwlimit=1000 source/ user@host:destination/

# Show progress
$ rsync -av --progress source/ user@host:destination/

# Combination for large transfers
$ rsync -avz --progress --bwlimit=5000 bigdir/ user@host:backup/
```

### 12.3.5. rsync for Backups

**The What**: rsync makes excellent backup solutions.

**The Where**: Local disks, network storage, cloud services.

**The Why**: Efficient, reliable, and resumable.

```bash
# Backup to external drive
$ rsync -a --delete /home/user/ /mnt/backup/user/

# Backup to network storage
$ rsync -a --delete /important/data/ user@nas.local:/backups/data/

# Backup with verification
$ rsync -ac --delete /critical/files/ user@backup-server:/secure/
```

<ProcessFlow
  title="rsync Backup Strategy"
  steps={[
    {
      name: 'Initial Sync',
      description: 'Full copy on first run',
      color: colors.blue
    },
    {
      name: 'Incremental Updates',
      description: 'Only changed files next time',
      color: colors.green
    },
    {
      name: 'Verify',
      description: 'Use --checksum for critical data',
      color: colors.orange
    },
    {
      name: 'Automate',
      description: 'Schedule with cron/systemd timer',
      color: colors.purple
    }
  ]}
/>

## 12.4. File Sharing Concepts

### 12.4.1. Transfer vs Sharing

**The What**: Understanding the difference between copying and sharing.

**The Where**: Different tools for different needs.

**The Why**: Sharing keeps files in one place; transfer makes copies.

**File Transfer** (scp, rsync):
- Creates duplicate copies
- Files on both machines
- No ongoing connection
- Good for distribution

**File Sharing** (NFS, Samba, SSHFS):
- Single copy of files
- Mounted on remote machine
- Continuous connection required
- Good for collaboration

### 12.4.2. Performance Considerations

**The What**: Network storage is SLOWER than local storage.

**The Where**: Latency is the main problem.

**The Why**: Every file access goes over the network.

<CardGrid
  title="Network Storage Performance"
  cards={[
    {
      title: 'Good Use Cases',
      description: 'When network storage works well',
      items: ['Streaming media', 'Sharing documents', 'Infrequent access']
    },
    {
      title: 'Bad Use Cases',
      description: 'When you will suffer',
      items: ['Software development', 'Video editing', 'Database files']
    },
    {
      title: 'The Latency Problem',
      description: 'Why it is slow',
      items: ['Every access waits for network', 'Caching helps but limited', 'Local disk is 100x faster']
    }
  ]}
/>

:::tip[When to Use Network Storage]
Ask yourself: "Why am I using network storage?" If the answer is "convenience for a few small files," that's fine. If it's "my entire development environment," keep it local.
:::

### 12.4.3. Security Considerations

**The What**: Network filesystems have security implications.

**The Where**: Authentication and encryption are often optional.

**The Why**: Default configs often prioritize ease over security.

Security features to consider:
- **Authentication**: Who can access the files?
- **Encryption**: Is data protected in transit?
- **Authorization**: What can each user do?

<CardGrid
  title="Security by Protocol"
  cards={[
    {
      title: 'SSHFS (Best)',
      description: 'Encrypted by default',
      items: ['Uses SSH encryption', 'SSH authentication', 'No extra setup needed']
    },
    {
      title: 'NFS (Weak)',
      description: 'Traditional Unix',
      items: ['Minimal authentication', 'No encryption by default', 'Trust-based by host']
    },
    {
      title: 'Samba/CIFS (Mixed)',
      description: 'Windows file sharing',
      items: ['Can use encryption', 'Password authentication', 'Varies by version']
    }
  ]}
/>

## 12.5. Samba: Windows File Sharing

### 12.5.1. Understanding SMB/CIFS

**The What**: Samba implements Windows file sharing for Linux.

**The Where**: Server Message Block (SMB) protocol.

**The Why**: Share files between Linux and Windows machines.

Samba provides:
- File sharing to/from Windows
- Printer sharing
- Windows network browsing
- Domain integration

### 12.5.2. Installing and Starting Samba

```bash
# Install Samba (Ubuntu/Debian)
$ sudo apt install samba

# Install Samba (Fedora/RHEL)
$ sudo dnf install samba

# Start Samba services
$ sudo systemctl start smbd nmbd
$ sudo systemctl enable smbd nmbd
```

Two daemons:
- **smbd**: File and printer sharing
- **nmbd**: NetBIOS name server (network browsing)

### 12.5.3. Basic Samba Configuration

**The What**: `/etc/samba/smb.conf` configures Samba.

**The Where**: Global settings plus individual share definitions.

**The Why**: Control what is shared and who can access it.

Example configuration:

```ini
[global]
   workgroup = WORKGROUP
   server string = My Linux Server
   security = user

[shared]
   path = /srv/samba/shared
   comment = Shared Files
   browseable = yes
   writable = yes
   guest ok = no
   valid users = john, jane

[public]
   path = /srv/samba/public
   comment = Public Files
   browseable = yes
   writable = no
   guest ok = yes
```

### 12.5.4. Samba User Management

**The What**: Samba maintains its own password database.

**The Where**: Separate from system passwords.

**The Why**: Windows password encryption differs from Unix.

```bash
# Add Samba user (must be a Linux user first)
$ sudo smbpasswd -a username

# Change Samba password
$ sudo smbpasswd username

# Disable Samba user
$ sudo smbpasswd -d username

# Enable Samba user
$ sudo smbpasswd -e username

# Delete Samba user
$ sudo smbpasswd -x username
```

<ProcessFlow
  title="Setting Up Samba Sharing"
  steps={[
    {
      name: 'Install Samba',
      description: 'apt/dnf install samba',
      color: colors.blue
    },
    {
      name: 'Configure smb.conf',
      description: 'Define shares in /etc/samba/smb.conf',
      color: colors.green
    },
    {
      name: 'Add Users',
      description: 'smbpasswd -a username',
      color: colors.orange
    },
    {
      name: 'Start Services',
      description: 'systemctl start smbd nmbd',
      color: colors.purple
    }
  ]}
/>

### 12.5.5. Accessing Samba Shares

**From Windows:**
```
\\server-name\shared
```

**From Linux (using smbclient):**
```bash
# List shares on a server
$ smbclient -L //server -U username

# Connect to a share
$ smbclient //server/shared -U username
smb: \> get file.txt
smb: \> put file.txt
smb: \> ls
```

**From Linux (mounting with CIFS):**
```bash
# Mount a Windows/Samba share
$ sudo mount -t cifs //server/shared /mnt/share -o username=user,password=pass

# Better: use credentials file
$ sudo mount -t cifs //server/shared /mnt/share -o credentials=/root/smbcreds

# In /root/smbcreds:
# username=myuser
# password=mypass
```

:::warning[Password in Command Line]
Never put passwords directly in mount commands - they appear in process lists and shell history. Use a credentials file instead.
:::

## 12.6. SSHFS: Simple SSH-Based Sharing

### 12.6.1. Understanding SSHFS

**The What**: Mount a remote directory over SSH.

**The Where**: Uses FUSE (Filesystem in Userspace) and SFTP.

**The Why**: Incredibly simple - if you have SSH access, SSHFS works.

```bash
# Install SSHFS
$ sudo apt install sshfs  # Ubuntu/Debian
$ sudo dnf install sshfs  # Fedora/RHEL

# Mount remote directory
$ sshfs user@host:/remote/path /local/mountpoint

# Mount home directory
$ sshfs user@host: ~/remote-home

# Unmount
$ fusermount -u /local/mountpoint
```

<CardGrid
  title="SSHFS Pros and Cons"
  cards={[
    {
      title: 'Advantages',
      description: 'Why SSHFS is great',
      items: ['Zero server setup', 'Encrypted by default', 'Works anywhere SSH works']
    },
    {
      title: 'Disadvantages',
      description: 'Limitations',
      items: ['Performance overhead', 'Single-user oriented', 'Requires SSH access']
    },
    {
      title: 'Best For',
      description: 'When to use SSHFS',
      items: ['Personal use', 'Occasional access', 'Already have SSH']
    }
  ]}
/>

### 12.6.2. SSHFS Options

```bash
# Better performance (disable some features)
$ sshfs -o compression=yes,cache=yes user@host:/path /mnt

# Allow other users to access
$ sshfs -o allow_other user@host:/path /mnt

# Use specific SSH key
$ sshfs -o IdentityFile=~/.ssh/special_key user@host:/path /mnt

# Mount on boot (add to /etc/fstab)
user@host:/remote/path /local/path fuse.sshfs defaults,_netdev,IdentityFile=/home/user/.ssh/id_rsa 0 0
```

## 12.7. NFS: Traditional Unix File Sharing

### 12.7.1. Understanding NFS

**The What**: Network File System - traditional Unix file sharing.

**The Where**: Common on Linux/Unix systems and NAS devices.

**The Why**: Native Unix protocol, good performance on trusted networks.

NFS versions:
- **NFSv3**: Older, widely compatible, less secure
- **NFSv4**: Modern, better security options, recommended

### 12.7.2. Mounting NFS Shares (Client)

```bash
# Basic NFS mount
$ sudo mount -t nfs server:/export/path /local/mountpoint

# With NFSv4 explicitly
$ sudo mount -t nfs -o nfsvers=4 server:/export /mnt/nfs

# Read-only mount
$ sudo mount -t nfs -o ro server:/export /mnt/nfs

# In /etc/fstab for automatic mounting
server:/export/path /mnt/nfs nfs defaults,_netdev 0 0
```

The `_netdev` option tells the system to wait for network before mounting.

### 12.7.3. NFS Security Models

<CardGrid
  title="NFS Authentication"
  cards={[
    {
      title: 'sys (Traditional)',
      description: 'Trust-based security',
      items: ['Uses UID/GID', 'Trusts client', 'Weak security']
    },
    {
      title: 'krb5 (Kerberos)',
      description: 'Strong authentication',
      items: ['Mutual authentication', 'Requires Kerberos setup', 'Enterprise-grade']
    },
    {
      title: 'Host-Based',
      description: 'Access by IP/hostname',
      items: ['Export to specific hosts', 'Simple but limited', 'Good for LANs']
    }
  ]}
/>

:::info[NFS Server Setup]
Setting up an NFS server is more complex than the client side. Consider using a NAS device with a web interface for easier management instead of configuring Linux NFS servers manually.
:::

## 12.8. Cloud Storage

### 12.8.1. Understanding Cloud Storage

**The What**: Store files on remote cloud services (S3, Google Cloud Storage, etc.).

**The Where**: Accessed via FUSE filesystems or web interfaces.

**The Why**: Unlimited capacity, automatic backups, no local maintenance.

Advantages:
- **No maintenance**: Provider handles hardware
- **Scalability**: Pay for what you use
- **Durability**: Multiple redundant copies
- **Accessibility**: Access from anywhere

Disadvantages:
- **Cost**: Ongoing subscription fees
- **Performance**: Slower than local storage
- **Privacy**: Data stored on third-party servers

### 12.8.2. Cloud Storage Tools

Many FUSE-based tools exist for mounting cloud storage:

**Amazon S3:**
- s3fs
- goofys
- rclone

**Google Cloud Storage:**
- gcsfuse
- rclone

**General (Multiple Providers):**
- rclone (supports 40+ providers)

Example with rclone:

```bash
# Configure remote (interactive)
$ rclone config

# List remotes
$ rclone listremotes

# Mount cloud storage
$ rclone mount myremote:mybucket /mnt/cloud &

# Sync to cloud
$ rclone sync /local/dir myremote:mybucket/backup
```

## 12.9. The State of File Sharing

### 12.9.1. Why No Perfect Solution?

**The What**: No single "best" file sharing solution exists.

**The Where**: Different tools excel in different scenarios.

**The Why**: Trade-offs between ease, security, and performance.

Historical context:

**Andrew File System (AFS)**:
- Solved many problems (security, performance, scale)
- Required significant infrastructure (Kerberos, etc.)
- Great for universities and large enterprises
- Too complex for small setups

**Current situation**:
- Small networks: Use simple tools (SSHFS, Samba)
- Large networks: Use enterprise solutions (AFS, Windows domain)
- Future: FUSE-based solutions with flexible security

### 12.9.2. Making the Right Choice

<ProcessFlow
  title="Choosing a File Sharing Solution"
  steps={[
    {
      name: 'Define Need',
      description: 'Transfer or share? How often?',
      color: colors.blue
    },
    {
      name: 'Consider Users',
      description: 'Linux only or mixed Windows/Mac?',
      color: colors.green
    },
    {
      name: 'Evaluate Security',
      description: 'Trusted network or internet?',
      color: colors.orange
    },
    {
      name: 'Choose Tool',
      description: 'Match tool to requirements',
      color: colors.purple
    }
  ]}
/>

<CardGrid
  title="Decision Matrix"
  cards={[
    {
      title: 'One-Time Transfers',
      description: 'Occasional file movement',
      items: ['scp for single files', 'rsync for directories', 'Python HTTP for ad-hoc']
    },
    {
      title: 'Regular Syncing',
      description: 'Keep directories updated',
      items: ['rsync as primary tool', 'Automate with cron', 'Consider rsync --daemon']
    },
    {
      title: 'Live Sharing',
      description: 'Multiple users, same files',
      items: ['Samba for Windows clients', 'NFS for Linux-only', 'SSHFS for simple cases']
    },
    {
      title: 'Professional Needs',
      description: 'Enterprise requirements',
      items: ['NAS device with web UI', 'AFS for large deployments', 'Commercial solutions']
    }
  ]}
/>

## 12.10. Summary

You've learned multiple ways to move and share files across networks:

**Quick Transfer:**
- Python HTTP server for instant sharing
- Good for ad-hoc file distribution

**Efficient Syncing:**
- rsync for regular synchronization
- Only transfers what changed
- Excellent for backups

**Windows Integration:**
- Samba/CIFS for Windows file sharing
- Works with Linux, Windows, and macOS
- Requires user management

**Linux-to-Linux:**
- SSHFS for simplicity (uses SSH)
- NFS for traditional Unix sharing
- Choose based on scale and security needs

**Cloud Storage:**
- FUSE filesystems for mounting
- Trade-offs: convenience vs performance
- Good for backups and accessibility

<CardGrid
  title="Command Reference"
  cards={[
    {
      title: 'Quick Sharing',
      description: 'Temporary file access',
      items: ['python3 -m http.server', 'scp file user@host:', 'netcat for simple transfers']
    },
    {
      title: 'rsync Operations',
      description: 'Synchronization',
      items: ['rsync -av src/ dest/', 'rsync -a --delete (exact copy)', 'rsync --exclude=pattern']
    },
    {
      title: 'Mounting Shares',
      description: 'Access remote files',
      items: ['sshfs user@host:/path /mnt', 'mount -t nfs host:/path /mnt', 'mount -t cifs //host/share /mnt']
    },
    {
      title: 'Samba Commands',
      description: 'Windows file sharing',
      items: ['smbclient -L //server', 'smbpasswd -a user', 'testparm (test config)']
    }
  ]}
/>

:::tip[Choosing Wisely]
The best tool depends on your needs:
- **Need it now?** Python HTTP server or scp
- **Regular backups?** rsync
- **Windows users?** Samba
- **Simple Linux sharing?** SSHFS
- **High performance?** NFS on dedicated LAN
- **Mixed requirements?** Use multiple tools!
:::

Remember that file transfer and sharing have different use cases. Transfer creates copies (good for distribution and backups), while sharing provides live access (good for collaboration). Choose the approach that matches your workflow.
