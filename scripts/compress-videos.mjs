#!/usr/bin/env node
/**
 * Compress reel videos in public/videos with ffmpeg.
 * - H.264, CRF 28, max height 1280px, AAC audio, +faststart
 * - Extract first frame as {name}-poster.jpg
 * - Originals moved to video-backup/ (outside src)
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const VIDEOS_DIR = path.join(ROOT, 'public', 'videos')
const BACKUP_DIR = path.join(ROOT, 'video-backup')

const FFMPEG = process.env.FFMPEG ?? 'ffmpeg'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function sumMp4Bytes(dir) {
  if (!fs.existsSync(dir)) return 0
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.mp4'))
    .reduce((total, name) => total + fs.statSync(path.join(dir, name)).size, 0)
}

function runFfmpeg(args) {
  execFileSync(FFMPEG, args, { stdio: 'inherit' })
}

function posterNameFor(file) {
  return file.replace(/\.mp4$/i, '-poster.jpg')
}

function compressVideo(inputPath, outputPath) {
  runFfmpeg([
    '-y',
    '-i',
    inputPath,
    '-vf',
    'scale=-2:1280:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v',
    'libx264',
    '-crf',
    '28',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-ac',
    '2',
    '-movflags',
    '+faststart',
    outputPath,
  ])
}

function replaceFile(tempPath, destPath) {
  try {
    fs.renameSync(tempPath, destPath)
  } catch (err) {
    if (err.code !== 'EPERM' && err.code !== 'EBUSY') throw err
    fs.copyFileSync(tempPath, destPath)
    fs.unlinkSync(tempPath)
  }
}

function extractPoster(inputPath, posterPath) {
  runFfmpeg(['-y', '-i', inputPath, '-vframes', '1', '-q:v', '2', '-update', '1', posterPath])
}

function listMp4Files() {
  const names = new Set()
  if (fs.existsSync(VIDEOS_DIR)) {
    for (const name of fs.readdirSync(VIDEOS_DIR)) {
      if (name.toLowerCase().endsWith('.mp4') && !name.startsWith('.tmp')) {
        names.add(name)
      }
    }
  }
  if (fs.existsSync(BACKUP_DIR)) {
    for (const name of fs.readdirSync(BACKUP_DIR)) {
      if (name.toLowerCase().endsWith('.mp4')) names.add(name)
    }
  }
  return [...names].sort()
}

function originalBytesFor(file) {
  const backupPath = path.join(BACKUP_DIR, file)
  const publicPath = path.join(VIDEOS_DIR, file)
  if (fs.existsSync(backupPath)) return fs.statSync(backupPath).size
  if (fs.existsSync(publicPath)) return fs.statSync(publicPath).size
  return 0
}

function main() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error(`Videos directory not found: ${VIDEOS_DIR}`)
    process.exit(1)
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })

  const mp4Files = listMp4Files()

  if (mp4Files.length === 0) {
    console.log('No .mp4 files found in public/videos or video-backup')
    return
  }

  const beforeBytes = mp4Files.reduce((total, file) => total + originalBytesFor(file), 0)
  console.log(`Found ${mp4Files.length} video(s)`)
  console.log(`Before (originals): ${formatBytes(beforeBytes)}`)

  for (const file of mp4Files) {
    const destPath = path.join(VIDEOS_DIR, file)
    const backupPath = path.join(BACKUP_DIR, file)
    const tempPath = path.join(VIDEOS_DIR, `.tmp-${file}`)
    const posterPath = path.join(VIDEOS_DIR, posterNameFor(file))

    let sourcePath = backupPath
    if (!fs.existsSync(backupPath)) {
      if (!fs.existsSync(destPath)) {
        console.warn(`Skipping ${file}: missing in public/videos and video-backup`)
        continue
      }
      fs.renameSync(destPath, backupPath)
      console.log(`Backed up ${file}`)
      sourcePath = backupPath
    } else if (fs.existsSync(destPath)) {
      console.log(`Using backup for ${file}`)
      sourcePath = backupPath
    } else {
      console.log(`Using backup for ${file} (rebuilding missing output)`)
      sourcePath = backupPath
    }

    console.log(`Compressing ${file}...`)
    compressVideo(sourcePath, tempPath)
    replaceFile(tempPath, destPath)

    console.log(`Poster ${posterNameFor(file)}...`)
    extractPoster(destPath, posterPath)

    const originalSize = fs.statSync(backupPath).size
    const compressedSize = fs.statSync(destPath).size
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)
    console.log(
      `  ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${ratio}% smaller)\n`,
    )
  }

  const afterBytes = sumMp4Bytes(VIDEOS_DIR)
  const saved = beforeBytes - afterBytes
  const savedPct = beforeBytes > 0 ? ((saved / beforeBytes) * 100).toFixed(1) : '0.0'

  console.log('—'.repeat(48))
  console.log(`After  (public/videos/*.mp4): ${formatBytes(afterBytes)}`)
  console.log(`Saved: ${formatBytes(saved)} (${savedPct}% reduction vs originals)`)
  console.log(`Originals: ${BACKUP_DIR}`)
}

main()
