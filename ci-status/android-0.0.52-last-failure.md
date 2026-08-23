# Android 0.0.52 - last build failure

```text
--- node check ---

--- gradle ---
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
> Task :app:desugarDebugFileDependencies
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugStartupProfile
> Task :app:processDebugManifestForPackage
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
gradle/actions: Writing build results to /home/runner/work/_temp/.gradle-actions/build-results/__run_4-1787494851643.json

[Incubating] Problems report is available at: file:///home/runner/work/CineTracker/CineTracker/apps/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/9.7.0/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 24s
33 actionable tasks: 33 executed
Consider enabling configuration cache to speed up this build: https://docs.gradle.org/9.7.0/userguide/configuration_cache_enabling.html

--- signing check ---
V2 Signer: certificate DN: C=US, O=Android, CN=Android Debug
V2 Signer: certificate SHA-256 digest: 1ebe2911e249dbfa98e1ca7f8c6ae5a4669fb9571f5e6f133f29f56870bdee97
V2 Signer: certificate SHA-1 digest: 715c1ad2fd3b25ff1be4fb467c3364c5f470ad1b
V2 Signer: certificate MD5 digest: b0676de1b335b6a93f3ab5f41bedad99
Stored baseline: d4b38d140e7aadce86840a7632485242f8d724eb01b34944be33bfc77543d227
Built signer:    1ebe2911e249dbfa98e1ca7f8c6ae5a4669fb9571f5e6f133f29f56870bdee97
Built package:   com.cinetracker.app
```
