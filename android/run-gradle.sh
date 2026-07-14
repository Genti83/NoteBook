#!/bin/bash
export JAVA_TOOL_OPTIONS=""
unset _JAVA_OPTIONS
unset JAVA_OPTIONS

# Run gradle with agent disabled
exec java \
  -XX:+DisableAttachMechanism \
  -XX:+IgnoreUnrecognizedVMOptions \
  -Djava.awt.headless=true \
  -Xmx1024m \
  -cp /data/data/com.termux/files/usr/lib/gradle/lib/* \
  org.gradle.launcher.GradleMain \
  "$@"
