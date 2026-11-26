#!/usr/bin/env bash
# Rebuilds public/java-runner/StreamAtlasLauncher.jar from StreamAtlasLauncher.java.
# Needs a JDK 11+ (javac + jar). Run after editing the launcher, then commit both.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$here/../public/java-runner/StreamAtlasLauncher.jar"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# The runner uses CheerpJ's Java 17 runtime; --release 11 keeps the jar compatible with it.
javac --release 11 -nowarn -d "$tmp/classes" "$here/StreamAtlasLauncher.java"
(cd "$tmp/classes" && jar cf "$tmp/launcher.jar" .)

mkdir -p "$(dirname "$out")"
cp "$tmp/launcher.jar" "$out"
echo "wrote $out ($(wc -c < "$out") bytes)"
