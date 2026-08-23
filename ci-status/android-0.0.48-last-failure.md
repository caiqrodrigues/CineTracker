# Android 0.0.48 - last build failure

```text
Starting a Gradle Daemon (subsequent builds will be faster)
WARNING: We recommend using a newer Android Gradle plugin to use compileSdk = 35

This Android Gradle plugin (8.5.2) was tested up to compileSdk = 34.

You are strongly encouraged to update your project to use a newer
Android Gradle plugin that has been tested with compileSdk = 35.

If you are already using the latest version of the Android Gradle plugin,
you may need to wait until a newer version with support for compileSdk = 35 is available.

For more information refer to the compatibility table:
https://d.android.com/r/tools/api-level-support

To suppress this warning, add/update
    android.suppressUnsupportedCompileSdk=35
to this project's gradle.properties.
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug
> Task :app:generateDebugResValues
> Task :app:checkDebugAarMetadata
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:mergeDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:compressDebugAssets
> Task :app:processDebugManifestForPackage
> Task :app:checkDebugDuplicateClasses
> Task :app:desugarDebugFileDependencies
> Task :app:mergeDebugStartupProfile
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeDebugJavaResource
> Task :app:processDebugResources
> Task :app:validateSigningDebug
> Task :app:mergeExtDexDebug

> Task :app:compileDebugJavaWithJavac
Note: /home/runner/work/CineTracker/CineTracker/apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

> Task :app:dexBuilderDebug
> Task :app:writeDebugAppMetadata
> Task :app:mergeProjectDexDebug
> Task :app:writeDebugSigningConfigVersions
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
gradle/actions: Writing build results to /home/runner/work/_temp/.gradle-actions/build-results/__run_3-1787447571660.json

[Incubating] Problems report is available at: file:///home/runner/work/CineTracker/CineTracker/apps/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/9.7.0/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 31s
33 actionable tasks: 33 executed
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.7.0/userguide/configuration_cache_enabling.html

--- update compatibility ---
--- apksigner 0.0.46 ---
V2 Signer: certificate DN: C=US, O=Android, CN=Android Debug
V2 Signer: certificate SHA-256 digest: 5a5e16933b91f015b5f5da0f178543b63c92e49e595c8c2a8a5862b6487dc876
V2 Signer: certificate SHA-1 digest: d54e6ea721c4b9d753ca42fe550f906bde38f43f
V2 Signer: certificate MD5 digest: a9a1ffd83c9faf3b1dfba1558e182c99
--- apksigner 0.0.48 ---
V2 Signer: certificate DN: C=US, O=Android, CN=Android Debug
V2 Signer: certificate SHA-256 digest: 09d50c2bc684f47492060a20ef88fa075745d2b4aeabfd6d5e412b715e9183f7
V2 Signer: certificate SHA-1 digest: 6a4e7330860a07f8c83955fc0017c20f589fd27a
V2 Signer: certificate MD5 digest: 0ad8dde0d07d83ecf87b0431b2cfc059
0.0.46 signer: 5a5e16933b91f015b5f5da0f178543b63c92e49e595c8c2a8a5862b6487dc876
0.0.48 signer: 09d50c2bc684f47492060a20ef88fa075745d2b4aeabfd6d5e412b715e9183f7
0.0.46 package: com.cinetracker.app
0.0.48 package: com.cinetracker.app
Signing caches visible to repository:
6881243884	refs/heads/main	cinetracker-debug-signing-v1	2026-08-22T03:03:46.103522000Z	2026-08-23T01:12:32.815505000Z
Signing certificate mismatch/unreadable: refusing to publish an APK that cannot update the published 0.0.46.
```
