# Android 0.0.50 - last build failure

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
> Task :app:processDebugManifestForPackage
> Task :app:compressDebugAssets
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:desugarDebugFileDependencies
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugStartupProfile
> Task :app:mergeLibDexDebug
> Task :app:processDebugResources
> Task :app:mergeDebugJavaResource

> Task :app:compileDebugJavaWithJavac
Note: /home/runner/work/CineTracker/CineTracker/apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

> Task :app:mergeExtDexDebug
> Task :app:dexBuilderDebug
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:mergeProjectDexDebug
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
gradle/actions: Writing build results to /home/runner/work/_temp/.gradle-actions/build-results/__run_3-1787457229269.json

[Incubating] Problems report is available at: file:///home/runner/work/CineTracker/CineTracker/apps/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/9.7.0/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 33s
33 actionable tasks: 33 executed
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.7.0/userguide/configuration_cache_enabling.html

--- signing check ---
V2 Signer: certificate DN: C=US, O=Android, CN=Android Debug
V2 Signer: certificate SHA-256 digest: 62749c9d71a2e40b0cbd757a523fcb52de84777565bf773294740c661baa6c6c
V2 Signer: certificate SHA-1 digest: 1dfb3380ed322f612c75ef342ddae581fa0d4992
V2 Signer: certificate MD5 digest: 5b5446c0dbc3fe91b63da2774a4f1d51
Stored baseline: d539b924ce8c66270138aa99534dae0d2b7d8f1be093dcb61c7b53fc0a4862e5
Built signer:    62749c9d71a2e40b0cbd757a523fcb52de84777565bf773294740c661baa6c6c
Built package:   com.cinetracker.app
```
