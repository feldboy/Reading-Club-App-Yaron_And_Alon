#!/bin/bash
# Convert animated WebP to MP4
# Frame duration is 100ms = 10 FPS

FOOTAGE_DIR="public/footage"
TEMP_DIR="$FOOTAGE_DIR/temp_frames"
FPS=10

cd "$(dirname "$0")"

echo "Converting animated WebP files to MP4..."
echo "FPS: $FPS"

for webp in "$FOOTAGE_DIR"/*.webp; do
    if [ ! -f "$webp" ]; then
        continue
    fi

    basename=$(basename "$webp" .webp)

    # Skip non-video files
    if [[ "$basename" == *"MANIFEST"* ]]; then
        continue
    fi

    mp4="$FOOTAGE_DIR/${basename}.mp4"

    echo ""
    echo "Converting: $basename.webp"

    # Create temp directory for frames
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"

    # Extract all frames using webpmux
    echo "  Extracting frames..."
    frame_num=1
    while webpmux -get frame $frame_num "$webp" -o "$TEMP_DIR/frame_$(printf "%05d" $frame_num).webp" 2>/dev/null; do
        ((frame_num++))
        # Progress every 100 frames
        if [ $((frame_num % 100)) -eq 0 ]; then
            echo "    Extracted $frame_num frames..."
        fi
    done
    ((frame_num--))

    echo "  Total frames: $frame_num"

    # Convert frames to PNG
    echo "  Converting to PNG..."
    for f in "$TEMP_DIR"/*.webp; do
        dwebp "$f" -o "${f%.webp}.png" -quiet 2>/dev/null
        rm "$f"
    done

    # Create MP4 from frames
    echo "  Creating MP4..."
    ffmpeg -y -framerate $FPS -i "$TEMP_DIR/frame_%05d.png" \
        -c:v libx264 -pix_fmt yuv420p -preset medium -crf 18 \
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
        "$mp4" 2>/dev/null

    if [ -f "$mp4" ] && [ -s "$mp4" ]; then
        size=$(du -h "$mp4" | cut -f1)
        duration=$((frame_num / FPS))
        echo "  Success: $mp4 ($size, ~${duration}s)"
    else
        echo "  ERROR: Failed to create $mp4"
    fi

    # Cleanup
    rm -rf "$TEMP_DIR"
done

echo ""
echo "============================================"
echo "Conversion complete! MP4 files:"
ls -lh "$FOOTAGE_DIR"/*.mp4 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
