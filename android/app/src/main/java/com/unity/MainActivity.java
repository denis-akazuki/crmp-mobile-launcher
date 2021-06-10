package com.unity;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {
	private GlSurfaceInspector surfaceInspector = new GlSurfaceInspector();

	public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			surfaceInspector.init(this);
	}

	@Override
	protected void onPause() {
			super.onPause();
			surfaceInspector.onPause();
	}

	@Override
	protected void onResume() {
			super.onResume();
			surfaceInspector.onResume();
	}

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Unity";
  }
}
