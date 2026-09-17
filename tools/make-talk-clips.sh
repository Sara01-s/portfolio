#!/usr/bin/env bash
# Builds the autoplay clips for the talk cards.
#
# Requires yt-dlp and ffmpeg on PATH. Neither is installed on this machine yet:
#   winget install yt-dlp.yt-dlp
#   winget install Gyan.FFmpeg
#
# Run from the repo root:  bash tools/make-talk-clips.sh
#
# The start times are the ?t= offsets already in index.html, i.e. the moment
# Sara chose as each talk's entry point. LENGTH is the only knob worth tuning;
# 12s is long enough to show something happening and short enough to keep each
# clip near the ~400-800KB the other card videos weigh.

set -euo pipefail

LENGTH=12
OUT=resources

# id | start seconds | output basename
CLIPS=(
	"KWcO_jwDOLI|2763|video_talk_audio"
	"AUnRKvaqinQ|1126|video_talk_social_skills"
	"qWxWCr9aDU0|786|video_talk_dod"
	"cFof8S1PJCc|997|video_talk_shaders"
)

for spec in "${CLIPS[@]}"; do
	IFS='|' read -r id start name <<< "$spec"
	end=$(( start + LENGTH ))
	raw="$(mktemp -u)_$name.mp4"

	echo "==> $name  (youtube $id @ ${start}s)"

	# --download-sections fetches only the slice, not the whole talk.
	yt-dlp \
		--download-sections "*${start}-${end}" \
		--force-keyframes-at-cuts \
		-f "bestvideo[height<=720]+bestaudio/best[height<=720]" \
		--merge-output-format mp4 \
		-o "$raw" \
		"https://www.youtube.com/watch?v=${id}"

	# The cards are 200px tall and object-fit: cover, so 640x360 is already
	# more than the display needs. -an: the cards are muted, so the audio
	# track is pure payload. +faststart puts the moov atom first, which is
	# what lets playback begin before the file finishes downloading.
	ffmpeg -y -i "$raw" -an \
		-vf "scale=640:-2" \
		-c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
		-movflags +faststart \
		"$OUT/${name}.mp4"

	ffmpeg -y -i "$raw" -an \
		-vf "scale=640:-2" \
		-c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
		"$OUT/${name}.webm"

	rm -f "$raw"
	ls -lh "$OUT/${name}.mp4" "$OUT/${name}.webm"
done

echo
echo "Done. Clips are in $OUT/. index.html still points at the YouTube"
echo "previews: rewiring the cards is a separate step."
