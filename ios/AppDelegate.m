/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "NIPRnController.h"
#import "NIPRnManager.h"
#import "NIPIconFontService.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self loadDefaultKeyWindow];
  [NIPIconFontService registerIconFontsByNames:@[@"song"]];
  return YES;
}

- (void)loadDefaultKeyWindow {
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  [self loadRnController];
}


- (void)loadRnController {
  NIPRnController *controller = [[NIPRnManager managerWithBundleUrl:@"" noHotUpdate:NO noJsServer:NO] loadControllerWithModel:@"fego"];
  controller.appProperties = @{@"productFlavor": @"main"};

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wincompatible-pointer-types"
  self.window.rootViewController = controller;
#pragma clang diagnostic pop

  [self.window makeKeyAndVisible];
}

@end


