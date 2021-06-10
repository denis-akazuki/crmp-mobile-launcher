package com.unity;
import android.content.SharedPreferences;
import android.opengl.GLSurfaceView;
import android.util.Log;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

class RNGlRenderer implements GLSurfaceView.Renderer {
    private final SharedPreferences shardedPreferences;

    RNGlRenderer(final SharedPreferences shardedPreferences) {
        this.shardedPreferences = shardedPreferences;
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        shardedPreferences
                .edit()
                .putString("GL_RENDERER", gl.glGetString(GL10.GL_RENDERER))
                .apply();
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        
    }
}