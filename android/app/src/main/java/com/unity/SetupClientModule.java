package com.unity;
import androidx.core.content.FileProvider;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import java.io.File;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class SetupClientModule extends ReactContextBaseJavaModule {
	private ReactApplicationContext reactContext;
    SetupClientModule (ReactApplicationContext reactContext) {
		super(reactContext);
		this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SetupClientModule";
    }

	@ReactMethod
    public void setup(final String saveAs) {
		File file = new File(saveAs);
		Intent intent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Uri apkUri = FileProvider.getUriForFile(reactContext, this.reactContext.getPackageName() + ".provider", file);
            intent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
            intent.setData(apkUri);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            Uri apkUri = Uri.fromFile(file);
            intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        reactContext.startActivity(intent);
    }

    private static ReactApplicationContext context;
}