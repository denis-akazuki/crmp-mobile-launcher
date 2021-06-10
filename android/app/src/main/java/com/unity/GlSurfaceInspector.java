package com.unity;
import android.app.Activity;
import android.opengl.GLSurfaceView;
import android.preference.PreferenceManager;
import android.widget.FrameLayout;

public class GlSurfaceInspector {
    private GLSurfaceView glView;

    public void init(Activity activity) {
        glView = new GLSurfaceView(activity);
        glView.setRenderer(new RNGlRenderer(PreferenceManager.getDefaultSharedPreferences(activity)));
        final FrameLayout rootLayout = activity.findViewById(android.R.id.content);
        rootLayout.addView(glView, 1, 1);
    }

    public void onPause() {
        glView.onPause();
    }

    public void onResume() {
        glView.onResume();
    }
}