/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.example.spacefarm2;

import android.os.Bundle;
import org.apache.cordova.*;
import android.webkit.WebSettings; 
import android.webkit.WebSettings.ZoomDensity;
import android.view.WindowManager;


public class CordovaApp extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(launchUrl);
       // WebSettings settings = super.appView.getSettings();
       // super.appView.getSettings().setBuiltInZoomControls(true);
        //super.appView.getSettings().setDefaultZoom(ZoomDensity.MEDIUM);
        //super.appView.getSettings().setSupportZoom(true);
        
        WebSettings settings = appView.getSettings();
        settings.setBuiltInZoomControls(true);
        settings.setSupportZoom(true);
        settings.setDefaultZoom(ZoomDensity.FAR);
       //settings.setDefaultZoom(ZoomDensity.MEDIUM);
        
        /* lock scaling in android 2.2 */
        //appView.getSettings().setSupportZoom(false);
//        appView.getSettings().setUseWideViewPort(false);
//        WebSettings ws = appView.getSettings();
//        ws.setDefaultZoom(WebSettings.ZoomDensity.MEDIUM);
//        appView.getSettings().setDefaultZoom(WebSettings.ZoomDensity.MEDIUM);
//        appView.setInitialScale(0);
//        ws.setSupportZoom(false);
//        ws.setBuiltInZoomControls(false);
//        ws.setUseWideViewPort(false);
    }
    
//    @Override
//    public void onSaveInstanceState(Bundle savedInstanceState) {
//        // Save the user's current game state
//       // savedInstanceState.putInt(STATE_SCORE, mCurrentScore);
//       // savedInstanceState.putInt(STATE_LEVEL, mCurrentLevel);
//        
//        // Always call the superclass so it can save the view hierarchy state
//        super.onSaveInstanceState(savedInstanceState);
//    }
//    
//    public void onRestoreInstanceState(Bundle savedInstanceState) {
//        // Always call the superclass so it can restore the view hierarchy
//        super.onRestoreInstanceState(savedInstanceState);
//       
//        // Restore state members from saved instance
//   
//    }
    
}
